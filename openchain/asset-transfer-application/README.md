Simple Asset Transfer Application

This is a sample application to interact with openchain. The final application will look like following:

Steps to install and run openchain
Quite a lot of this has been taken from openchain documentation page: https://docs.openchain.org/en/latest/general/docker-deployment.html#install-openchain-server

Install openchain server
- Install Openchain Server: Clone the openchain/docker repository from GitHub, and copy the configuration files from the templates provided.

git clone https://github.com/openchain/docker.git openchain
cd openchain
cp templates/docker-compose-direct.yml docker-compose.yml
mkdir data
cp templates/config.json data/config.json

Now, edit the configuration file (data/config.json):
nano data/config.json

Set the instance_seed setting to a random (non-empty) string.

 [...]
   // Define transaction validation parameters
   "validator_mode": {
     // Required: A random string used to generate the chain namespace
     "instance_seed": "somerandomstring",
     "validator": {
 [...]
 
 
You can now start the server:

docker-compose up -d
This will start the Openchain server in the background. To check that the server is running properly, check the docker logs:

docker logs openchain-server
You should not see any error: