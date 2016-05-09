(function () {
    'use strict';

    angular.module('navController', [])
        .controller('navController', navController);

    navController.$inject = ["$location", '$sessionStorage'];

    function navController($location, $sessionStorage) {
        var nav = this;

        if ($sessionStorage.loggedIn == null) {
            $sessionStorage.loggedIn = false;
        }

        nav.profile = $sessionStorage.user;
        nav.loggedIn = $sessionStorage.loggedIn;
        nav.numOfItems = $sessionStorage.itemSize;

        nav.isActive = isActive;

        function isActive(viewLocation) {
            return viewLocation === $location.path();
        }
    }
}());
