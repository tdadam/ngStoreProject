/**
 * Created by edgarisla1 on 2/23/16.
 */
(function () {
    'use strict';

    angular.module('select', [])
        .controller('selectCtrl', selectCtrl);
    //apiCtrl.$inject = ['homeService'];
    //function apiCtrl(homeService) {

    selectCtrl.$inject = ['$http', '$state', '$localStorage','homeService'];
    // list everything
    function selectCtrl($http, $state, $localStorage, homeService) {
        var se = this;
        se.search=homeService.storage.search;



        se.back= function () {
            $state.go("SearchResult", {searchQuery: homeService.storage.search});
            console.log(homeService.storage.search);
        };
    }
}());
