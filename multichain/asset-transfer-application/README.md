# Simple Asset Transfer Application

This is 'Hello World' application to interact with multichain blockchain. This application helps to learn following aspects of multichain :

  - How to create new blockchain.
  - How to transfer asset between two nodes.
  - How to interact with blockchain from nodejs.
  
The final application looks as follows :

![alt text](https://drive.google.com/uc?export=view&id=0B5nrsdlXdWORaFktUFEyTkhwY1U)


# Getting Started
Multichain has very well documented getting started tutorial Please follows the instructions listed [here](https://www.multichain.com/getting-started/). 

## Start the application
- Run following command to start two nodes using docker composer
```
> docker-compose up -d
```
- Visit 'http://localhost' to see node1 IDE. Once there, move multichain configuration file to root folder
```
> mv multichain.conf ~/.multichain/chain1
```

- Start the chain using below command
```
> multichaind chain1 -daemon
```
- Follow same steps to start multichain in other node (node2) running at 'http://localhost:81'
- Start web application in node1 
```
> cd app
> node server.js
```
- Once started you can see the balance and also transfer the asset to other node.