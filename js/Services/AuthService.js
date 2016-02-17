(function(){
   'use strict';

    angular.module('authFactory', ['$firebaseAuth'])
        .factory('authFactory', authFactory);

    authFactory.$inject = [];

    function authFactory($firebaseAuth) {
        var ref = new Firebase("https://store-project.firebaseio.com");

        return $firebaseAuth(ref);
    }
}());