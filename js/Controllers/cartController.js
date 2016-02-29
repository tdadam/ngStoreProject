(function(){
    'use strict';

    angular.module('cartController', [])
        .controller('cartController', cartController);

    cartController.$inject = ['$timeout', '$scope', '$rootScope', '$state', 'user', 'fbutil', 'cartService', '$firebaseObject', '$firebaseArray'];

    function cartController($timeout, $scope, $rootScope, $state, user, fbutil, cartService, $firebaseObject, $firebaseArray) {
        var cC = this;
        var profile = '';

        (function(){
            if ($rootScope.loggedIn){
                var unbind;
                profile = $firebaseObject(fbutil.ref('users', user.uid));
                profile.$bindTo($scope, 'profile').then(function(ub) { unbind = ub; });
            }
        }());

        var items = [];

        if(!$rootScope.loggedIn){
            $state.go("login");
        }

        cC.itemsInCart = $firebaseArray(fbutil.ref('cartItems'));

        console.log(cC.itemsInCart);
        console.log(profile.$id);

        $timeout(function (){
            for (var i = 0; i < cC.itemsInCart.length; i++) {
                if (cC.itemsInCart[i].user === profile.$id){
                    items.push(cC.itemsInCart[i]);
                }
            }
            console.log(items);
        }, 500);

    }
}());