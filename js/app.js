(function(){
    'use strict';

    angular.module('basicApp', [
        "ui.router",
        "home",
        "angular-loading-bar",
        "firebase",
        "ngStorage",
        "authController",
        "navController",
        'firebase.utils',
        "authSetup"
        ])

        .config(["$stateProvider", "$urlRouterProvider",
            function ($stateProvider, $urlRouterProvider) {

                // define all app states (pages)

                $stateProvider
                    .state("home", {
                        url: "/home",
                        templateUrl: "templates/home.html",
                        controller: "homeController as hc"
                    })
                    .state("SearchResult", {
                        url: "/SearchResult",
                        templateUrl: "templates/SearchResult.html",
                        controller: "homeController as hc"
                    })
                    .state("contact", {
                        url: "/contact",
                        templateUrl: "templates/contact.html"
                    })
                    .state("login", {
                        url: "/login",
                        templateUrl: "templates/login.html",
                        controller: "authController as authC"
                    })
                    .state("cart", {
                        url: "/cart",
                        templateUrl: "templates/cart.html"
                    });

                // if none of the above states are matched, use this as the fallback
                $urlRouterProvider.otherwise("/home");

     }]);
}());