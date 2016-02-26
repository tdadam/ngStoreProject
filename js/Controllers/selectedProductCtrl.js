(function () {
    'use strict';

    angular.module('select', [])
        .controller('selectCtrl', selectCtrl);
    //apiCtrl.$inject = ['homeService'];
    //function apiCtrl(homeService) {

    selectCtrl.$inject = ['$http', '$state', '$localStorage', 'homeService', 'cartService'];
    // list everything
    function selectCtrl($http, $state, $localStorage, homeService, cartService) {
        var se = this;

        se.addToCart = addToCart;

        se.newSearch = function () {

            homeService.addSearch(se.newSearchQuery);
            //console.log(se.newSearchQuery);
            $state.go("SearchResult", {searchQuery: homeService.storage.search});
        };
        se.search = homeService.storage.search;
        se.selected = homeService.selected;


        se.back = function () {
            $state.go("SearchResult", {searchQuery: homeService.storage.search});
            console.log(homeService.storage.search);
        };

        function addToCart(item) {
            console.log(item);
            var name = item.name;
            var img = item.thumbnailImage;
            var price = item.salePrice;
            var itemID = item.itemId;
            //var user = Auth.uid;

            var newItem = {
                name: name,
                image: img,
                price: price,
                Id: itemID
            };

            cartService.addToCart(newItem);
        }
    }
}());