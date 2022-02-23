#!/bin/bash

DEPLOY_SERVER=$SERVER_IPADDRESS

echo "Deploying to ${SERVER_IPADDRESS}"
ssh root@${SERVER_IPADDRESS} 'bash' < ./deploy/server.sh