// replace the body of the function in this file to those in mainViewController.js for alternate implementation

vm.getBalance = function () {
    
    var serverUrl = openchainUrl + queryAccUrl + accountNo;
    var encodedUrl = encodeURI(serverUrl);

    alert(encodedUrl);
    $http.get(encodedUrl)
        .then(function (response) {
            // Success
      //      alert("success!!!")
            console.log(response.data);
            vm.balance = response.data[0].balance;
        },
        function () {
            alert("failure :(");
            vm.error = "Failed to load pending users";
            // Failure
        })
        .finally(function () {
            vm.isPendingUsersBusy = false;
        });
}

vm.transfer = function () {
    // Load a private key from a seed 
    var seed = "0123456789abcdef0123456789abcdef";
    var privateKey = bitcore.HDPrivateKey.fromSeed(seed, "openchain");
    var address = privateKey.publicKey.toAddress();
    //var address = "Xe6JT9UZj7bGfdBfGpru5MN4S29DDM4cLj";
    // Calculate the accounts corresponding to the private key 
    var issuancePath = "/asset/p2pkh/" + address + "/";
    var assetPath = issuancePath;
    var signer = new openchain.MutationSigner(privateKey);
}