(function(){
    'use strict';

    angular.module('basicApp', [
            "angular-loading-bar",
            "ui.router",
            "ngStorage",
            "home",
            "homeService"

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
                        params:{searchQuery:null},

                        templateUrl: "templates/SearchResult.html",
                        controller: "SearchResultController as sc",
                        resolve:{
                            searchResult: function ($http,$stateParams) {
                                var url="http://api.walmartlabs.com/v1/search?query="+$stateParams.searchQuery+"&format=json&apiKey=evyfdf3gs4svd5vx3zs9br4w&callback=JSON_CALLBACK";
                                console.log($stateParams);

                                return $http.jsonp(url)
                                    .success(function (data) {
                                        return data;
                                    });


                            }
                        }
                    })
                    .state("select", {
                        url: "/select",
                        templateUrl: "templates/selectedProduct.html",
                        //controller: "SearchResultController as sc"

                    })
                    .state("contact", {
                        url: "/contact",
                        templateUrl: "../templates/contact.html"
                    })
                    .state("login", {
                        url: "/login",
                        templateUrl: "../templates/login.html"
                    });

                // if none of the above states are matched, use this as the fallback
                $urlRouterProvider.otherwise("/home");







            }]);
}());