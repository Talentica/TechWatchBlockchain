//https://github.com/ethereum/wiki/wiki/JavaScript-API

const fs = require('fs');
const solc = require('solc');
const Web3 = require('web3');

// Connect to local Ethereum node
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));


//read contract
const input = fs.readFileSync('Token.sol');
//Compile the contract
const output = solc.compile(input.toString(), 1);

//get bytecode and abi
const bytecode = output.contracts[':Token'].bytecode;
const abi = JSON.parse(output.contracts[':Token'].interface);


//get contract handler
const contract = web3.eth.contract(abi);

//As our account is password protected we need to unlock it first
web3.personal.unlockAccount(web3.eth.coinbase, "password", 1000);

// Deploy contract instance
const contractInstance = contract.new({
    data: '0x' + bytecode,
    from: web3.eth.coinbase,
    gas: 90000*2
}, (err, res) => {
    if (err) {
        console.log(err);
        return;
    }
    
    // Log the tx, you can explore status with eth.getTransaction()
    console.log(res.transactionHash);

    // If we have an address property, the contract was deployed
    if (res.address) {
        console.log('Contract address: ' + res.address);
    }
});