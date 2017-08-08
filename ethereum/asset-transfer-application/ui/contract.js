var web3 = new Web3(new Web3.providers.HttpProvider("http://172.17.0.2:8545"));

var abi = abi = JSON.parse('[{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balances","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"}]')


var contract = web3.eth.contract(abi);


var address = "0xfd2bd9c3e80b9c5b13441c6187312a8d8eeafbd1"


const token = contract.at(address);

const balance1 = 

alert(balance1)

function getBalance(){

	alert(token.balances.call($("#address").val()))
}