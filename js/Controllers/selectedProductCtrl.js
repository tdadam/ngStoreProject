(function () {
    'use strict';

    angular.module('select', [])
        .controller('selectCtrl', selectCtrl);
    //apiCtrl.$inject = ['homeService'];
    //function apiCtrl(homeService) {

    selectCtrl.$inject = ['$rootScope', 'fbutil', 'user', '$state', '$firebaseObject', 'homeService', 'cartService'];
    // list everything
    function selectCtrl($rootScope, fbutil, user, $state, $firebaseObject, homeService, cartService) {
        var se = this;

        se.addToCart = addToCart;

        se.newSearch = function () {

            homeService.addSearch(se.newSearchQuery);
            //console.log(se.newSearchQuery);
            $state.go("SearchResult", {searchQuery: homeService.storage.search});
        };
        se.search = homeService.storage.search;
        se.selected = homeService.selected;

        var profile = '';

        (function(){
            if ($rootScope.loggedIn){
                profile = $firebaseObject(fbutil.ref('users', user.uid));
            }
        }());

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
            var user = profile.$id;

            var newItem = {
                name: name,
                image: img,
                price: price,
                Id: itemID,
                user: user
            };

            cartService.addToCart(newItem);
        }
    }
}());