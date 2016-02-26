(function(){
    'use strict';

    angular.module('cartController', [])
        .controller('cartController', cartController);

    cartController.$inject = ['$rootScope', '$state', '$scope', 'fbutil', 'cartFactory'];

    function cartController($rootScope, $state, $scope, fbutil, cartFactory) {
        var cC = this;
        if(!$rootScope.loggedIn){
            $state.go("login")
        }
        cC.itemsInCart = cartFactory.ref;
    }
}());