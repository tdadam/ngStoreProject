(function () {
    'use strict';

    angular.module('select', [])
        .controller('selectCtrl', selectCtrl);
    //apiCtrl.$inject = ['homeService'];
    //function apiCtrl(homeService) {

    selectCtrl.$inject = ['$http', '$state', '$localStorage', 'homeService'];
    // list everything
    function selectCtrl($http, $state, $localStorage, homeService) {
        var se = this;

        se.newSearch= function () {

            homeService.addSearch(se.newSearchQuery);
            console.log(se.newSearchQuery);
            $state.go("SearchResult", {searchQuery: homeService.storage.search});
        };
        se.search=homeService.storage.search;



        se.back= function () {
            $state.go("SearchResult", {searchQuery: homeService.storage.search});
            console.log(homeService.storage.search);
        };
    }
}());
