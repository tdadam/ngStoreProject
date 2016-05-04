(function() {
    'use strict';

    angular.module('select', [])
        .controller('selectCtrl', selectCtrl);

    selectCtrl.$inject = ['$state', 'homeService', 'cartService', '$sessionStorage', '$localStorage', 'toaster', 'authSetup','$http'];

    function selectCtrl($state, homeService, cartService, $sessionStorage, $localStorage, toaster, authSetup,$http) {
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
            //cartService.addToCart(item, profile);
            console.log(authSetup.user._id);
            if(authSetup.user!=undefined) {
                $http.post('/api/add-item', {
                    userId: authSetup.user._id,
                    itemName: item.name,
                    item:item


                    //}).then(function (data) {
                    //    if (data.data == 'Email already registered') {
                    //        $scope.err = data.data;
                    //    } else {
                    //        $location.path('/home');
                    //}
                });
            }
            else{
                console.log("have to make add to cart button only visible if logged in");
            }
        }
    }
}());
