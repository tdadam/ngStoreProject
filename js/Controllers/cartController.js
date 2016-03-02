(function () {
    'use strict';

    angular.module('cartController', [])
        .controller('cartController', cartController);

    cartController.$inject = ['$scope', '$rootScope', '$state', 'user', 'fbutil', 'cartService', '$firebaseObject'];

    function cartController($scope, $rootScope, $state, user, fbutil, cartService, $firebaseObject) {
        var cC = this;


        cC.setProfile = setProfile;
        cC.loadItems = loadItems;
        cC.profile = '';


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
        }

        if (!$rootScope.loggedIn) {
            $state.go("login");
        }

        setProfile();
        loadItems();

    }
}());