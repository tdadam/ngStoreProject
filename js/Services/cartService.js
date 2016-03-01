(function () {
    'use strict';

    angular.module('cartService', [])
        .service('cartService', cartService);

    cartService.$inject = ['$rootScope', 'fbutil', '$firebaseObject', '$firebaseArray', 'authSetup', '$localStorage', '$timeout'];

    function cartService($rootScope, fbutil, $firebaseObject, $firebaseArray, authSetup, $localStorage, $timeout) {
        var cS = this;
        cS.addToCart = addToCart;
        cS.checkUser = checkUser;

        cS.storage = $localStorage.$default(getDefaultData());
        cS.items = cS.storage.items;

        //example
        $localStorage.object=cS.items;
        console.log(cS.items);

        function getDefaultData() {
            return{
                items: []
            }
        }

        var ref = new Firebase("https://store-project.firebaseio.com");
        var cartRef = new Firebase(ref + "/cartItems");
        var cartItems = new $firebaseArray(cartRef);
        var profile = '';

        console.log(cartItems);

        cS.itemsInCart = $firebaseArray(fbutil.ref('cartItems'));
console.log(cS.itemsInCart);

        function addToCart(item) {
            cartItems.$add(item);
            cS.items.push(item);
        }

        function checkUser () {
            if ($rootScope.loggedIn) {
                var authSet = authSetup.$waitForAuth().then(function(a){
                    profile = $firebaseObject(fbutil.ref('users', a.uid));
                    $localStorage.object = [];
                    cS.items = [];
                    for (var i = 0; i < cS.cartItems.length; i++) {
                        if (cS.cartItems[i].user === profile.$id) {
                            cS.items.push(cS.itemsInCart[i]);
                        }
                    }
                    console.log(cS.itemsInCart);
                });

            }
        }
    }
}());
