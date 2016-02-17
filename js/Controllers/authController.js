(function(){
    'use strict';

   angular.module('authController', ['$scope', 'authFactory'])
       .controller('authController', authController);

    authController.$inject = [];

    function authController($scope, authFactory) {

        var authC = this;

        $scope.login = function () {
            authFactory.$authWithPassword({
                email: $scope.uEmail,
                password: $scope.uPass
            }).then(function (authData) {
                console.log("Logged in as:", authData.uid);
            }).catch(function (error) {
                console.error("Authentication failed:", error);
            });
        };

        $scope.addUser = function () {

        }

    }
}());