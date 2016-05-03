(function () {
    'use strict';

    angular.module('authController', [])
        .controller('authController', authController);

    authController.$inject = ['$http', '$scope', '$location', 'authSetup'];

    function authController($http, $scope, $location, authSetup) {

        this.$http = $http;

        $scope.email = null;
        $scope.pass = null;
        $scope.confirm = null;
        $scope.firstName = null;
        $scope.lastName = null;
        $scope.createMode = false;

        $scope.login = function (email, pass) {
            console.log(email);
            console.log(pass);
            $http.post('/api/login', {
                _id: email,
                pass: pass
                //TODO: Not getting back the data I want to see, unable to return helpful info to user
            }).then(function (data) {
                console.log(data);
                if( data.data == 'Incorrect password'){
                    $scope.err = 'Incorrect Password';
                }
                else if (data.data == 'User does not exist'){
                    $scope.err = 'User does not exist';
                }
                else{
                    authSetup.user = data.data;
                    $location.path('/home');
                }

            });
        };


//This has been converted and connected to Mongo
        //TODO: I think I broke this again, email is no longer the _id and is harder to check uniqueness
        $scope.createAccount = function () {
            $scope.err = null;
            if (assertValidAccountProps()) {
                var email = $scope.email;
                var pass = $scope.pass;
                var name = '';
                if($scope.firstName == null && $scope.lastName == null){
                    name = ucfirst(email.substr(0, email.indexOf('@')) || '');
                }
                else if ($scope.lastName == null){
                    name = $scope.firstName;
                }
                else if ($scope.firstName == null){
                    name = $scope.lastName;
                }
                else {
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
                        $location.path('/home');
                    }
                })
            }
        };

//No need to change, should function same as before
        function assertValidAccountProps() {
            if (!$scope.email) {
                $scope.err = 'Please enter an email address';
            }
            else if (!$scope.pass || !$scope.confirm) {
                $scope.err = 'Please enter a password';
            }
            else if ($scope.createMode && $scope.pass !== $scope.confirm) {
                $scope.err = 'Passwords do not match';
            }
            return !$scope.err;
        }

//Necessary? Might delete
        function errMessage(err) {
            return angular.isObject(err) && err.code ? err.code : err + '';
        }

        function ucfirst(str) {
            // inspired by: http://kevin.vanzonneveld.net
            str += '';
            var f = str.charAt(0).toUpperCase();
            return f + str.substr(1);
        }
    }
}());