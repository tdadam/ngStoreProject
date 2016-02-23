(function(){
    'use strict';

    angular.module('cartFactory', [])
        .factory('cartFactory', cartFactory);

    cartFactory.$inject = ['$firebaseArray', 'fbutil'];

    function cartFactory($firebaseArray, fbutil) {

        return $firebaseArray(fbutil.ref());
    }
}());