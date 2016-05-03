(function () {
    'use strict';

    angular.module('cartService', [])
        .service('cartService', cartService);

    cartService.$inject = ['$firebaseArray'];

    function cartService($firebaseArray) {
        var cS = this;
        cS.addToCart = addToCart;
        cS.loadItems = loadItems;

        function addToCart(item, user) {
            //TODO: Guess what!
            //cartItems.$add(item);
        }

        function loadItems(user) {
            //TODO: Same thing...
            //return loadView;
        }
    }
}());