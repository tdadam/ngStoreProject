(function () {
    'use strict';

    angular.module('cartController', [])
        .controller('cartController', cartController);

    cartController.$inject = ['$scope', '$rootScope', '$state', 'user', 'fbutil', 'cartService', '$firebaseObject','$localStorage','homeService','$sessionStorage','$http'];

    function cartController($scope, $rootScope, $state, user, fbutil, cartService, $firebaseObject,$localStorage,homeService,$sessionStorage,$http) {
        var cC = this;


        cC.setProfile = setProfile;
        cC.loadItems = loadItems;
        cC.selectedItem=selectedItem;
        cC.profile = '';

        cC.clickEnter= function (keyEvent, search) {
            if (keyEvent.which=== 13){
                homeService.addSearch(search);
                $localStorage.searchQuery=search;
                $state.go("SearchResult", {searchQuery: $localStorage.searchQuery});

            }
        };

        cC.search = function() {
            homeService.addSearch(cC.newSearch);
            $localStorage.searchQuery=cC.newSearch;
            $state.go("SearchResult", {searchQuery: $localStorage.searchQuery});
        };


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