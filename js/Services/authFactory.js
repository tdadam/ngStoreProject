(function(){
   'use strict';

    angular.module('authFactory', [])
        .factory('authFactory', authFactory);

    authFactory.$inject = ['$firebaseAuth'];

    function authFactory($firebaseAuth) {
        var ref = new Firebase("https://store-project.firebaseio.com");

        return $firebaseAuth(ref);

    }
}());