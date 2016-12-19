package com.deutscheboerse.risk.dave.restapi.user;

import io.netty.handler.codec.http.HttpResponseStatus;
import io.vertx.core.Vertx;
import io.vertx.core.http.HttpHeaders;
import io.vertx.core.json.DecodeException;
import io.vertx.core.json.Json;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import io.vertx.ext.auth.AuthProvider;
import io.vertx.ext.auth.User;
import io.vertx.ext.auth.jwt.JWTAuth;
import io.vertx.ext.auth.jwt.JWTOptions;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;

import javax.naming.InvalidNameException;
import javax.naming.ldap.LdapName;
import javax.naming.ldap.Rdn;
import javax.net.ssl.SSLPeerUnverifiedException;
import javax.security.cert.X509Certificate;

/**
 * Created by schojak on 29.8.16.
 */
public class UserApi {
    private static final Logger LOG = LoggerFactory.getLogger(UserApi.class);
    private static final Long DEFAULT_JWT_TOKEN_EXPIRATION_MINUTES = 60L;
    private static final Boolean DEFAULT_AUTH_CHECK_USER_AGAINST_CERTIFICATE = false;

    private final Vertx vertx;
    private final JWTAuth jwtAuthProvider;
    private final AuthProvider mongoAuthProvider;
    private final Boolean checkUserAgainstCertificate;
    private final JsonObject config;

    public UserApi(Vertx vertx, JWTAuth jwtAuthProvider, AuthProvider mongoAuthProvider, JsonObject config) {
        this.vertx = vertx;
        this.config = config;
        this.checkUserAgainstCertificate = config.getBoolean("checkUserAgainstCertificate", UserApi.DEFAULT_AUTH_CHECK_USER_AGAINST_CERTIFICATE);
        this.jwtAuthProvider = jwtAuthProvider;
        this.mongoAuthProvider = mongoAuthProvider;
    }

    public UserApi(Vertx vertx, JsonObject config) {
        this(vertx, null, null, config);
    }

    public void login(RoutingContext routingContext) {
        if (jwtAuthProvider != null) {
            LOG.info("Starting authentication for login request from {}!", routingContext.request().remoteAddress().toString());

            try {
                JsonObject record = routingContext.getBodyAsJson();
                String username = record.getString("username");
                String password = record.getString("password");
                if (username == null || password == null) {
                    LOG.warn("No username or password provided in login request");
                    routingContext.fail(HttpResponseStatus.BAD_REQUEST.code());
                } else {
                    if (checkUserAgainstCertificate)
                    {
                        if (!routingContext.request().isSSL())
                        {
                            LOG.error("Cannot validate username against certificate on plain HTTP connection.");
                            routingContext.fail(HttpResponseStatus.FORBIDDEN.code());

                            return;
                        }

                        try {
                            X509Certificate[] peerCertificates = routingContext.request().peerCertificateChain();

                            if (peerCertificates.length < 1)
                            {
                                LOG.error("No peer certificate in the chain");
                                routingContext.fail(HttpResponseStatus.FORBIDDEN.code());

                                return;
                            }

                            X509Certificate peerCertificate = peerCertificates[0];

                            try {
                                LdapName subject = new LdapName(peerCertificate.getSubjectDN().getName());

                                String cn = null;

                                for (Rdn rdn : subject.getRdns())
                                {
                                    if (rdn.getType().equalsIgnoreCase("CN"))
                                    {
                                        cn = rdn.getValue().toString();
                                    }
                                }

                                if (cn != null && cn.equals(username))
                                {
                                    LOG.warn("User {} matches the TLS CN {}.", username, cn);
                                }
                                else
                                {
                                    LOG.warn("User {} doesn't match the TLS CN {}. Failed to authenticate!", username, cn);
                                    routingContext.fail(HttpResponseStatus.FORBIDDEN.code());

                                    return;
                                }

                            } catch (InvalidNameException e) {
                                LOG.error("Failed to parse peer's certificate subject.", e);
                                routingContext.fail(HttpResponseStatus.FORBIDDEN.code());

                                return;
                            }
                        }
                        catch (SSLPeerUnverifiedException e)
                        {
                            LOG.error("Peer's certificate was not verified", e);
                            routingContext.fail(HttpResponseStatus.FORBIDDEN.code());

                            return;
                        }
                    }

                    JsonObject authInfo = new JsonObject().put("username", username).put("password", password);
                    mongoAuthProvider.authenticate(authInfo, res -> {
                        if (res.succeeded()) {
                            User user = res.result();
                            routingContext.setUser(user);
                            JsonObject tokenObject = new JsonObject().put("username", user.principal().getString("username"));
                            Long tokenExpiration = this.config.getLong("jwtTokenExpiration", UserApi.DEFAULT_JWT_TOKEN_EXPIRATION_MINUTES);
                            String token = jwtAuthProvider.generateToken(tokenObject, new JWTOptions().setExpiresInMinutes(tokenExpiration));
                            JsonObject resp = new JsonObject().put("token", token);

                            routingContext.response()
                                    .putHeader("content-type", "application/json; charset=utf-8")
                                    .end(Json.encodePrettily(resp));
                            LOG.info("User {} authenticated successfully from {}", username, routingContext.request().remoteAddress().toString());
                        } else {
                            routingContext.fail(HttpResponseStatus.FORBIDDEN.code());
                            LOG.warn("User {} failed to authenticate from {}!", username, routingContext.request().remoteAddress().toString());
                        }
                    });
                }
            } catch (DecodeException e) {
                routingContext.fail(HttpResponseStatus.BAD_REQUEST.code());
            }
        }
        else
        {
            JsonObject resp = new JsonObject().put("username", "Annonymous");
            routingContext.response()
                    .putHeader("content-type", "application/json; charset=utf-8")
                    .end(Json.encodePrettily(resp));
        }
    }

    public void loginStatus(RoutingContext routingContext) {
        JsonObject response = new JsonObject();
        String token = routingContext.request().getHeader(HttpHeaders.AUTHORIZATION);
        if (jwtAuthProvider != null) {
            if (token != null) {
                token = token.replaceFirst("Bearer", "").trim();
                JsonObject authInfo = new JsonObject().put("jwt", token);
                jwtAuthProvider.authenticate(authInfo, res -> {
                    if (res.succeeded()) {
                        User user = res.result();
                        if (user != null) {
                            response.put("username", user.principal().getString("username"));
                        }
                    }
                });
            }
        } else {
            response.put("username", "Annonymous");
        }
        routingContext.response()
                .putHeader("content-type", "application/json; charset=utf-8")
                .end(response.encodePrettily());
    }

    public void refreshToken(RoutingContext routingContext) {
        JsonObject tokenObject = new JsonObject().put("username", routingContext.user().principal().getString("username"));
        Long tokenExpiration = this.config.getLong("jwtTokenExpiration", UserApi.DEFAULT_JWT_TOKEN_EXPIRATION_MINUTES);
        String newToken = jwtAuthProvider.generateToken(tokenObject, new JWTOptions().setExpiresInMinutes(tokenExpiration));
        JsonObject resp = new JsonObject().put("token", newToken);
        routingContext.response()
                .putHeader("content-type", "application/json; charset=utf-8")
                .end(Json.encodePrettily(resp));
    }

    public Router getRoutes()
    {
        Router router = Router.router(vertx);

        router.post("/login").handler(this::login);
        router.get("/loginStatus").handler(this::loginStatus);
        router.get("/refreshToken").handler(this::refreshToken);

        return router;
    }
}
