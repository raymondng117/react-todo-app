Initial setting up:
1. Register a ngrok account and get ngrok token
2. Make your local mysql server (in my case, my SQL server is in my PI) public using ngrok tcp 3306 command

Then

For api.js:
1. Create an .env file in root directory
3. Create env varibles in .env file (ngrok token, public tcp address of your mysql server)
3. Replace the database connection config with corresponding env variables in the api.js
4. Replace the config with corresponding env variables in the start.th

For react-todo-app:
1. Create an .env file in root directory
3. Create env varibles in .env file (ngrok token), for react project remember to use format REACT_APP_NAME=VALUE. 
3. Replace the config with corresponding env variables in the src/App.js
Replace the config with corresponding env variables in the start.th
