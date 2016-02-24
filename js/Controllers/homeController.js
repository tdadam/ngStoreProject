(function () {
    'use strict';

    angular.module('home', [])
        .controller('homeController', homeController);
    //apiCtrl.$inject = ['homeService'];
    //function apiCtrl(homeService) {

    homeController.$inject = ['$http', '$state', '$localStorage', 'homeService'];
    // list everything
    function homeController($http, $state, $localStorage, homeService) {
        var hc = this;
        //hc.storage = $localStorage;

        // JASONP get function to get data from walmart.
        hc.search = function () {
            //hc.storage.search = hc.searchQuery;
            //if (!hc.storage.search) {
            //    hc.storage.search = hc.searchQuery;
            //
            //}
            homeService.addSearch(hc.searchQuery);
            //$state.go("SearchResult", {searchQuery: $localStorage.search});
            $state.go("SearchResult", {searchQuery: homeService.storage.search});
            //console.log(homeService.storage.search);

        };
        hc.trends = function () {

            //------> trends not working from walmart side
            //hc.trendurl="http://api.walmartlabs.com/v1/trends?format=json&apiKey=evyfdf3gs4svd5vx3zs9br4w&callback=JSON_CALLBACK";
            hc.trendUrl = "http://api.walmartlabs.com/v1/search?query=ferrari&format=json&apiKey=evyfdf3gs4svd5vx3zs9br4w&callback=JSON_CALLBACK";

            $http.jsonp(hc.trendUrl)
                .success(function (data) {
                    hc.trendData = data;
                    // console.log(hc.trendData);
                });
        };

        hc.trends();
    }
}());
