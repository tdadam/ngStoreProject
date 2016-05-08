(function () {
    'use strict';

    angular.module('navController', [])
        .controller('navController', navController);

    navController.$inject = ["$location", '$sessionStorage','$http','homeService'];

    function navController($location, $sessionStorage,homeService) {
        var nav = this;
        if ($sessionStorage.loggedIn == null) {
            $sessionStorage.loggedIn = false;
        }

        nav.profile = $sessionStorage.user;
        nav.loggedIn = $sessionStorage.loggedIn;

        nav.isActive = isActive;

        function isActive(viewLocation) {
            return viewLocation === $location.path();
        }

        //nav.loadItems= function () {
        //    if($sessionStorage.loggedIn==true) {
        //        homeService.getSize(nav.profile._id);
        //    }
        //};
        //nav.loadItems();
    }
}());
