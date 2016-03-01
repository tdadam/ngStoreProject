(function(){
    'use strict';

    angular.module('cartController', [])
        .controller('cartController', cartController);

    cartController.$inject = ['$scope', '$rootScope', '$state', 'user', 'fbutil', 'cartService', '$firebaseObject','$localStorage'];

    function cartController ($scope, $rootScope, $state, user, fbutil, cartService, $firebaseObject,$localStorage) {
    var cC = this;

        cC.loading = loading;
        cC.items = [];
        function loading (){
            cartService.checkUser();
            cC.items = cartService.items;
        }

        //cC.items = cartService.items;
        //cC.items=$localStorage.object;
        //console.log(cC.items);
        cC.setProfile = setProfile;
        var profile = '';

        function setProfile() {
            if ($rootScope.loggedIn){
                var unbind;
                profile = $firebaseObject(fbutil.ref('users', user.uid));
                profile.$bindTo($scope, 'profile').then(function(ub) { unbind = ub; });
            }
        }

        if(!$rootScope.loggedIn){
            $state.go("login");
        }

        setProfile();
    }
}());