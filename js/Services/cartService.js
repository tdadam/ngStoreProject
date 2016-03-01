(function () {
    'use strict';

    angular.module('cartService', [])
        .service('cartService', cartService);

    cartService.$inject = ['$rootScope', 'fbutil', '$firebaseObject', '$firebaseArray', 'authSetup', '$localStorage'];

    function cartService($rootScope, fbutil, $firebaseObject, $firebaseArray, authSetup, $localStorage) {
        var cS = this;
        cS.addToCart = addToCart;
        cS.checkUser = checkUser;

        cS.storage = $localStorage.$default(getDefaultData());
        cS.items = cS.storage.items;

        function getDefaultData() {
            return{
                items: []
            }
        }

        var ref = new Firebase("https://store-project.firebaseio.com");
        var cartRef = new Firebase(ref + "/cartItems");
        var cartItems = new $firebaseArray(cartRef);
        var profile = '';

        cS.itemsInCart = $firebaseArray(fbutil.ref('cartItems'));

        function addToCart(item) {
            cartItems.$add(item);
            cS.items.push(item);
        }

        function checkUser () {
            if ($rootScope.loggedIn) {
                var authSet = authSetup.$waitForAuth().then(function(a){
                    profile = $firebaseObject(fbutil.ref('users', a.uid));
                    cS.items = [];
                    for (var i = 0; i < cS.itemsInCart.length; i++) {
                        if (cS.itemsInCart[i].user === profile.$id) {

                            cS.items.push(cS.itemsInCart[i]);
                        }
                    }
                    $timeout(function(){});
                });

            }
        }
    }
}());