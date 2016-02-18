(function(){
    'use strict';

    angular.module('basicApp', [
            "ui.router",
        "home"

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
                    .state("contact", {
                        url: "/contact",
                        templateUrl: "../templates/contact.html"
                    });

                // if none of the above states are matched, use this as the fallback
                $urlRouterProvider.otherwise("/home");
     }]);
}());
