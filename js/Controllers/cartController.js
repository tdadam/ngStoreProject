(function(){
    'use strict';

    angular.module('cartController', [])
        .controller('cartController', cartController);

    cartController.$inject = ['$scope', '$rootScope', '$state', 'user', 'fbutil', 'cartService', '$firebaseObject'];

    function cartController ($scope, $rootScope, $state, user, fbutil, cartService, $firebaseObject) {
    var cC = this;

        cC.items = cartService.items;
        cC.checkUser = checkUser;
        var profile = '';

        function setProfile() {
            if ($rootScope.loggedIn){
                var unbind;
                profile = $firebaseObject(fbutil.ref('users', user.uid));
                profile.$bindTo($scope, 'profile').then(function(ub) { unbind = ub; });

            }
        }

        if(!$rootScope.loggedIn){
            $state.go("login")
        }

        function checkUser() {
            cartService.checkUser();
        }
        checkUser();
console.log(cC.items);
    }
}());