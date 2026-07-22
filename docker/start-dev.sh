#!/bin/sh

BACKEND_URL="${1:-${BACKEND_URL:-https://kitos-dev.strongminds.dk/}}"

cat > /tmp/proxy.conf.json <<EOF
{
  "/api": {
    "target": "${BACKEND_URL}",
    "secure": false,
    "changeOrigin": true
  },
  "/odata": {
    "target": "${BACKEND_URL}",
    "secure": false,
    "changeOrigin": true
  },
  "/LoginHandler.ashx": {
    "target": "${BACKEND_URL}",
    "secure": false,
    "changeOrigin": true
  }
}
EOF

yarn ng serve --host=0.0.0.0 --port=4200 --poll=2000 --proxy-config=/tmp/proxy.conf.json
