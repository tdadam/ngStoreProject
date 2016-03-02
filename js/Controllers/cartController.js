(function () {
    'use strict';

    angular.module('cartController', [])
        .controller('cartController', cartController);

    cartController.$inject = ['$scope', '$rootScope', '$state', 'user', 'fbutil', 'cartService', '$firebaseObject', '$timeout'];

    function cartController($scope, $rootScope, $state, user, fbutil, cartService, $firebaseObject, $timeout) {
        var cC = this;

        cC.setProfile = setProfile;
        cC.loadItems = loadItems;
        cC.profile = '';
        cC.total = 0;
        cC.cartTotal = 0;
        cC.items = [];

        function setProfile() {
            if ($rootScope.loggedIn) {
                var unbind;
                cC.profile = $firebaseObject(fbutil.ref('users', user.uid));
                cC.profile.$bindTo($scope, 'profile').then(function (ub) {
                    unbind = ub;
                });
            }

        }

        function loadItems() {
            var profile = cC.profile;
            cC.items = cartService.loadItems(profile);

            $timeout(function(){for (var i = 0; i < cC.items.length; i++) {
                cC.cartTotal += cC.items[i].salePrice;
            }}, 1500);
        }

        if (!$rootScope.loggedIn) {
            $state.go("login");
        }

        setProfile();
        loadItems();

    }
}());