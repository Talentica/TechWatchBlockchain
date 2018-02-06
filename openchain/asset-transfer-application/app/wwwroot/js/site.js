// Write your JavaScript code.
// account-register.js
(function () {

    "use strict";

    var baseUrl = $('base').attr('href');
    var appBaseUrl = '';//baseUrl;
    //alert("baseUrl:" + baseUrl);

    //Creating the module
    angular.module("openchain", ["ngRoute"])
        .config(function ($routeProvider, $locationProvider) {
            // Following is to fix unnecessary ! after # in the route
            $locationProvider.hashPrefix('');

            //$routeProvider.when("/registerinit", {
            //    controller: "registerinitController",
            //    controllerAs: "vm",
            //    templateUrl: appBaseUrl + "views/registerinit.html"

            //});

            $routeProvider.when("/", {
                controller: "mainViewController",
                controllerAs: "vm",
                templateUrl:  "/views/mainView.html"

            });
            
            $routeProvider.otherwise({ redirectTo: "/" });

        });

})();
