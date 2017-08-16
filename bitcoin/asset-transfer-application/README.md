# Simple Asset Transfer Application

This is 'Hello World' application to interact with bitcoin. Bitcoin can be run in following three modes :

   - mainnet : This mode is like production mode. It interact with main blockchain, so need real bitcoin to make your application work.
    
   - testnet : This mode is like test mode. Similar to 'main blockchain' there is also test blockchain 'testnet3' which behaves similar to mainnet but here bitcoin does not have any values. You can get bitcoin without any cost on 'testnet3'. Just search for 'bitcoin faucet' on google you will see many website where you can get free bitcoin (dummy one NOT real)
    
   - regtest : This mode is like developer mode. We can control the creation of bitcoins/or blocks. It is best suited when you are creating your application. We will be using this mode in our application.
    
    
    
In this application we run two nodes (docker container) using docker composer. Both nodes running 'bitcoind' in 'regtest' mode.
'bitciond' provides wallet functionality for key mangement and calculating balance in the wallet. You can interact with bitcoin using UI provided in each node. Each node's UI interact with its own locally running bitcoind.


This application helps to learn following aspects of bitcoin :

  - How to create simple application : transfer of bitcoin from one address to another.
  - How to set up multi node environment for bitcoin's 'regtest'.
  - How to interact with bitcoind using rpc.
  
The final application looks as follows :

![alt text](https://drive.google.com/uc?export=view&id=0B5nrsdlXdWORZHQ3cWZuRTMwZzA)

# Steps to install and run bitcoin
### Install bitcoind

 - **bitcoind** is required to run bitcoin node. You can follow the instruction listed [here](https://bitcoin.org/en/full-node) to install 'bitcoind' according to your platform.
 
 - I have provided **docker-composer.yml** which includes image having **bitcoind** installed. I encourage you to use docker-compose.yml as it include multiple node and basic bitcoin configuration file. The image also contains cloud9 IDE so that you can easily access terminal via ‘http://localhost’ for **node1** and via 'http://localhost:81' for **node2**
 

###	Run bitcoind

- Copy bitcoin.conf file to location '~/.bitcoin/' as shown below :

```
> cp bitcoin.conf ~/.bitcoin/
```

- Start bitcoind 

```
> bitcoind

```

- Open another terminal and check if are able to connect with 'bitcoind' using 'bitcoin-cli' (bitcoin-cli is also included in docker image)

```
> bitcoin-cli getinfo

{
  "version": 140200,
  "protocolversion": 70015,
  "walletversion": 130000,
  "balance": 0.00000000,
  "blocks": 0,
  "timeoffset": 0,
  "connections": 0,
  "proxy": "",
  "difficulty": 4.656542373906925e-10,
  "testnet": false,
  "keypoololdest": 1502781739,
  "keypoolsize": 100,
  "paytxfee": 0.00000000,
  "relayfee": 0.00001000,
  "errors": ""
}

```
- If you check balance in your wallet obviously you have zero. 
```
> bitcoin-cli getbalance
0.00000000

```
- As we are running bitcoind in 'regtest' mode we can easily generate some bitcoins. Follow below command to generate new bitcoins

```
bitcoin-cli generate 101
```
Above command is basically generating new 101 blocks. Below is the reason fetched from bitcoin website how generating 101 blocks rewards bitcoin


> Generate 101 blocks using a special RPC which is only available in regtest mode. This takes less than a second on a generic PC. Because this is a new block chain using Bitcoin’s default rules, the first blocks pay a block reward of 50 bitcoins. Unlike mainnet, in regtest mode only the first 150 blocks pay a reward of 50 bitcoins. However, a block must have 100 confirmations before that reward can be spent, so we generate 101 blocks to get access to the coinbase transaction from block

- Now check balance again :

```
> bitcoin-cli getbalance
50.00000000
```
