(function () {
    'use strict';

    angular.module('home', [])
        .controller('homeController', homeController);

    homeController.$inject = ['$http', '$state', '$localStorage', 'homeService'];

    function homeController($http, $state, $localStorage, homeService) {
        var hc = this;

        //------> trends not working from walmart side
        //hc.trendurl="http://api.walmartlabs.com/v1/trends?format=json&apiKey=evyfdf3gs4svd5vx3zs9br4w&callback=JSON_CALLBACK";
        hc.trendUrl = "http://api.walmartlabs.com/v1/search?query=ferrari&format=json&apiKey=evyfdf3gs4svd5vx3zs9br4w&callback=JSON_CALLBACK";
        hc.catUrl = "http://api.walmartlabs.com/v1/taxonomy?format=json&apiKey=evyfdf3gs4svd5vx3zs9br4w";
        hc.method = 'JSONP';

        // JASONP get function to get data from walmart.
        hc.search = function () {
            $localStorage.searchQuery = hc.searchQuery;
            homeService.addSearch($localStorage.searchQuery);
            $state.go("SearchResult", {searchQuery: $localStorage.searchQuery});
        };

        hc.trends = function () {
            //------> trends not working from walmart side
            //hc.trendurl="http://api.walmartlabs.com/v1/trends?format=json&apiKey=evyfdf3gs4svd5vx3zs9br4w&callback=JSON_CALLBACK";
            hc.trendUrl = "http://api.walmartlabs.com/v1/search?query=ferrari&format=json&apiKey=evyfdf3gs4svd5vx3zs9br4w&callback=JSON_CALLBACK";
            $http.jsonp(hc.trendUrl)
                .success(function (data) {

                    hc.carouselDat = data.items;
                });
        };

        hc.trends();

        // add searches to a service
        hc.selectedItem = function (name) {
            homeService.addSelected(name);
        };

        //bootstrap carousel
        $('.carousel').carousel({
            interval: 4000
        });

        hc.myFunc = function (keyEvent, search) {
            if (keyEvent.which === 13) {
                homeService.addSearch(search);
                $localStorage.searchQuery = hc.searchQuery;
                $state.go("SearchResult", {searchQuery: homeService.storage.search});
            }
        };
    }
}());
