(function () {

    "use strict";

    //Getting the existing module
    angular.module("openchain")
        .controller("mainViewController", mainViewController);

    function mainViewController($http, $window) {

        var vm = this;
        //vm.balance = "";
        vm.message = "";
        var openchain = require("openchain");
        var bitcore = require("bitcore-lib");
        var Mnemonic = require('bitcore-mnemonic');
        var openchainUrl = "http://ec2-13-127-68-130.ap-south-1.compute.amazonaws.com:8080/";
        var queryAccUrl = "query/account?account=";
        var assetPath = "/asset/p2pkh/XbfLgPQJEDccGnffkxPxRUu5UAs9v64TgH/"  // third
        var accountNo = "/p2pkh/XhY9fjCUEEKh9kDNDqeWhdoNdAn36i9rbi/"; // mine
        //var accountNo = "/p2pkh/XtWkQw8JGtroLbpYoJrwmnVG7JRHUYypK4/"; // second
        //var assetPath = "/asset/p2pkh/Xe6JT9UZj7bGfdBfGpru5MN4S29DDM4cLj/"; // first
        var client = new openchain.ApiClient(openchainUrl);
        vm.getBalance = function () {
            client.getAccountRecord(
                // Account path 
                accountNo,
                // Asset path 
                assetPath)
                .then(function (result) {
                    vm.balance = result.balance.toString();
                    console.log("Balance: " + result.balance.toString());
                });
            
        }

        vm.getPrivateKey = function (passphrase) {
            var code = new Mnemonic(passphrase);
            var makeKey = code.toHDPrivateKey();
            var hdPrivateKey = new bitcore.HDPrivateKey(makeKey);
            //hdPrivateKey.network = bitcore.Networks.get("openchain");
            var derivedKey = hdPrivateKey.derive(44, true).derive(64, true).derive(0, true).derive(0).derive(0);
            return derivedKey;
        }
        
        
        vm.transfer = function () {
            vm.message = "";
            // use the passphrase of your account here
            var derivedKey = this.getPrivateKey('bone depend release absurd family fortune clap dry shove expand mushroom nose');
            
            var privateKey = derivedKey.privateKey;
            // wallet address is "/p2pkh/" + derivedKey.privateKey.toAddress().toString()+"/";
            var walletPath = "/p2pkh/" + derivedKey.privateKey.toAddress().toString() + "/";
            
            
            var issuancePath = vm.toAddress;
            var quantity = parseInt(vm.quantity);
            if (quantity <= 0 || isNaN(quantity))
            {
                alert("Invalid quantity");
                return;
            }
            

            console.log("Issuance path: " + issuancePath);
            console.log("Wallet path: " + walletPath);

            // Create an Openchain client and signer 
            var client = new openchain.ApiClient(openchainUrl);
            
            var signer = new openchain.MutationSigner(derivedKey);

            // Initialize the client 
            client.initialize()
                .then(function () {
                    // Create a new transaction builder 
                    return new openchain.TransactionBuilder(client)
                        // Add the key to the transaction builder 
                        .addSigningKey(signer)
                        // Add some metadata to the transaction 
                        .setMetadata({ "memo": "Issued through NodeJS" })
                        // Take quanity units of the asset from the wallet path 
                        .updateAccountRecord(walletPath, assetPath, -1 * quantity);
                })
                .then(function (transactionBuilder) {
                    // Add quantity units of the asset to the issuance path 
                    return transactionBuilder.updateAccountRecord(issuancePath, assetPath, 1 * quantity);
                })
                .then(function (transactionBuilder) {
                    // Submit the transaction 
                    var response = transactionBuilder.submit();
                    return response;
                })
                .then(function (result) {
                    console.log(result);
                    alert("success");
                    vm.message = "success";
                });
        }
    }
})();