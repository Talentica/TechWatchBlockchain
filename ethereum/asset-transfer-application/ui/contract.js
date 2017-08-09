var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

var abi = abi = JSON.parse('[{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balances","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"}]')


var contract = web3.eth.contract(abi);


//address where contract has deployed
var address = "enter_contract_address_here"


const token = contract.at(address);



function getBalance(){

	alert(token.balances.call($("#address").val()))
}

function transfer() {
    var fromAddress =  $("#from-address").val();
    var toAddress = $("#to-address").val();
    var fromAddressPassword = $("#from-address-password").val();
    var quantity = $("#quantity").val();
    web3.personal.unlockAccount(fromAddress, fromAddressPassword, 1000);
    token.transfer(toAddress, quantity, {from: fromAddress}, (err, res) => {
        if(err){
            alert(err)
            return
        }
        // Log transaction, in case you want to explore
        alert('tx: ' + res);
    });
}

$("#from-address, #address").val(web3.eth.coinbase)
$("#from-address-password").val("password")
$("#quantity").val(100)