(function () {
    'use strict';

    angular.module('cartController', [])
        .controller('cartController', cartController);

    cartController.$inject = ['$scope', '$rootScope', '$state', 'user', 'fbutil', 'cartService', '$firebaseObject','$localStorage','homeService','$sessionStorage'];

    function cartController($scope, $rootScope, $state, user, fbutil, cartService, $firebaseObject,$localStorage,homeService,$sessionStorage) {
        var cC = this;


        cC.setProfile = setProfile;
        cC.loadItems = loadItems;
        cC.selectedItem=selectedItem;
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
        function selectedItem(object){
            console.log(object);

                $sessionStorage.object=object;

        }

        function removeItem(item) {
            var profile2 = cC.profile;
            cartService.removeItem(item, profile2);
        }

        setProfile();
        loadItems();

    }
}());