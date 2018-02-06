(function () {

    "use strict";

    //Getting the existing module
    angular.module("openchain")
        .controller("mainViewController", mainViewController);

    function mainViewController($http, $window) {

        var vm = this;
        //vm.balance = "";

        var openchain = require("openchain");
        var bitcore = require("bitcore-lib");
        var Mnemonic = require('bitcore-mnemonic');
        var baseUrl = $('base').attr('href');
        var appBaseUrl = baseUrl;
        var client = new openchain.ApiClient("http://ec2-13-127-1-83.ap-south-1.compute.amazonaws.com:8080/");
        vm.getBalance = function () {
            
            //var accountNo = "/p2pkh/XtWkQw8JGtroLbpYoJrwmnVG7JRHUYypK4/"; // second
            var accountNo = "/p2pkh/XhY9fjCUEEKh9kDNDqeWhdoNdAn36i9rbi/"; // mine
            //var assetPath = "/asset/p2pkh/Xe6JT9UZj7bGfdBfGpru5MN4S29DDM4cLj/"; // first
            var assetPath = "/asset/p2pkh/XbfLgPQJEDccGnffkxPxRUu5UAs9v64TgH/"
            //var accountNo = "/p2pkh/XnHBaQJSJAVFoFHojT7Y5yoYsQfDPBJNsN/"; // using passphrase
            //var serverUrl = "http://ec2-13-127-1-83.ap-south-1.compute.amazonaws.com:8080/query/account?account=/p2pkh/XhY9fjCUEEKh9kDNDqeWhdoNdAn36i9rbi/";
            var serverUrl = "http://ec2-13-127-1-83.ap-south-1.compute.amazonaws.com:8080/query/account?account="+accountNo;
            var encodedUrl = encodeURI(serverUrl);

            client.getAccountRecord(
                // Account path 
                accountNo,
                // Asset path 
                assetPath)
                .then(function (result) {
                    vm.balance = result.balance.toString();
                    console.log("Balance: " + result.balance.toString());
                });

            var seed = "0123456789abcdef0123456789abcdef";

            // Load a private key from a seed 
            var privateKey = bitcore.HDPrivateKey.fromSeed(seed, "openchain");
            var address = privateKey.publicKey.toAddress();

            //alert(encodedUrl);
            //$http.get(encodedUrl)
            //    .then(function (response) {
            //        // Success
            //  //      alert("success!!!")
            //        console.log(response.data);
            //        vm.balance = response.data[0].balance;
            //    },
            //    function () {
            //        alert("failure :(");
            //        vm.error = "Failed to load pending users";
            //        // Failure
            //    })
            //    .finally(function () {
            //        vm.isPendingUsersBusy = false;
            //    });
        }
        
        vm.transfer = function () {
            

            var seed = "0123456789abcdef0123456789abcdef";

            // use the passphrase of your account here
            var code = new Mnemonic('bone depend release absurd family fortune clap dry shove expand mushroom nose');
            var makeKey = code.toHDPrivateKey();
            var hdPrivateKey = new bitcore.HDPrivateKey(makeKey);
            //hdPrivateKey.network = bitcore.Networks.get("openchain");
            var derivedKey = hdPrivateKey.derive(44, true).derive(64, true).derive(0, true).derive(0).derive(0);
            var privateKey = derivedKey.privateKey;
            // wallet address is "/p2pkh/" + derivedKey.privateKey.toAddress().toString()+"/";
            var walletPath = "/p2pkh/" + derivedKey.privateKey.toAddress().toString() + "/";
            
            // Load a private key from a seed 
            //var privateKey = bitcore.HDPrivateKey.fromSeed(seed, "openchain");
            //var address = privateKey.publicKey.toAddress();
            var address = "Xe6JT9UZj7bGfdBfGpru5MN4S29DDM4cLj";
            // Calculate the accounts corresponding to the private key 
            //var issuancePath = "/asset/p2pkh/" + address + "/";
            var issuancePath = vm.toAddress;
            var quantity = parseInt(vm.quantity);
            if (quantity <= 0 || isNaN(quantity))
            {
                alert("Invalid quantity");
                return;
            }
            //var assetPath = issuancePath;
            var assetPath = "/asset/p2pkh/XbfLgPQJEDccGnffkxPxRUu5UAs9v64TgH/"
            //var walletPath = "/p2pkh/" + address + "/";

            console.log("Issuance path: " + issuancePath);
            console.log("Wallet path: " + walletPath);

            // Create an Openchain client and signer 
            var client = new openchain.ApiClient("http://ec2-13-127-1-83.ap-south-1.compute.amazonaws.com:8080/");
            //var signer = new openchain.MutationSigner(privateKey);
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
                        // Take 100 units of the asset from the issuance path 
                        //.updateAccountRecord(issuancePath, assetPath, -1);
                        .updateAccountRecord(walletPath, assetPath, -1 * quantity);
                })
                .then(function (transactionBuilder) {
                    // Add 100 units of the asset to the target wallet path 
                    //return transactionBuilder.updateAccountRecord(walletPath, assetPath, 1);
                    return transactionBuilder.updateAccountRecord(issuancePath, assetPath, 1 * quantity);
                })
                .then(function (transactionBuilder) {
                    // Submit the transaction 
                    return transactionBuilder.submit();
                })
                .then(function (result) { console.log(result); });
        }

    }
})();