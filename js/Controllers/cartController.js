(function () {
    'use strict';

    angular.module('cartController', [])
        .controller('cartController', cartController);

    cartController.$inject = ['$state', '$timeout', '$localStorage', 'homeService', '$sessionStorage', '$http'];

    function cartController($state, $timeout, $localStorage, homeService, $sessionStorage, $http) {
        var cC = this;

        cC.loadItems = loadItems;
        cC.selectedItem = selectedItem;
        cC.deleteItem = deleteItem;

        cC.profile = $sessionStorage.user;
        cC.loggedIn = $sessionStorage.loggedIn;

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
        };

        function loadItems() {
            $http.get('/api/getitems/' + cC.profile._id)
                .then(function (data) {
                    cC.items = data.data;
                    $timeout(function () {
                        cC.cartTotal = 0;
                        for (var i = 0; i < cC.items.length; i++) {
                            cC.cartTotal += cC.items[i].itemObject.salePrice;
                        }
                    }, 750);
                });
        }

        if (cC.loggedIn == null || cC.loggedIn == false) {
            $state.go("login");
        }

        function selectedItem(object) {
            $sessionStorage.object = object;
        }

        //TODO: add call to remove items from the DB and reload page
        function deleteItem(item) {
            $http.delete('/api/deleteItem/' + item._id)
                .then(function (data) {
                    loadItems();
                });
        }

        loadItems();
    }
}());
