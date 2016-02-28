(function(){
    'use strict';

    angular.module('cartController', [])
        .controller('cartController', cartController);

    cartController.$inject = ['$rootScope', '$state', '$scope', 'fbutil', 'cartService'];

    function cartController($rootScope, $state, $scope, fbutil, cartService) {
        var cC = this;
        if(!$rootScope.loggedIn){
            $state.go("login")
        }
        cC.itemsInCart = cartService.ref;
    }
}());