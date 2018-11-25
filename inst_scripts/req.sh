#!/bin/sh

echo 'code='$1

curl -v -F 'client_id=f9cb08674fd44455bad635b0a0144018' \
    -F 'client_secret=08bdaab5023a43208a592a4cdec36304' \
    -F 'grant_type=authorization_code' \
    -F 'redirect_uri=http://127.0.0.1/' \
    -F 'code='$1 \
    https://api.instagram.com/oauth/access_token
