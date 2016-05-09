(function () {
    'use strict';

    angular.module('homeService', [])
        .service('homeService', homeService);

    homeService.$inject = ['$sessionStorage','$http','$rootScope'];

    function homeService($sessionStorage,$http,$rootScope) {

        //// list everything
        var hs = this;
        hs.storage = $sessionStorage;
        hs.selected = "";
        hs.addSearch = search;
        hs.addSelected = select;
        hs.getSize=get;


        // public functions
        function search(searchIn) {
            hs.storage.search = searchIn;
        }

        function select(name) {
            $sessionStorage.object = name;
            hs.selected = $sessionStorage.object;
        }
        function get(id) {
            if($sessionStorage.loggedIn==true) {
                $http.get('/api/getitems/' + id)
                    .then(function (data) {
                      $sessionStorage.itemSize=data.data.length;
                        $rootScope.numOfItems=$sessionStorage.itemSize;
                    });
            }
            else{
                $rootScope.numOfItems=null;
            }
        }
    }
}());
//(function () {
//    'use strict';
//
//    angular.module('homeService', [])
//        .service('homeService', homeService);
//
//    homeService.$inject = ['$sessionStorage','$http','$rootScope'];
//
//    function homeService($sessionStorage,$http,$rootScope) {
//
//        //// list everything
//        var hs = this;
//        hs.storage = $sessionStorage;
//        hs.selected = "";
//        hs.addSearch = search;
//        hs.addSelected = select;
//        hs.numItems=size;
//
//
//        // public functions
//        function search(searchIn) {
//            hs.storage.search = searchIn;
//        }
//
//        function select(name) {
//            $sessionStorage.object = name;
//            hs.selected = $sessionStorage.object;
//        }
//        function size(id) {
//            if($sessionStorage.loggedIn==true) {
//                $http.get('/api/getitems/' + id)
//                    .then(function (data) {
//                        console.log(data.data.length);
//                        $sessionStorage.itemSize=data.data.length;
//                        //$rootScope.numItems=$sessionStorage.itemSize;
//                        //console.log("rootScope: " + $rootScope.numItems);
//                    });
//            }
//            else{console.log("not logged in");}
//        }
//    }
//}());
