package com.deutscheboerse.risk.dave;

import io.netty.handler.codec.http.HttpResponseStatus;
import io.vertx.core.DeploymentOptions;
import io.vertx.core.Vertx;
import io.vertx.core.buffer.Buffer;
import io.vertx.core.http.HttpClient;
import io.vertx.core.http.HttpClientOptions;
import io.vertx.core.http.HttpHeaders;
import io.vertx.core.json.Json;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.core.net.JksOptions;
import io.vertx.ext.auth.mongo.HashSaltStyle;
import io.vertx.ext.auth.mongo.MongoAuth;
import io.vertx.ext.mongo.MongoClient;
import io.vertx.ext.unit.Async;
import io.vertx.ext.unit.TestContext;
import io.vertx.ext.unit.junit.VertxUnitRunner;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;

import java.util.*;

@RunWith(VertxUnitRunner.class)
public class AuthIT {
    private static final String USER_COLLECTION_NAME = "user";
    private static final String SALT = "DAVe";
    private static final String USER = "user1";
    private static final String USER2 = "user2";
    private static final String PASSWORD = "123456";

    private static Vertx vertx;
    private static MongoClient mongoClient;
    private static int port;
    private static int mongoPort;
    private static String dbName;

    @BeforeClass
    public static void setUp(TestContext context) {
        AuthIT.vertx = Vertx.vertx();
        AuthIT.port = Integer.getInteger("http.port", 8080);
        AuthIT.mongoPort = Integer.getInteger("mongodb.port", 27017);
        AuthIT.dbName = "DAVe-Test" + UUID.randomUUID().getLeastSignificantBits();

        JsonObject dbConfig = new JsonObject();
        dbConfig.put("db_name", dbName);
        dbConfig.put("connection_string", "mongodb://localhost:" + mongoPort);

        AuthIT.mongoClient = MongoClient.createShared(AuthIT.vertx, dbConfig);
        initUserDb(context);
        insertUser(context, USER, PASSWORD);
        insertUser(context, USER2, PASSWORD);
        mockDBQuery();
    }

    private static void initUserDb(TestContext context)
    {
        final Async asyncCollection = context.async();
        mongoClient.createCollection(USER_COLLECTION_NAME, res -> {
            if (res.succeeded())
            {
                asyncCollection.complete();
            }
            else
            {
                context.fail("Failed to create " + USER_COLLECTION_NAME + " collection");
            }
        });

        asyncCollection.awaitSuccess();

        final Async asyncIndicies = context.async();

        JsonArray indexes = new JsonArray();
        JsonObject key = new JsonObject().put("username", 1);
        indexes.add(new JsonObject().put("key", key).put("name", "username_index").put("unique", true));
        JsonObject command = new JsonObject()
                .put("createIndexes", USER_COLLECTION_NAME)
                .put("indexes", indexes);
        mongoClient.runCommand("createIndexes", command, res -> {
            if (res.succeeded())
            {
                asyncIndicies.complete();
            }
            else
            {
                context.fail("Failed to create indicies on " + USER_COLLECTION_NAME + " collection");
            }
        });

        asyncIndicies.awaitSuccess();
    }

    private static void insertUser(TestContext context, String username, String password)
    {
        final Async asyncInsert = context.async();

        JsonObject authProperties = new JsonObject();
        MongoAuth authProvider = MongoAuth.create(mongoClient, authProperties);
        authProvider.getHashStrategy().setSaltStyle(HashSaltStyle.EXTERNAL);
        authProvider.getHashStrategy().setExternalSalt(SALT);
        authProvider.insertUser(username, password, Collections.emptyList(), Collections.emptyList(), res -> {
            if (res.succeeded())
            {
                asyncInsert.complete();
            }
            else
            {
                context.fail("Failed to add user " + username + " into the database");
            }
        });
    }

    private final static void mockDBQuery()
    {
        vertx.eventBus().consumer("query.latestTradingSessionStatus", msg -> {
            msg.reply("{}");
        });
    }

    private void deployHttpVerticle(TestContext context, JsonObject config)
    {
        final Async asyncStart = context.async();

        vertx.deployVerticle(HttpVerticle.class.getName(), new DeploymentOptions().setConfig(config), res -> {
            if (res.succeeded()) {
                asyncStart.complete();
            }
            else
            {
                context.fail(res.cause());
            }
        });

        asyncStart.awaitSuccess();
    }

    @Test
    public void testAuthDisabled(TestContext context) {
        JsonObject config = new JsonObject().put("httpPort", port).put("auth", new JsonObject().put("enable", false));
        config.put("mode", HttpVerticle.Mode.HTTP);
        deployHttpVerticle(context, config);

        final Async asyncLoginStatus = context.async();

        vertx.createHttpClient().getNow(port, "localhost", "/api/v1.0/user/loginStatus", res -> {
            context.assertEquals(200, res.statusCode());
            res.bodyHandler(body -> {
                JsonObject bd = body.toJsonObject();
                context.assertEquals(new JsonObject().put("username", "Annonymous"), bd);
                asyncLoginStatus.complete();
            });
        });

        final Async asyncLogin = context.async();

        vertx.createHttpClient().post(port, "localhost", "/api/v1.0/user/login", res -> {
            context.assertEquals(200, res.statusCode());
            res.bodyHandler(body -> {
                JsonObject bd = body.toJsonObject();
                context.assertEquals(new JsonObject().put("username", "Annonymous"), bd);
                asyncLogin.complete();
            });
        }).end(Json.encodePrettily(new JsonObject().put("username", USER).put("password", PASSWORD)));
    }

    @Test
    public void testLoginStatus(TestContext context) {
        JsonObject config = new JsonObject().put("httpPort", port).put("auth", new JsonObject().put("enable", true).put("jwtKeystorePath", getClass().getResource("jwt-keystore.jceks").getPath()).put("jwtKeystorePassword", "secret").put("jwtKeystoreType", "jceks").put("dbName", dbName).put("connectionUrl", "mongodb://localhost:" + mongoPort).put("salt", SALT).put("checkUserAgainstCertificate", false));
        config.put("mode", HttpVerticle.Mode.HTTP);
        deployHttpVerticle(context, config);

        HttpClient client = vertx.createHttpClient();

        // Not logged in => loginStatus should return empty JsonObject
        final Async asyncNotLoggedIn = context.async();
        client.getNow(port, "localhost", "/api/v1.0/user/loginStatus", res -> {
            context.assertEquals(200, res.statusCode());
            res.bodyHandler(body -> {
                JsonObject bd = body.toJsonObject();
                context.assertEquals(new JsonObject(), bd);
                asyncNotLoggedIn.complete();
            });
        });
    }

    @Test
    public void testUnauthorizedAccess(TestContext context) {
        JsonObject config = new JsonObject().put("httpPort", port).put("auth", new JsonObject().put("enable", true).put("jwtKeystorePath", getClass().getResource("jwt-keystore.jceks").getPath()).put("jwtKeystorePassword", "secret").put("jwtKeystoreType", "jceks").put("dbName", dbName).put("connectionUrl", "mongodb://localhost:" + mongoPort).put("salt", SALT).put("checkUserAgainstCertificate", false));
        config.put("mode", HttpVerticle.Mode.HTTP);
        deployHttpVerticle(context, config);

        HttpClient client = vertx.createHttpClient();

        // Not logged in => REST access should return
        final Async asyncUnauthorized = context.async();
        client.getNow(port, "localhost", "/api/v1.0/tss/latest", res -> {
            context.assertEquals(401, res.statusCode());
            asyncUnauthorized.complete();
        });
    }

    @Test
    public void testLoginWrongPassword(TestContext context) {
        JsonObject config = new JsonObject().put("httpPort", port).put("auth", new JsonObject().put("enable", true).put("jwtKeystorePath", getClass().getResource("jwt-keystore.jceks").getPath()).put("jwtKeystorePassword", "secret").put("jwtKeystoreType", "jceks").put("dbName", dbName).put("connectionUrl", "mongodb://localhost:" + mongoPort).put("salt", SALT).put("checkUserAgainstCertificate", false));
        config.put("mode", HttpVerticle.Mode.HTTP);
        deployHttpVerticle(context, config);

        HttpClient client = vertx.createHttpClient();

        // Log in with wrong password
        final Async asyncLogin = context.async();
        client.post(port, "localhost", "/api/v1.0/user/login", res -> {
            context.assertEquals(403, res.statusCode());
            asyncLogin.complete();
        }).end(Json.encodePrettily(new JsonObject().put("username", USER).put("password", "wrongpassword")));
    }

    @Test
    public void testLoginWithBinaryData(TestContext context) {
        JsonObject config = new JsonObject().put("httpPort", port).put("auth", new JsonObject().put("enable", true).put("jwtKeystorePath", getClass().getResource("jwt-keystore.jceks").getPath()).put("jwtKeystorePassword", "secret").put("jwtKeystoreType", "jceks").put("dbName", dbName).put("connectionUrl", "mongodb://localhost:" + mongoPort).put("salt", SALT).put("checkUserAgainstCertificate", false));
        config.put("mode", HttpVerticle.Mode.HTTP);
        deployHttpVerticle(context, config);

        HttpClient client = vertx.createHttpClient();

        // Log in with some binary garbage
        final Async asyncLogin = context.async();
        client.post(port, "localhost", "/api/v1.0/user/login", res -> {
            context.assertEquals(HttpResponseStatus.BAD_REQUEST.code(), res.statusCode());
            asyncLogin.complete();
        }).end(Buffer.buffer(new byte[] {1, 3, 5, 7, 9}));
    }

    @Test
    public void testLoginNonexistentUser(TestContext context) {
        JsonObject config = new JsonObject().put("httpPort", port).put("auth", new JsonObject().put("enable", true).put("jwtKeystorePath", getClass().getResource("jwt-keystore.jceks").getPath()).put("jwtKeystorePassword", "secret").put("jwtKeystoreType", "jceks").put("dbName", dbName).put("connectionUrl", "mongodb://localhost:" + mongoPort).put("salt", SALT).put("checkUserAgainstCertificate", false));
        config.put("mode", HttpVerticle.Mode.HTTP);
        deployHttpVerticle(context, config);

        HttpClient client = vertx.createHttpClient();

        // Log in with wrong username
        final Async asyncLogin = context.async();
        client.post(port, "localhost", "/api/v1.0/user/login", res -> {
            context.assertEquals(403, res.statusCode());
            asyncLogin.complete();
        }).end(Json.encodePrettily(new JsonObject().put("username", "idonotexist").put("password", PASSWORD)));
    }

    @Test
    public void testLoginWrongRequest(TestContext context) {
        JsonObject config = new JsonObject().put("httpPort", port).put("auth", new JsonObject().put("enable", true).put("jwtKeystorePath", getClass().getResource("jwt-keystore.jceks").getPath()).put("jwtKeystorePassword", "secret").put("jwtKeystoreType", "jceks").put("dbName", dbName).put("connectionUrl", "mongodb://localhost:" + mongoPort).put("salt", SALT).put("checkUserAgainstCertificate", false));
        config.put("mode", HttpVerticle.Mode.HTTP);
        deployHttpVerticle(context, config);

        HttpClient client = vertx.createHttpClient();

        // Log in with wrong request
        final Async asyncLoginEmptyJson = context.async();
        client.post(port, "localhost", "/api/v1.0/user/login", res -> {
            context.assertEquals(400, res.statusCode());
            asyncLoginEmptyJson.complete();
        }).end(Json.encodePrettily(new JsonObject()));

        // Log in with wrong request
        final Async asyncLoginNoPassword = context.async();
        client.post(port, "localhost", "/api/v1.0/user/login", res -> {
            context.assertEquals(400, res.statusCode());
            asyncLoginNoPassword.complete();
        }).end(Json.encodePrettily(new JsonObject().put("username", USER)));

        // Log in with wrong request
        final Async asyncLoginNoUsername = context.async();
        client.post(port, "localhost", "/api/v1.0/user/login", res -> {
            context.assertEquals(400, res.statusCode());
            asyncLoginNoUsername.complete();
        }).end(Json.encodePrettily(new JsonObject().put("password", PASSWORD)));
    }

    @Test
    public void testLogin(TestContext context) {
        JsonObject config = new JsonObject().put("httpPort", port).put("auth", new JsonObject().put("enable", true).put("jwtKeystorePath", getClass().getResource("jwt-keystore.jceks").getPath()).put("jwtKeystorePassword", "secret").put("jwtKeystoreType", "jceks").put("dbName", dbName).put("connectionUrl", "mongodb://localhost:" + mongoPort).put("salt", SALT).put("checkUserAgainstCertificate", false));
        config.put("mode", HttpVerticle.Mode.HTTP);
        deployHttpVerticle(context, config);

        HttpClient client = vertx.createHttpClient();

        // Log in
        final Async asyncLogin = context.async();
        final Async asyncLoginStatus = context.async();
        final Async asyncAuthorized = context.async();
        client.post(port, "localhost", "/api/v1.0/user/login", res -> {
            context.assertEquals(200, res.statusCode());
            res.bodyHandler(loginBody -> {
                String token = loginBody.toJsonObject().getString("token");
                // Logged in => loginStatus should return JsonObject with username
                client.get(port, "localhost", "/api/v1.0/user/loginStatus", statusRes -> {
                    context.assertEquals(200, statusRes.statusCode());
                    statusRes.bodyHandler(body -> {
                        JsonObject bd = body.toJsonObject();
                        context.assertEquals(new JsonObject().put("username", "user1"), bd);
                        asyncLoginStatus.complete();
                    });
                }).putHeader(HttpHeaders.AUTHORIZATION, String.format("Bearer %s", token)).end();

                // Logged in => REST access should return 200
                client.get(port, "localhost", "/api/v1.0/tss/latest", tssRes -> {
                    context.assertEquals(200, tssRes.statusCode());
                    asyncAuthorized.complete();
                }).putHeader(HttpHeaders.AUTHORIZATION, String.format("Bearer %s", token)).end();
            });
            asyncLogin.complete();
        }).end(Json.encodePrettily(new JsonObject().put("username", USER).put("password", PASSWORD)));
    }

    @Test
    public void testLoginWithExpiredToken(TestContext context) {
        JsonObject config = new JsonObject().put("httpPort", port).put("auth", new JsonObject().put("enable", true).put("jwtKeystorePath", getClass().getResource("jwt-keystore.jceks").getPath()).put("jwtKeystorePassword", "secret").put("jwtKeystoreType", "jceks").put("dbName", dbName).put("connectionUrl", "mongodb://localhost:" + mongoPort).put("salt", SALT).put("checkUserAgainstCertificate", false));
        config.put("mode", HttpVerticle.Mode.HTTP);
        deployHttpVerticle(context, config);

        HttpClient client = vertx.createHttpClient();

        // Log in
        final String expiredToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE0ODIxNTE4NTIsImlhdCI6MTQ4MjE1MTc5MiwidXNlcm5hbWUiOiJzY2hvamFrIn0=.fUgxPZyKBPml0siTJZD7YWF-7_XrD0k9-R9izrM1_xw=";
        final Async asyncExpired = context.async();
        client.get(port, "localhost", "/api/v1.0/tss/latest", res -> {
            context.assertEquals(401, res.statusCode());
            asyncExpired.complete();
        }).putHeader(HttpHeaders.AUTHORIZATION, String.format("Bearer %s", expiredToken)).end();;
    }

    @Test
    public void testTokenRefresh(TestContext context) {
        JsonObject config = new JsonObject().put("httpPort", port).put("auth", new JsonObject().put("enable", true).put("jwtKeystorePath", getClass().getResource("jwt-keystore.jceks").getPath()).put("jwtKeystorePassword", "secret").put("jwtKeystoreType", "jceks").put("dbName", dbName).put("connectionUrl", "mongodb://localhost:" + mongoPort).put("salt", SALT).put("checkUserAgainstCertificate", false));
        config.put("mode", HttpVerticle.Mode.HTTP);
        deployHttpVerticle(context, config);

        HttpClient client = vertx.createHttpClient();

        // Log in
        final Async asyncLogin = context.async();
        final Async asyncRefresh = context.async();
        final Async asyncAuthorized = context.async();
        client.post(port, "localhost", "/api/v1.0/user/login", res -> {
            context.assertEquals(200, res.statusCode());
            res.bodyHandler(loginBody -> {
                String token = loginBody.toJsonObject().getString("token");
                // Logged in => let's ask for a new token
                client.get(port, "localhost", "/api/v1.0/user/refreshToken", statusRes -> {
                    context.assertEquals(200, statusRes.statusCode());
                    statusRes.bodyHandler(body -> {
                        String refreshToken = body.toJsonObject().getString("token");
                        // REST access with refreshed token should return 200
                        client.get(port, "localhost", "/api/v1.0/tss/latest", tssRes -> {
                            context.assertEquals(200, tssRes.statusCode());
                            asyncAuthorized.complete();
                        }).putHeader(HttpHeaders.AUTHORIZATION, String.format("Bearer %s", refreshToken)).end();
                        asyncRefresh.complete();
                    });
                }).putHeader(HttpHeaders.AUTHORIZATION, String.format("Bearer %s", token)).end();
            });
            asyncLogin.complete();
        }).end(Json.encodePrettily(new JsonObject().put("username", USER).put("password", PASSWORD)));
    }

    private String getCsrfCookie(List<String> cookies)
    {
        String token = null;

        for (String cookie : cookies)
        {
            if (cookie.startsWith("XSRF-TOKEN="))
            {
                token = cookie.replaceFirst("XSRF-TOKEN=", "");
            }
        }

        return token;
    }

    @Test
    public void testLoginWithCSRF(TestContext context) {
        JsonObject config = new JsonObject().put("httpPort", port).put("auth", new JsonObject().put("enable", true).put("jwtKeystorePath", getClass().getResource("jwt-keystore.jceks").getPath()).put("jwtKeystorePassword", "secret").put("jwtKeystoreType", "jceks").put("dbName", dbName).put("connectionUrl", "mongodb://localhost:" + mongoPort).put("salt", SALT).put("checkUserAgainstCertificate", false)).put("CSRF", new JsonObject().put("enable", true).put("secret", "big-secret"));
        config.put("mode", HttpVerticle.Mode.HTTP);
        deployHttpVerticle(context, config);

        HttpClient client = vertx.createHttpClient();

        // Get the initial token
        final Async asyncToken = context.async();
        final Async asyncLoginStatus = context.async();
        final Async asyncAuthorized = context.async();
        client.getNow(port, "localhost", "/api/v1.0/user/loginStatus", tokenRes -> {
            String csrfToken = getCsrfCookie(tokenRes.cookies());

            // Log in
            final Async asyncLogin = context.async();
            client.post(port, "localhost", "/api/v1.0/user/login", res -> {
                context.assertEquals(200, res.statusCode());
                res.bodyHandler(loginBody -> {
                    String token = loginBody.toJsonObject().getString("token");
                    // Logged in => loginStatus should return JsonObject with username
                    client.get(port, "localhost", "/api/v1.0/user/loginStatus", statusRes -> {
                        context.assertEquals(200, statusRes.statusCode());
                        statusRes.bodyHandler(body -> {
                            JsonObject bd = body.toJsonObject();
                            context.assertEquals(new JsonObject().put("username", "user1"), bd);
                            asyncLoginStatus.complete();
                        });
                    }).putHeader(HttpHeaders.AUTHORIZATION, String.format("Bearer %s", token)).end();

                    // Logged in => REST access should return 200
                    client.get(port, "localhost", "/api/v1.0/tss/latest", tssRes -> {
                        context.assertEquals(200, tssRes.statusCode());
                        asyncAuthorized.complete();
                    }).putHeader(HttpHeaders.AUTHORIZATION, String.format("Bearer %s", token)).end();
                });
                asyncLogin.complete();
            }).putHeader("X-XSRF-TOKEN", csrfToken).end(Json.encodePrettily(new JsonObject().put("username", USER).put("password", PASSWORD)));
            asyncToken.complete();
        });

        asyncToken.awaitSuccess();
    }

    @Test
    public void testAuthWithSslClientAuth(TestContext context) {
        JsonObject config = new JsonObject().put("ssl", new JsonObject().put("httpsPort", port)
                .put("enable", true).put("keystore", getClass().getResource("http.keystore").getPath()).put("keystorePassword", "123456").put("truststore", getClass().getResource("http.truststore").getPath()).put("truststorePassword", "123456").put("requireTLSClientAuth", true))
                .put("auth", new JsonObject().put("enable", true).put("jwtKeystorePath", getClass().getResource("jwt-keystore.jceks").getPath()).put("jwtKeystorePassword", "secret").put("jwtKeystoreType", "jceks").put("dbName", dbName).put("connectionUrl", "mongodb://localhost:" + mongoPort).put("salt", SALT).put("checkUserAgainstCertificate", true));
        config.put("mode", HttpVerticle.Mode.HTTPS);
        deployHttpVerticle(context, config);

        HttpClientOptions sslClientAuthOpts = new HttpClientOptions().setSsl(true).setTrustStoreOptions(new JksOptions().setPath(getClass().getResource("client.truststore").getPath()).setPassword("123456")).setKeyStoreOptions(new JksOptions().setPath(getClass().getResource("client.keystore").getPath()).setPassword("123456"));
        HttpClient client = vertx.createHttpClient(sslClientAuthOpts);

        // Log in with username not matching certificate subject
        final Async asyncLoginWithWrongUser = context.async();
        client.post(port, "localhost", "/api/v1.0/user/login", res -> {
            context.assertEquals(403, res.statusCode());
            asyncLoginWithWrongUser.complete();
        }).end(Json.encodePrettily(new JsonObject().put("username", USER2).put("password", PASSWORD)));

        // Log in with proper certificate subject
        final Async asyncLogin = context.async();
        final Async asyncLoginStatus = context.async();
        final Async asyncAuthorized = context.async();
        client.post(port, "localhost", "/api/v1.0/user/login", res -> {
            context.assertEquals(200, res.statusCode());
            res.bodyHandler(loginBody -> {
                String token = loginBody.toJsonObject().getString("token");
                // Logged in => loginStatus should return JsonObject with username
                client.get(port, "localhost", "/api/v1.0/user/loginStatus", statusRes -> {
                    context.assertEquals(200, statusRes.statusCode());
                    statusRes.bodyHandler(body -> {
                        JsonObject bd = body.toJsonObject();
                        context.assertEquals(new JsonObject().put("username", "user1"), bd);
                        asyncLoginStatus.complete();
                    });
                }).putHeader(HttpHeaders.AUTHORIZATION, String.format("Bearer %s", token)).end();

                // Logged in => REST access should return 200
                client.get(port, "localhost", "/api/v1.0/tss/latest", tssRes -> {
                    context.assertEquals(200, tssRes.statusCode());
                    asyncAuthorized.complete();
                }).putHeader(HttpHeaders.AUTHORIZATION, String.format("Bearer %s", token)).end();
            });
            asyncLogin.complete();
        }).end(Json.encodePrettily(new JsonObject().put("username", USER).put("password", PASSWORD)));
    }

    @Test
    public void testAuthWithSslClientAuthWithoutClientCert(TestContext context) {
        JsonObject config = new JsonObject().put("ssl", new JsonObject().put("httpsPort", port)
                .put("enable", true).put("keystore", getClass().getResource("http.keystore").getPath()).put("keystorePassword", "123456").put("requireTLSClientAuth", false))
                .put("auth", new JsonObject().put("enable", true).put("jwtKeystorePath", getClass().getResource("jwt-keystore.jceks").getPath()).put("jwtKeystorePassword", "secret").put("jwtKeystoreType", "jceks").put("dbName", dbName).put("connectionUrl", "mongodb://localhost:" + mongoPort).put("salt", SALT).put("checkUserAgainstCertificate", true));
        config.put("mode", HttpVerticle.Mode.HTTPS);
        deployHttpVerticle(context, config);

        HttpClientOptions sslClientAuthOpts = new HttpClientOptions().setSsl(true).setTrustStoreOptions(new JksOptions().setPath(getClass().getResource("client.truststore").getPath()).setPassword("123456"));
        HttpClient client = vertx.createHttpClient(sslClientAuthOpts);

        // Log in with username not matching certificate subject
        final Async asyncLoginWithoutSSL = context.async();
        client.post(port, "localhost", "/api/v1.0/user/login", res -> {
            context.assertEquals(403, res.statusCode());
            asyncLoginWithoutSSL.complete();
        }).end(Json.encodePrettily(new JsonObject().put("username", USER).put("password", PASSWORD)));
    }

    @Test
    public void testAuthWithSslClientAuthWithoutActualSsl(TestContext context) {
        JsonObject config = new JsonObject().put("ssl", new JsonObject().put("httpsPort", port)
                .put("enable", false))
                .put("auth", new JsonObject().put("enable", true).put("jwtKeystorePath", getClass().getResource("jwt-keystore.jceks").getPath()).put("jwtKeystorePassword", "secret").put("jwtKeystoreType", "jceks").put("dbName", dbName).put("connectionUrl", "mongodb://localhost:" + mongoPort).put("salt", SALT).put("checkUserAgainstCertificate", true));
        config.put("mode", HttpVerticle.Mode.HTTPS);
        deployHttpVerticle(context, config);

        HttpClient client = vertx.createHttpClient();

        // Log in with username not matching certificate subject
        final Async asyncLoginWithoutSSL = context.async();
        client.post(port, "localhost", "/api/v1.0/user/login", res -> {
            context.assertEquals(403, res.statusCode());
            asyncLoginWithoutSSL.complete();
        }).end(Json.encodePrettily(new JsonObject().put("username", USER).put("password", PASSWORD)));
    }

    @After
    public void cleanup(TestContext context)
    {
        vertx.deploymentIDs().forEach(id -> {
            vertx.undeploy(id, context.asyncAssertSuccess());
        });
    }

    @AfterClass
    public static void tearDown(TestContext context) {
        AuthIT.vertx.close(context.asyncAssertSuccess());
    }
}
