(function(){
    'use strict';

    angular.module('navController', [])
        .controller('navController', navController);

    navController.$inject = ["$location", "authSetup"];

    function navController($location, authSetup) {
        var nav = this;

        nav.profile = {};
        nav.loggedIn = false;

        if(authSetup != {}){
            nav.loggedIn = true;
            nav.profile = authSetup.user;
        }

        nav.isActive = isActive;

        function isActive(viewLocation) {
            return viewLocation === $location.path();
        }
    }
}());