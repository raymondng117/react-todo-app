# Configure ngrok authentication token
ngrok config add-authtoken $NGROK_API_APPLICATION_TOKEN

# Run react application in the background
npm run start &

# Wait for the application to start
sleep 15

# Start ngrok and expose 8080 to ngrok tunnel
ngrok http --domain=$NGROK_DOMAIN $NGROK_LOCAL_PORT_EXPOSE