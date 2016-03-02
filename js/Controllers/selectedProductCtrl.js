(function () {
    'use strict';

    angular.module('select', [])
        .controller('selectCtrl', selectCtrl);
    //  .directive('ngElevateZoom', function() {
    //    return {
    //        restrict: 'A',
    //        link: function(scope, element, attrs) {
    //            element.attr('data-zoom-image',attrs.zoomImage);
    //            $(element).elevateZoom({
    //                //zoomType: "inner",
    //                //cursor: "crosshair",
    //                //zoomWindowFadeIn: 800,
    //                //zoomWindowFadeOut:950,
    //                ////zoomWindowFadeIn: 500,
    //                ////zoomWindowFadeOut: 750,
    //                scrollZoom:true,
    //                zoomType: "lens",
    //                lensShape: "round",
    //                lensSize: 160
    //            }).css("height","400px");
    //        }
    //    };
    //});

        //.directive('toastr', function() {
        //    toastr.options = {
        //        "title": "Added Item Successfully",
        //        "closeButton": false,
        //        "debug": false,
        //        "newestOnTop": false,
        //        "progressBar": false,
        //        "positionClass": "toast-top-right",
        //        "preventDuplicates": false,
        //        "onclick": null,
        //        "showDuration": "300",
        //        "hideDuration": "1000",
        //        "timeOut": "5000",
        //        "extendedTimeOut": "1000",
        //        "showEasing": "swing",
        //        "hideEasing": "linear",
        //        "showMethod": "fadeIn",
        //        "hideMethod": "fadeOut"
        //    };
        //});


    selectCtrl.$inject = ['$rootScope', 'fbutil', 'user', '$state', '$firebaseObject', 'homeService', 'cartService', '$sessionStorage', '$localStorage'];
    // list everything
    function selectCtrl($rootScope, fbutil, user, $state, $firebaseObject, homeService, cartService, $sessionStorage, $localStorage) {
        var se = this;
        se.clickEnter = function (keyEvent, search) {
            if (keyEvent.which === 13) {
                homeService.addSearch(search);
                $localStorage.searchQuery = search;
                $state.go("SearchResult", {searchQuery: $localStorage.searchQuery});

            }
        };

        se.addToCart = addToCart;

        se.newSearch = function () {

            homeService.addSearch(se.newSearchQuery);
            $localStorage.searchQuery = se.newSearchQuery;
            $state.go("SearchResult", {searchQuery: $localStorage.searchQuery});
        };
        se.search = homeService.storage.search;

        se.selected = $sessionStorage.object;


        //se.small_image = se.selected.largeImage;
        se.small_image = se.selected.largeImage;
        se.large_image = se.selected.largeImage;

        console.log(se.selected);


        se.profile = '';

        (function () {
            if ($rootScope.loggedIn) {
                se.profile = $firebaseObject(fbutil.ref('users', user.uid));
            }
        }());

        se.back = function () {
            $state.go("SearchResult", {searchQuery: $localStorage.searchQuery});
        };

        function addToCart(item) {

            var name = item.name;
            var img = item.thumbnailImage;
            var price = item.salePrice;
            var itemID = item.itemId;
            var profile = se.profile;

            var newItem = {
                name: name,
                image: img,
                price: price,
                Id: itemID
            };
            cartService.addToCart(newItem, profile);
        }
    }
}());
