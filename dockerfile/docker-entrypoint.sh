#!/bin/bash
set -e

# if command starts with an option, prepend the start script
if [ "${1:0:1}" = '-' ]; then
  set -- ./bin/start_dave.sh "$@"
fi

if [ "$1" = "./bin/start_dave.sh" ]; then
  CONFIG_DB=()
  CONFIG_HTTP=()
  CONFIG_ERS_DEBUGGER=()
  CONFIG_ERS=()
  CONFIG_MASTERDATA=()


  #####
  # Logging
  #####
  if [ -z "$DAVE_LOG_LEVEL" ]; then
    DAVE_LOG_LEVEL="INFO"
  fi

  # Write the logging configuration file
  loggingConfigFile="$(pwd)/etc/logback.xml"
  cat > $loggingConfigFile <<-EOS
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
    <layout class="ch.qos.logback.classic.PatternLayout">
      <Pattern>
        %d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n
      </Pattern>
    </layout>
  </appender>
  <root level="${DAVE_LOG_LEVEL}">
    <appender-ref ref="STDOUT" />
  </root>
</configuration>
EOS

  #####
  # DB
  #####
  # DB name
  if [ -z "$DAVE_DB_NAME" ]; then
    DAVE_DB_NAME="DAVe"
  fi

  # If DAVE_DB_URL is present, use the URL.
  # Else build the URL from the individual fields.
  if [ "$DAVE_DB_URL" ]; then
    db_url="${DAVE_DB_URL}"
  else
    # DB hostname
    if [ -z "$DAVE_DB_HOSTNAME" ]; then
      DAVE_DB_HOSTNAME="mongo"
    fi

    # DB port
    if [ -z "$DAVE_DB_PORT" ]; then
      DAVE_DB_PORT=27017
    fi

    # DB username
    if [ -z "$DAVE_DB_USERNAME" ]; then
      DAVE_DB_USERNAME=""
    fi

    # DB password
    if [ -z "$DAVE_DB_PASSWORD" ]; then
      DAVE_DB_PASSWORD=""
    fi

    # Create DB URL
    if [[ "$DAVE_DB_USERNAME" && "$DAVE_DB_PASSWORD" ]]; then
      db_url="mongodb://${DAVE_DB_USERNAME}:${DAVE_DB_PASSWORD}@${DAVE_DB_HOSTNAME}:${DAVE_DB_PORT}"
    else
      db_url="mongodb://${DAVE_DB_HOSTNAME}:${DAVE_DB_PORT}"
    fi
  fi

  db_config="\"dbName\": \"${DAVE_DB_NAME}\", \"connectionUrl\": \"${db_url}\""
  CONFIG_DB+=("$db_config")

  #####
  # HTTP
  #####
  if [ "$DAVE_HTTP_ENABLE" ]; then
    # Compression
    if [ "$DAVE_HTTP_COMPRESSION" ]; then
      http_compression="\"compression\": true"
      CONFIG_HTTP+=("$http_compression")
    else
      http_compression="\"compression\": false"
      CONFIG_HTTP+=("$http_compression")
    fi

    # CORS
    if [ "$DAVE_HTTP_CORS" ]; then
      if [ -z "$DAVE_HTTP_CORS_ORIGIN" ]; then
        DAVE_HTTP_CORS_ORIGIN="*"
      fi
      http_cors="\"CORS\": { \"enable\": true, \"origin\": \"${DAVE_HTTP_CORS_ORIGIN}\" }"
      CONFIG_HTTP+=("$http_cors")
    else
      http_cors="\"CORS\": { \"enable\": false }"
      CONFIG_HTTP+=("$http_cors")
    fi

    # CORS
    if [ "$DAVE_HTTP_CSRF" ]; then
      if [ -z "$DAVE_HTTP_CSRF_SECRET" ]; then
        DAVE_HTTP_CSRF_SECRET="$(date +%s | sha256sum | base64 | head -c 32 ; echo)"
      fi
      http_csrf="\"CSRF\": { \"enable\": true, \"secret\": \"${DAVE_HTTP_CSRF_SECRET}\" }"
      CONFIG_HTTP+=("$http_csrf")
    else
      http_csrf="\"CSRF\": { \"enable\": false }"
      CONFIG_HTTP+=("$http_csrf")
    fi

    # SSL
    if [[ "$DAVE_HTTP_SSL_SERVER_PUBLIC_KEY" && "$DAVE_HTTP_SSL_SERVER_PRIVATE_KEY" ]]; then
      jks_password="$(date +%s | sha256sum | base64 | head -c 32 ; echo)"

      keystorePath="$(pwd)/etc/http.keystore"
      tempDir="$(mktemp -d)"
      echo "$DAVE_HTTP_SSL_SERVER_PUBLIC_KEY" > $tempDir/keystore.crt
      echo "$DAVE_HTTP_SSL_SERVER_PRIVATE_KEY" > $tempDir/keystore.pem
      openssl pkcs12 -export -in $tempDir/keystore.crt -inkey $tempDir/keystore.pem -out $tempDir/keystore.p12 -passout pass:$jks_password
      keytool -importkeystore -srckeystore $tempDir/keystore.p12 -srcstoretype PKCS12 -srcstorepass $jks_password -destkeystore $keystorePath -deststoretype JKS -deststorepass $jks_password
      rm -rf $tempDir

      if [ "$DAVE_HTTP_REDIRECT" ]; then
        httpRedirect="true"
        if [ "$DAVE_HTTP_REDIRECT_URI" ]; then
          httpRedirectUri="$DAVE_HTTP_REDIRECT_URI"
        fi
      else
        httpRedirect="false"
        httpRedirectUri=""
      fi

      if [ "$DAVE_HTTP_SSL_TRUSTED_CA" ]; then
        truststorePath="$(pwd)/etc/http.truststore"
        tempDir="$(mktemp -d)"

        pushd $tempDir
        echo "$DAVE_HTTP_SSL_TRUSTED_CA" > db.ca
        csplit db.ca '/^-----END CERTIFICATE-----$/1' '{*}' --elide-empty-files --silent --prefix=ca_

        counter=1
        for cert in $(ls ca_*); do
          keytool -importcert -noprompt -keystore $truststorePath -storepass $jks_password -storetype JKS -file $cert -alias "ca_${counter}"
          let counter=$counter+1
        done

        rm ca_*
        rm db.ca
        popd

        if [ "$DAVE_HTTP_SSL_CLIENT_AUTH" ]; then
          ssl_client_auth=true
        else
          ssl_client_auth=false
        fi

        http_ssl="\"ssl\": { \"enable\": true, \"keystore\": \"${keystorePath}\", \"keystorePassword\": \"${jks_password}\", \"redirectHttp\": ${httpRedirect}, \"redirectUri\": \"${httpRedirectUri}\", \"truststore\": \"${truststorePath}\", \"truststorePassword\": \"${jks_password}\", \"requireTLSClientAuth\": ${ssl_client_auth} }"
      else
        http_ssl="\"ssl\": { \"enable\": true, \"keystore\": \"${keystorePath}\", \"keystorePassword\": \"${jks_password}\", \"redirectHttp\": ${httpRedirect}, \"redirectUri\": \"${httpRedirectUri}\"}"
      fi

      CONFIG_HTTP+=("$http_ssl")
    fi

    # AUTH
    if [ "$DAVE_HTTP_AUTH" ]; then
      if [ -z "$DAVE_HTTP_AUTH_SALT" ]; then
        DAVE_HTTP_AUTH_SALT="DAVe"
      fi

      if [ -z "$DAVE_HTTP_AUTH_LINK_SSL" ]; then
        DAVE_HTTP_AUTH_LINK_SSL="false"
      fi

      if [[ "$DAVE_HTTP_JWT_BASE64_KEYSTORE" && "$DAVE_HTTP_JWT_KEYSTORE_PASSWORD" ]]; then
        jwtKeystorePath="$(pwd)/etc/jwt.keystore"
        jwtKeystorePassword="${DAVE_HTTP_JWT_KEYSTORE_PASSWORD}"
        echo "${DAVE_HTTP_JWT_BASE64_KEYSTORE}" | base64 -d > ${jwtKeystorePath}
      else
        jwtKeystorePath="$(pwd)/etc/jwt.keystore"
        jwtKeystorePassword="123456"
        keytool -genseckey -keystore ${jwtKeystorePath} -storetype jceks -storepass ${jwtKeystorePassword} -keyalg HMacSHA256 -keysize 2048 -alias HS256 -keypass ${jwtKeystorePassword}
        keytool -genseckey -keystore ${jwtKeystorePath} -storetype jceks -storepass ${jwtKeystorePassword} -keyalg HMacSHA384 -keysize 2048 -alias HS384 -keypass ${jwtKeystorePassword}
        keytool -genseckey -keystore ${jwtKeystorePath} -storetype jceks -storepass ${jwtKeystorePassword} -keyalg HMacSHA512 -keysize 2048 -alias HS512 -keypass ${jwtKeystorePassword}

        keytool -genkey -keystore ${jwtKeystorePath} -storetype jceks -storepass ${jwtKeystorePassword} -keyalg RSA -keysize 2048 -alias RS256 -keypass ${jwtKeystorePassword} -sigalg SHA256withRSA -dname "CN=,OU=,O=,L=,ST=,C=" -validity 360
        keytool -genkey -keystore ${jwtKeystorePath} -storetype jceks -storepass ${jwtKeystorePassword} -keyalg RSA -keysize 2048 -alias RS384 -keypass ${jwtKeystorePassword} -sigalg SHA384withRSA -dname "CN=,OU=,O=,L=,ST=,C=" -validity 360
        keytool -genkey -keystore ${jwtKeystorePath} -storetype jceks -storepass ${jwtKeystorePassword} -keyalg RSA -keysize 2048 -alias RS512 -keypass ${jwtKeystorePassword} -sigalg SHA512withRSA -dname "CN=,OU=,O=,L=,ST=,C=" -validity 360

        keytool -genkeypair -keystore ${jwtKeystorePath} -storetype jceks -storepass ${jwtKeystorePassword} -keyalg EC -keysize 256 -alias ES256 -keypass ${jwtKeystorePassword} -sigalg SHA256withECDSA -dname "CN=,OU=,O=,L=,ST=,C=" -validity 360
        keytool -genkeypair -keystore ${jwtKeystorePath} -storetype jceks -storepass ${jwtKeystorePassword} -keyalg EC -keysize 256 -alias ES384 -keypass ${jwtKeystorePassword} -sigalg SHA384withECDSA -dname "CN=,OU=,O=,L=,ST=,C=" -validity 360
        keytool -genkeypair -keystore ${jwtKeystorePath} -storetype jceks -storepass ${jwtKeystorePassword} -keyalg EC -keysize 256 -alias ES512 -keypass ${jwtKeystorePassword} -sigalg SHA512withECDSA -dname "CN=,OU=,O=,L=,ST=,C=" -validity 360
      fi

      if [ -z "$DAVE_HTTP_JWT_TOKEN_EXPIRATION" ] ; then
        DAVE_HTTP_JWT_TOKEN_EXPIRATION=60
      fi
      jwtTokenExpiration="${DAVE_HTTP_JWT_TOKEN_EXPIRATION}"
      http_auth="\"auth\": { \"enable\": true, \"salt\": \"${DAVE_HTTP_AUTH_SALT}\", \"dbName\": \"${DAVE_DB_NAME}\", \"connectionUrl\": \"${DAVE_DB_URL}\", \"checkUserAgainstCertificate\": ${DAVE_HTTP_AUTH_LINK_SSL}, \"jwtKeystorePath\": \"${jwtKeystorePath}\", \"jwtKeystorePassword\": \"${jwtKeystorePassword}\", \"jwtTokenExpiration\": ${DAVE_HTTP_JWT_TOKEN_EXPIRATION} }"
      CONFIG_HTTP+=("$http_auth")
    fi
  fi

  #####
  # ERS Debugger
  #####
  if [ "$DAVE_ERS_DEBUGGER" ]; then
    dbg_config="\"enable\": true"
    CONFIG_ERS_DEBUGGER+=("$dbg_config")
  else
    dbg_config="\"enable\": false"
    CONFIG_ERS_DEBUGGER+=("$dbg_config")
  fi

  #####
  # ERS
  #####
  if [ "$DAVE_ERS_ENABLE" ]; then
    if [ -z "$DAVE_ERS_HOSTNAME" ]; then
      DAVE_ERS_HOSTNAME=ersp01.deutsche-boerse.com
    fi

    ers_host_config="\"brokerHost\": \"${DAVE_ERS_HOSTNAME}\""
    CONFIG_ERS+=("$ers_host_config")

    if [ -z "$DAVE_ERS_PORT" ]; then
      DAVE_ERS_PORT=18080
    fi

    ers_port_config="\"brokerPort\": ${DAVE_ERS_PORT}"
    CONFIG_ERS+=("$ers_port_config")

    if [ "$DAVE_ERS_MEMBER" ]; then
      ers_member_config="\"member\": \"${DAVE_ERS_MEMBER}\""
      CONFIG_ERS+=("$ers_member_config")
    fi

    # SSL
    if [ "$DAVE_ERS_SSL_BROKER_CA" ]; then
      jks_password="$(date +%s | sha256sum | base64 | head -c 32 ; echo)"
      truststorePath="$(pwd)/etc/ers.truststore"
      tempDir="$(mktemp -d)"

      pushd $tempDir
      echo "$DAVE_ERS_SSL_BROKER_CA" > db.ca
      csplit db.ca '/^-----END CERTIFICATE-----$/1' '{*}' --elide-empty-files --silent --prefix=ca_

      counter=1
      for cert in $(ls ca_*); do
        cat $cert
        keytool -importcert -noprompt -keystore $truststorePath -storepass $jks_password -storetype JKS -file $cert -alias "broker_ca_${counter}"
        let counter=$counter+1
      done

      rm ca_*
      rm db.ca
      popd

      http_ssl="\"ssl\": { \"enable\": true, \"keystore\": \"${keystorePath}\", \"keystorePassword\": \"${jks_password}\", \"truststore\": \"${truststorePath}\", \"truststorePassword\": \"${jks_password}\", \"requireTLSClientAuth\": ${ssl_client_auth} }"
      ers_truststore_config="\"truststore\": \"${truststorePath}\", \"truststorePassword\": \"${jks_password}\""
      CONFIG_ERS+=("$ers_truststore_config")

      if [[ "$DAVE_ERS_SSL_MEMBER_PUBLIC_KEY" && "$DAVE_ERS_SSL_MEMBER_PRIVATE_KEY" ]]; then
        keystorePath="$(pwd)/etc/ers.keystore"
        tempDir="$(mktemp -d)"

        echo "$DAVE_ERS_SSL_MEMBER_PUBLIC_KEY" > $tempDir/keystore.crt
        echo "$DAVE_ERS_SSL_MEMBER_PRIVATE_KEY" > $tempDir/keystore.pem

        openssl pkcs12 -export -in $tempDir/keystore.crt -inkey $tempDir/keystore.pem -out $tempDir/keystore.p12 -passout pass:$jks_password
        keytool -importkeystore -srckeystore $tempDir/keystore.p12 -srcstoretype PKCS12 -srcstorepass $jks_password -destkeystore $keystorePath -deststoretype JKS -deststorepass $jks_password -srcalias 1 -destalias erskey -noprompt

        rm -rf $tempDir

        ers_keystore_config="\"keystore\": \"${keystorePath}\", \"keystorePassword\": \"${jks_password}\", \"sslCertAlias\": \"erskey\""
        CONFIG_ERS+=("$ers_keystore_config")
      fi
    fi
  fi

  #####
  # MASTERDATA
  #####
  if [ "$DAVE_MASTERDATA" ]; then
    CONFIG_MASTERDATA+=("${DAVE_MASTERDATA}")
  fi

  #####
  ## Write the config file
  #####
  configFile="$(pwd)/etc/dave.json"
  cat > $configFile <<-EOS
{
EOS
  IFSBAK="$IFS"
  IFS=", "
  cat >> $configFile <<-EOS
  "http": {
    ${CONFIG_HTTP[*]}
  },
  "mongodb": {
    ${CONFIG_DB[*]}
  },
  "ersDebugger": {
    ${CONFIG_ERS_DEBUGGER[*]}
  },
  "masterdata": {
    ${CONFIG_MASTERDATA[*]}
  },
EOS
  if [ ""${#CONFIG_ERS[@]}"" -gt 0 ]; then
    cat >> $configFile <<-EOS
  "ers": [
    {
      ${CONFIG_ERS[*]}
    }
  ]
EOS
  else
    cat >> $configFile <<-EOS
  "ers": []
EOS
  fi
  IFS="$IFSBAK"
  cat >> $configFile <<-EOS
}
EOS
  cat $configFile
fi

# else default to run whatever the user wanted like "bash"
exec "$@"
