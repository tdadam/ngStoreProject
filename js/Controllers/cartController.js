(function(){
    'use strict';

    angular.module('cartController', [])
        .controller('cartController', cartController);

    cartController.$inject = ['$scope', '$rootScope', '$state', 'user', 'fbutil', 'cartService', '$firebaseObject'];

    function cartController ($scope, $rootScope, $state, user, fbutil, cartService, $firebaseObject) {
    var cC = this;

        cC.items = cartService.items;
        cC.setProfile = setProfile;
        var profile = '';

        function setProfile() {
            if ($rootScope.loggedIn){
                var unbind;
                profile = $firebaseObject(fbutil.ref('users', user.uid));
                profile.$bindTo($scope, 'profile').then(function(ub) { unbind = ub; });
            }
            cartService.checkUser();
        }

        if(!$rootScope.loggedIn){
            $state.go("login");
        }

        setProfile();

        console.log(cC.items);
    }
}());