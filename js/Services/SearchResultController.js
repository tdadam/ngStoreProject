/**
 * Created by edgarisla1 on 2/19/16.
 */
(function(){
    'use strict';

    angular.module('home')

        .controller('SearchResultController', SearchResultController);



    function SearchResultController(searchResult) {

       var sc =this;
        sc.walData=searchResult;
    }

}());
