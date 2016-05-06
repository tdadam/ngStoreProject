(function () {
    'use strict';

    angular.module('authController', [])
        .controller('authController', authController);

    authController.$inject = ['$http', '$scope', '$location', '$sessionStorage'];

    function authController($http, $scope, $location, $sessionStorage) {

        this.$http = $http;

        $scope.email = null;
        $scope.pass = null;
        $scope.confirm = null;
        $scope.firstName = null;
        $scope.lastName = null;
        $scope.createMode = false;

        $scope.login = function (email, pass) {
            $http.post('/api/login', {
                email: email,
                pass: pass
            }).then(function (data) {
                $sessionStorage.user = data.data;
                $sessionStorage.loggedIn = true;
                $location.path('/home');
            }, function (data) {
                $scope.err = "Invalid username / password"
            });
        };

        //This has been converted and connected to Mongo
        $scope.createAccount = function () {
            $scope.err = null;
            if (assertValidAccountProps()) {
                var email = $scope.email;
                var pass = $scope.pass;
                var name = '';
                if ($scope.firstName == null && $scope.lastName == null) {
                    name = ucfirst(email.substr(0, email.indexOf('@')) || '');
                }
                else if ($scope.lastName == null) {
                    name = $scope.firstName;
                }
                else if ($scope.firstName == null) {
                    name = $scope.lastName;
                } else {
                    name = $scope.firstName + ' ' + $scope.lastName;
                }
                $http.post('/api/adduser', {
                    email: email,
                    pass: pass,
                    user: name
                }).then(function (data) {
                    if (data.data == 'Email already registered') {
                        $scope.err = data.data;
                    } else {
                        $scope.login(email, pass);
                    }
                });
            }
        };

        //No need to change, should function same as before
        function assertValidAccountProps() {
            if (!$scope.email) {
                $scope.err = 'Please enter an email address';
            } else if (!$scope.pass || !$scope.confirm) {
                $scope.err = 'Please enter a password';
            } else if ($scope.createMode && $scope.pass !== $scope.confirm) {
                $scope.err = 'Passwords do not match';
            }
            return !$scope.err;
        }

        function ucfirst(str) {
            // inspired by: http://kevin.vanzonneveld.net
            str += '';
            var f = str.charAt(0).toUpperCase();
            return f + str.substr(1);
        }
    }
}());
