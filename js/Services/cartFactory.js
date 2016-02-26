(function () {
    'use strict';

    angular.module('cartFactory', [])
        .factory('cartFactory', cartFactory);

    cartFactory.$inject = ['$firebaseArray', 'fbutil'];

    var cart = {
        ref: cartFactory,
        add: function (item) {
            cart.ref.$add(item)
        }

    };

    function cartFactory($firebaseArray, fbutil) {

        return $firebaseArray(fbutil.ref('/cart'));
    }
}());