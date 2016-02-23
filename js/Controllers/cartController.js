(function(){
    'use strict';

    angular.module('cartController', [])
        .controller('cartController', cartController);

    cartController.$inject = ['$scope', 'fbutil', 'cartFactory'];

    function cartController($scope, fbutil, cartFactory) {
        var cC = this;
        cC.itemsInCart = cartFactory;
    }
}());