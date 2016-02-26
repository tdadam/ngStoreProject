(function(){
    'use strict';

    angular.module('home')

        .controller('SearchResultController', SearchResultController);



    function SearchResultController(searchResult, $http, homeService) {

       var sc =this;
        sc.walData=searchResult.data;
        sc.searchLim=16;

        sc.selectedItem= function (name,name2) {
            homeService.addSelected(name);
        };

        sc.search = function() {
            homeService.addSearch(sc.newSearch);

            sc.url="http://api.walmartlabs.com/v1/search?query="+sc.newSearch+"&format=json&apiKey=evyfdf3gs4svd5vx3zs9br4w&callback=JSON_CALLBACK";


            $http.jsonp(sc.url)
                .success(function (data) {
                    sc.walData = data;
                });



        };


    }



}());
