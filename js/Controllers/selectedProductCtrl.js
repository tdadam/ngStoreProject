(function() {
    'use strict';

    angular.module('select', [])
        .controller('selectCtrl', selectCtrl);

    selectCtrl.$inject = ['$state', 'homeService', 'cartService', '$sessionStorage', '$localStorage', 'toaster', 'authSetup'];

    function selectCtrl($state, homeService, cartService, $sessionStorage, $localStorage, toaster, authSetup) {
        var se = this;
        //get object from storage
        se.search = homeService.storage.search;
        se.selected = $sessionStorage.object;

        se.profile = $sessionStorage.user;
        se.loggedIn = $sessionStorage.loggedIn;

        // search by clicking enter key
        se.clickEnter = function(keyEvent, search) {
            if (keyEvent.which === 13) {
                homeService.addSearch(search);
                $localStorage.searchQuery = search;
                $state.go("SearchResult", {
                    searchQuery: $localStorage.searchQuery
                });
            }
        };

        se.defaultImageIndex = 0;
        se.currentImage = se.selected.imageEntities[se.defaultImageIndex].largeImage;

        se.sendIndex = function(index) {
            se.currentImage = se.selected.imageEntities[index].largeImage;
        };

        se.addToCart = addToCart;
        //search with search button
        se.newSearch = function() {
            homeService.addSearch(se.newSearchQuery);
            $localStorage.searchQuery = se.newSearchQuery;
            $state.go("SearchResult", {
                searchQuery: $localStorage.searchQuery
            });
        };

        se.back = function() {
            $state.go("SearchResult", {
                searchQuery: $localStorage.searchQuery
            });
        };

        function addToCart(item) {
            toaster.pop('success', "Item Added to Cart:", item.name);
            var profile = se.profile;
            cartService.addToCart(item, profile);
        }
    }
}());
