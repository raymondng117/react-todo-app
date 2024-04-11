Opional!!! Below are instructions to exam if the API server successfully run in the docker container
<!-- In contrast to using docker-compose up, when create indiviudal image using Dockerfile, add it to the dockerfile-->
# Expose port 8080
EXPOSE 8080

<!-- 1.Build the Docker image: Open a terminal in the root directory of your project and run the docker build command to build the Docker image. You need to specify a tag for the image using the -t flag.-->
docker build -t react-todoapp-api .

<!-- Verify the Docker image: Once the build process is complete, you can verify that the image was created successfully by running docker images: -->
docker images

<!-- run the container using this image, in this case, react-todoapp-api -->
docker run -d react-todoapp-api


Optional coz you can check all logs in the docker desktop if you dont want to use commands
<!-- check running contianers to get container ID -->
docker ps (or just head to docker desktop)

<!-- check lo msg -->
docker log (containerID)