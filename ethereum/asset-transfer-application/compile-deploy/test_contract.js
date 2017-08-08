const fs = require('fs');
const solc = require('solc');
const Web3 = require('web3');

// Connect to local Ethereum node
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));


const input = fs.readFileSync('Token.sol');
const output = solc.compile(input.toString(), 1);
const bytecode = output.contracts[':Token'].bytecode;
const abi = JSON.parse(output.contracts[':Token'].interface);

// Contract object
const contract = web3.eth.contract(abi);



var address = "0xfd2bd9c3e80b9c5b13441c6187312a8d8eeafbd1"
var dest_account = "0x5e2bfc225f0bab538b5bf5f39f432de1f4c73034"


const token = contract.at(address);

const balance1 = token.balances.call(web3.eth.coinbase);
console.log("current balance of 'from account' is " + balance1);

const balance2 = token.balances.call(dest_account);
console.log("current balance of 'to account' is " + balance2);

web3.personal.unlockAccount(web3.eth.coinbase, "password", 1000);

token.transfer(dest_account, 100, {from: web3.eth.coinbase}, (err, res) => {
        console.log(err)
        // Log transaction, in case you want to explore
        console.log('tx: ' + res);
        // Assert destination account balance, should be 100 
        const balance3 = token.balances.call(dest_account);
        console.log("balance after transfer is " + balance3);
    });
