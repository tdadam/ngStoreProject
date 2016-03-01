(function () {
    'use strict';

    angular.module('select', [])
        .controller('selectCtrl', selectCtrl).directive('ngElevateZoom', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.attr('data-zoom-image',attrs.zoomImage);
                $(element).elevateZoom({
                    //zoomType: "inner",
                    //cursor: "crosshair",
                    //zoomWindowFadeIn: 800,
                    //zoomWindowFadeOut:950,
                    ////zoomWindowFadeIn: 500,
                    ////zoomWindowFadeOut: 750,
                    scrollZoom:true,
                    zoomType: "lens",
                    lensShape : "round",
                    lensSize : 160
                }).css("height","400px");
            }
        };
    });


    selectCtrl.$inject = ['$rootScope', 'fbutil', 'user', '$state', '$firebaseObject', 'homeService', 'cartService','$sessionStorage','$localStorage'];
    // list everything
    function selectCtrl($rootScope, fbutil, user, $state, $firebaseObject, homeService, cartService, $sessionStorage, $localStorage) {
        var se = this;
        se.clickEnter= function (keyEvent, search) {
            if (keyEvent.which=== 13){
                homeService.addSearch(search);
                $localStorage.searchQuery=search;
                $state.go("SearchResult", {searchQuery: $localStorage.searchQuery});

            }
        };

        se.addToCart = addToCart;

        se.newSearch = function () {

            homeService.addSearch(se.newSearchQuery);
            $localStorage.searchQuery=se.newSearchQuery;
            $state.go("SearchResult", {searchQuery: $localStorage.searchQuery});
        };
        se.search = homeService.storage.search;
        se.selected=$sessionStorage.object;




        //se.small_image = se.selected.largeImage;
        se.small_image = se.selected.largeImage;
        se.large_image = se.selected.largeImage;

        console.log(se.selected);




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
