(function() {
    'use strict';

    angular.module('cartService', [])
        .service('cartService', cartService);

    cartService.$inject = [];

    function cartService() {
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
