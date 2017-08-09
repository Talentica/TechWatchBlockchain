# Simple Asset Transfer Application

This is 'Hello World' application to interact with ethereum blockchain. This application helps to learn following aspects of ethereum :

  - How to create simple smart contract. This smart contract is very simple : transfer asset from one account to another.
  - How to compile and deploy the contract using various option available.
  - How to interact with blockchain from client side javascript using web3 and rpc  .
  
The final application looks as follows :

![alt text](https://drive.google.com/uc?export=view&id=0B5nrsdlXdWORaFktUFEyTkhwY1U)

# Steps to install and run Ethereum blockchain
### Install geth

 - **Geth** is ethereum command line interface written in ‘Go’. Geth is required to run ethereum node. You can follow the instruction listed [here](https://github.com/ethereum/go-ethereum/wiki/Building-Ethereum) to install 'geth' according to your platform.
 
 - If you are feeling lazy and already using docker, you can use **docker-compose.yml** file to run ethereum in container. The image also contains cloud9 IDE so that you can easily access terminal via ‘http://localhost’
 
 - Check if ‘geth’ is installed properly by issuing following command:
```
> geth version

Geth
Version: 1.6.7-stable
Git Commit: ab5646c532292b51e319f290afccf6a44f874372
Architecture: amd64
Protocol Versions: [63 62]
Network Id: 1
Go Version: go1.8.1
Operating System: linux
GOPATH=
GOROOT=/usr/lib/go-1.8

```

###	Create private chain
- Initialize the chain using below command :
```
> geth --datadir ~/.ethereum/privatenet init privategensis.json
```
- Start ethereum blockchain 
```
> geth -rpc -rpcapi 'web3,eth,debug,personal' --rpcaddr '0.0.0.0' -rpcport 8545 --rpccorsdomain '*' --datadir ~/.ethereum/privatenet --networkid 15
```
>Go To : https://github.com/ethereum/go-ethereum/wiki/Command-Line-Options to understand command line parameters 

![alt text](https://drive.google.com/uc?export=view&id=0B5nrsdlXdWORWVd4SDMwcEdjS1k)

### Create ‘coinbase’ account
- Attach ‘eth console’ to already running blockchain using below command
```
> geth attach ipc:/root/.ethereum/privatenet/geth.ipc 
```
> NOTE : You can see IPC path when you run ethereum blockchain, same is shown in above image
- Create account and mark it as coinbase account using following command :

```sh
> personal.newAccount("password") // This will create new account with password as 'password'
"0xd4bbbc00e129d079927eff3d4da7bda1f2793df8"

> personal.listAccounts // This will display list of all accounts
["0xd4bbbc00e129d079927eff3d4da7bda1f2793df8"]

> miner.setEtherbase(personal.listAccounts[0]) // Set coinBase account
true

> eth.getBalance(eth.coinbase).toNumber() //Get the balance
0
```
###	Miner to generate ‘ether’

- Start miner ( from geth console) using following command and wait for some time to generated some 'ether'
```sh
> miner.start(3)
//You can check hash rate of miner using below command 
miner.getHashrate()
```
- Once you get sufficient ether you can stop mining. 
 ```
> miner.stop()
```
- Check balance again
```
> eth.getBalance(eth.coinbase).toNumber()
50000000000000000000
```

### Compile and deploy smart contract ‘Token.sol’ to ethereum blockkchain

Basically you need two things to deploy your contract ‘ABI’ and ‘Bytecode’. You can read more about these on ethereum website. To compile and deploy smart contract you have various options
- Use mist browser to compile, get ABI, bytecode and deploy
- Use web3.js and solc.js npm package to compile, get ABI, bytecode and deploy.
- Use online IDE https://ethereum.github.io/browser-solidity , to compile.

I have used ***2nd*** option to compile and deploy smart contract on ethereum blockchain. Execute following command to compile and deploy the contract


```sh
> cd compile-deploy/
> node compile.js 
```
Wait for sometime (make sure your miner is running), Once deployed you will get the address where contract has deployed

```sh
Contract address: 0x8fdd53c912f2948fc238df5182ba25953ee3b263
```
Now make necessary changes to 'contract.js' in UI folder so that UI get to know about the location of contract.

```sh
> cd ui
> vi contract.js
//address where contract has deployed
var address = "enter_contract_address_here"
```

Now open the html with any browser to interact with application. Or If you are using 'docker-compose.yml' run :
```sh
> node server.js
```
Go to http://localhost:3000/ to interact with application.
You can transfer asset to any address (you may need to create the address first) and can also check the balance of an asset.
