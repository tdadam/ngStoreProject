/**
 * Created by edgarisla1 on 2/19/16.
 */
(function(){
    'use strict';

    angular.module('home')

        .controller('SearchResultController', SearchResultController);



    function SearchResultController(searchResult, $http) {

       var sc =this;
        sc.walData=searchResult.data;

        sc.search = function() {

            sc.url="http://api.walmartlabs.com/v1/search?query="+sc.newSearch+"&format=json&apiKey=evyfdf3gs4svd5vx3zs9br4w&callback=JSON_CALLBACK";


            $http.jsonp(sc.url)
                .success(function (data) {
                    sc.walData = data;
                  //  console.log(sc.walData);
                });



        };


    }



}());
