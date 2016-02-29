(function () {
    'use strict';

    angular.module('cartService', [])
        .service('cartService', cartService);

    cartService.$inject = ['$firebaseArray'];

    function cartService($firebaseArray) {
     var cF = this;
        cF.addToCart = addToCart;

        var ref = new Firebase("https://store-project.firebaseio.com");
        var cartRef = new Firebase(ref + "/cartItems");
        var cartItems = new $firebaseArray(cartRef);

        function addToCart(item) {
            cartItems.$add(item);
        }
    }
}());