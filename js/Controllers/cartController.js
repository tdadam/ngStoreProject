(function () {
    'use strict';

    angular.module('cartController', [])
        .controller('cartController', cartController);

    cartController.$inject = ['$state', 'cartService', '$timeout', '$localStorage', 'homeService', '$sessionStorage'];

    function cartController($state, cartService, $timeout, $localStorage, homeService, $sessionStorage) {
        var cC = this;

        cC.loadItems = loadItems;
        cC.selectedItem = selectedItem;

        cC.profile = {};
        cC.loggedIn = false;

        if(authSetup != {}){
            cC.loggedIn = true;
            cC.profile = authSetup;
        }

        cC.total = 0;
        cC.cartTotal = 0;
        cC.items = [];

        cC.clickEnter = function (keyEvent, search) {
            if (keyEvent.which === 13) {
                homeService.addSearch(search);
                $localStorage.searchQuery = search;
                $state.go("SearchResult", {searchQuery: $localStorage.searchQuery});
            }
        };

        cC.search = function () {
            homeService.addSearch(cC.newSearch);
            $localStorage.searchQuery = cC.newSearch;
            $state.go("SearchResult", {searchQuery: $localStorage.searchQuery});
            console.log(cC.cartItemsNum);
        };

        //TODO: When we get items, this is going to be an api call as well
        function loadItems() {
            var profile = cC.profile;
            cC.items = cartService.loadItems(profile);

            $timeout(function () {
                cC.cartTotal = 0;
                for (var i = 0; i < cC.items.length; i++) {
                    cC.cartTotal += cC.items[i].salePrice;
                }
            }, 750);
        }

        if (authSetup == {}) {
            $state.go("login");
        }

        function selectedItem(object) {
            $sessionStorage.object = object;
        }

        loadItems();

    }
}());