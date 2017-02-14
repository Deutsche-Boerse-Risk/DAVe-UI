# DAVe-UI Docker image

**DAVe-UI** docker image contains simple preconfigured Nginx based web-server and allows DAVe-UI to be executed in Docker / Kubernetes. It contains an entrypoint which will 
take care of the configuration based on environment variables. The different options are described below.

## Examples

To run DAVe-UI in Docker, you have to pass the environment variables to the `docker run` command.

```
docker run --name DAVe-UI -p 80:80 -p 443:443 --rm \
    -e DAVE_REST_URL=https://api.master.snapshot.dave.dbg-devops.com \
    -e DAVE_HTTP_COMPRESSION=1 \
    -e DAVE_HTTP_SSL_SERVER_PUBLIC_KEY="${webCERT}" \
    -e DAVE_HTTP_SSL_SERVER_PRIVATE_KEY="${webKEY}" \
    scholzj/dave-ui:latest
```

## Options
| Option | Explanation | Default | Example |
|--------|-------------|---------|---------|
| `DAVE_REST_URL` | **REQUIRED:** URL of the DAVe backend | | `https://api.master.snapshot.dave.dbg-devops.com` |
| `DAVE_HTTP_COMPRESSION` | Enable compression of HTTP responses **- Recommended** | disabled | `1` |
| `DAVE_HTTP_SSL_SERVER_PUBLIC_KEY` | Public key of the HTTP server in CRT format | No HTTPS | |
| `DAVE_HTTP_SSL_SERVER_PRIVATE_KEY` | Private key of the HTTP server in PEM format | No HTTPS | |
| `DAVE_HTTP_SSL_TRUSTED_CA` | List of trusted CA for SSL client authentication | No HTTPS | |
| `DAVE_HTTPS_REDIRECT_PORT` | Port number on which the HTTPS server is exposed from outside of the container. | 443 | `15123` |

Once both `DAVE_HTTP_SSL_SERVER_PUBLIC_KEY` and `DAVE_HTTP_SSL_SERVER_PRIVATE_KEY` are provided the server will 
automatically **enable HTTPS protocol and all HTTP based requests will be redirected** to HTTPS protocol.
 
As the port numbers exposed by docker may differ with the actual port numbers defined in the container you may need 
to provide `DAVE_HTTPS_REDIRECT_PORT` on which you expose the HTTPS port to make the redirect work properly.  