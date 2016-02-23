/**
 * Created by edgarisla1 on 2/19/16.
 */
(function(){
    'use strict';

    angular.module('homeService', [])
        .service('homeService', homeService);

    homeService.$inject = ['$state', '$sessionStorage'];

    function homeService($state, $sessionStorage) {

        // list everything
        var hs = this;
        hs.storage = $sessionStorage.$default(getDefaultData());

        hs.addTask = search;
        // hs.removeCompleted = removeCompleted;   // removes all completed items from all lists
        hs.reset = reset;
        hs.addList=addList;

        // public functions
        function search(searchIn) {
            hs.storage.items.push(
                {
                    search:searchIn
                }
            );
            $state.go("SearchResult", {searchQuery: $sessionStorage.items[0].search});
            console.log($sessionStorage.items[0].search);
        }

        //function removeCompleted(currentList) {
        //    for (var i = hs.storage.items.length - 1; i >= 0; i--) {
        //        if (hs.storage.items[i].completed
        //            && hs.storage.items[i].listNum == currentList) {
        //            hs.storage.items.splice(i, 1);
        //        }
        //    }
        //}


        function reset() {
            hs.storage.$reset(getDefaultData());
        }
        function addList(newList){
            hs.storage.lists.push(newList);
        }

        // private functions
        function getDefaultData() {
            return {
                nextItemNum: "dog"
            };
        }

    }

}());

