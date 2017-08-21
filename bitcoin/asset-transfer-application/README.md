# Simple Asset Transfer Application

This is 'Hello World' application to interact with bitcoin. Bitcoin can be run in following three modes :

   - **mainnet** : This mode is like production mode. It interact with main blockchain, so need real bitcoin to make your application work.
    
   - **testnet** : This mode is like test mode. Similar to 'main blockchain' there is also test blockchain 'testnet3' which behaves similar to mainnet but here bitcoin does not have any values. You can get bitcoin without any cost on 'testnet3'. Just search for 'bitcoin faucet' on google you will see many website where you can get free bitcoin (dummy one NOT real)
    
   - **regtest** : This mode is like developer mode. We can control the creation of bitcoins/or blocks. It is best suited when you are creating your application. We will be using this mode in our application.
    
    
    
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

- Open another terminal and check if you are able to connect with 'bitcoind' using 'bitcoin-cli' (bitcoin-cli is also included in docker image)

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


### Run web application

- Once you have sufficient balance, start web application on both node. First go to "http://localhost" and run following command to start the server :
```
> cd app
> node server.js 
```
- Visit "http://localhost:3000" and click on "fetch" button you should get '50' as balance.

- Similarly, start web application on other node by visiting "http://localhost:81" and run same command as mentioned in obove command.
- Visit "http://localhost:3001" and click on "fetch" button you should get '0' as balance.

> Please note that the balance you are seeing is of 'wallet' not for a particular address and that's the very reason for address field to be disabled.
## Transfer bitcoin from one wallet to another

### Connect to node

- Open node1 terminal and issue following command to see how many other nodes are connected to this node
```
> bitcoin-cli  getaddednodeinfo 
[
]
```
- Empty list shows that node is not connected any other node.
- While node2's bitcoind is still running connect both node with each other by issuing following command
```
> bitcoin-cli  addnode  node1 add
> bitcoin-cli  getaddednodeinfo 
[
  {
    "addednode": "node1",
    "connected": true,
    "addresses": [
      {
        "address": "172.19.0.3:18444",
        "connected": "outbound"
      }
    ]
  }
]
```
- Similarly run above command on other node 
```
> bitcoin-cli  addnode  node2 add
> bitcoin-cli  getaddednodeinfo 
[
  {
    "addednode": "node2",
    "connected": true,
    "addresses": [
      {
        "address": "172.19.0.2:18444",
        "connected": "outbound"
      }
    ]
  }
]
```

### Transfer bitcoin
- Go to node2 terminal and generate new address for node2's wallet by issuing following command :
```
> bitcoin-cli getnewaddress
mhPsA32V8QKrakQGsvJiQohz18fHpYFmUR
```
- Copy newly generated address and visit to node1's web application 'http://localhost:3000' and enter quantity and address in provided fields.
- Once transferred, you can check the balance on node2 wallet by clicking on 'fetch' button.

