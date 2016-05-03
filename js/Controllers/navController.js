(function(){
    'use strict';

    angular.module('navController', [])
        .controller('navController', navController);

    navController.$inject = ["$location"];

    function navController($location) {
        var nav = this;

        nav.profile = {};
        nav.loggedIn = false;

        if(authSetup != {}){
            nav.loggedIn = true;
            nav.profile = authSetup;
        }

        nav.isActive = isActive;

        function isActive(viewLocation) {
            return viewLocation === $location.path();
        }
    }
}());