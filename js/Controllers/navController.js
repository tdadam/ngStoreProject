(function(){
    'use strict';

    angular.module('navController', [])
        .controller('navController', navController);

    navController.$inject = ["$location", '$sessionStorage'];

    function navController($location, $sessionStorage) {
        var nav = this;

        nav.profile = $sessionStorage.user;
        nav.loggedIn = $sessionStorage.loggedIn;

        nav.isActive = isActive;

        function isActive(viewLocation) {
            return viewLocation === $location.path();
        }
    }
}());