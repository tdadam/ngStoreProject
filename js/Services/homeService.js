/**
 * Created by edgarisla1 on 2/19/16.
 */
(function(){
    'use strict';

    angular.module('homeService', [])
        .service('homeService', homeService);

    homeService.$inject = ['$state', '$sessionStorage'];

    function homeService($state, $sessionStorage) {

        //// list everything
        var hs = this;
        hs.storage = $sessionStorage;

        hs.addSearch = search;

        // public functions
        function search(searchIn) {
            hs.storage.search=searchIn;
        }


    }

}());

