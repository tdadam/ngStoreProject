(function(){
    'use strict';

    angular.module('cartController', [])
        .controller('cartController', cartController);

    cartController.$inject = ['$rootScope', '$state', 'user', 'fbutil', 'cartService', '$firebaseObject', '$firebaseArray', '$scope'];

    function cartController($rootScope, $state, user, fbutil, cartService, $firebaseObject, $firebaseArray, $scope) {
        var cC = this;
        var profile = '';

        (function(){
            if ($rootScope.loggedIn){
                profile = $firebaseObject(fbutil.ref('users', user.uid));
                var unbind;
                // create a 3-way binding with the user profile object in Firebase
                profile.$bindTo($scope, 'profile').then(function(ub) { unbind = ub; });
            }
        }());


        var items = '';

        if(!$rootScope.loggedIn){
            $state.go("login");
        }

        cC.itemsInCart = $firebaseArray(fbutil.ref('cartItems'));
        console.log(cC.itemsInCart);


        //(function(){
        //    if ($rootScope.loggedIn){
        //        items = $firebaseArray(fbutil.ref('cartItems', itemsInCart.key));
        //    }
        //}())

    }
}());