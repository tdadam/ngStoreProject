(function(){
    'use strict';

    angular.module('navController', [])
        .controller('navController', navController);

    navController.$inject = ['$scope', "$location", "authSetup", '$sessionStorage','homeService'];

    function navController($scope, $location, authSetup, $sessionStorage,homeService) {
        var nav = this;
        nav.profile = $sessionStorage.user;
        nav.loggedIn = $sessionStorage.loggedIn;
        //nav.loggedIn=homeService.loggedIn;
        console.log(nav.loggedIn);
        //
        ////TODO: FIX THIS!!! Not getting the ctrl to update when var changes
        $scope.$watch('$sessionStorage.loggedIn', function (newVal, oldVal) {
            //console.log("Changed");
            //nav.loggedIn = $sessionStorage.loggedIn;
        }, true);

        nav.isActive = isActive;

        function isActive(viewLocation) {
            return viewLocation === $location.path();
        }
    }
}());