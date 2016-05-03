(function() {
    'use strict';

    angular.module('authSetup', [])
        .service('authSetup', authSetup);

    authSetup.$inject = [];

    function authSetup() {
        var auth = this;
        auth.user = {};
    }

}());