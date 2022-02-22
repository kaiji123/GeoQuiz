#!/bin/bash

DEPLOY_SERVER=$DEPLOY_SERVER

echo "Deploying to ${SERVER_IPADDRESS}"
ssh root@${SERVER_IPADDRESS} 'bash' < ./deploy/server.sh