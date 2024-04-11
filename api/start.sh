#!/bin/bash
source "$(dirname "$0")/.env"

# Configure ngrok authentication token
# use ngyuwing011794 ngrok account (container inside)
ngrok config add-authtoken $NGROK_API_APPLICATION_TOKEN

# Run your Node.js application in the background
node api.js &

# Wait for the application to start
sleep 5

# Start ngrok and expose 8080 to ngrok tunnel
ngrok http --domain=$NGROK_DOMAIN $NGROK_LOCAL_PORT_EXPOSE
