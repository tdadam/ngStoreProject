/**
 * Created by edgarisla1 on 2/18/16.
 */
(function(){
    'use strict';

    angular.module('home', [])

        .controller('homeController', homeController);

    //apiCtrl.$inject = ['homeService'];
    //function apiCtrl(homeService) {


        function homeController($http) {

        // list everything
        var hc = this;

        // JASONP get function to get data from walmart.
        hc.search = function() {

            hc.url="http://api.walmartlabs.com/v1/search?query="+hc.searchQuery+"&format=json&apiKey=evyfdf3gs4svd5vx3zs9br4w&callback=JSON_CALLBACK";


            $http.jsonp(hc.url)
                .success(function (data) {
                    hc.WalData = data;
                    console.log(hc.WalData);
                });



        };



    }

}());
