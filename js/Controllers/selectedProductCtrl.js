(function () {
    'use strict';

    angular.module('select', [])
        .controller('selectCtrl', selectCtrl);
    //apiCtrl.$inject = ['homeService'];
    //function apiCtrl(homeService) {

    selectCtrl.$inject = ['$rootScope', 'fbutil', 'user', '$state', '$firebaseObject', 'homeService', 'cartService','$sessionStorage','$localStorage'];
    // list everything
    function selectCtrl($rootScope, fbutil, user, $state, $firebaseObject, homeService, cartService, $sessionStorage, $localStorage) {
        var se = this;
        $('#zoom_01').elevateZoom({
            zoomType: "inner",
            cursor: "crosshair",
            zoomWindowFadeIn: 500,
            zoomWindowFadeOut: 750
        });

        se.addToCart = addToCart;

        se.newSearch = function () {

            homeService.addSearch(se.newSearchQuery);
            $localStorage.searchQuery=se.newSearchQuery;
            $state.go("SearchResult", {searchQuery: $localStorage.searchQuery});
        };
        se.search = homeService.storage.search;
        se.selected=$sessionStorage.object;

        var profile = '';

        (function(){
            if ($rootScope.loggedIn){
                profile = $firebaseObject(fbutil.ref('users', user.uid));
            }
        }());

        se.back = function () {
            $state.go("SearchResult", {searchQuery: $localStorage.searchQuery});
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
