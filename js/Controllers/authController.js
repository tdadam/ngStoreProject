(function(){
    'use strict';

   angular.module('authController', [])
       .controller('authController', authController);

    authController.$inject = ['$scope', 'authSetup', '$location', 'fbutil', '$localStorage', '$timeout'];

    function authController($scope, authSetup, $location, fbutil, $localStorage, $timeout) {

        var authC = this;
        var url = 'https://store-project.firebaseio.com';
        authC.facebookLogin = facebookLogin;
        authC.deleteFacebookData = deleteFacebookData;

        //authC.fbData = authFactory;
        // if facebook data is found in local storage, use it
        authC.message = authC.fbData && authC.fbData.facebook ? "Logged in to Facebook." : "No Facebook data found.";

        $scope.email = null;
        $scope.pass = null;
        $scope.confirm = null;
        $scope.createMode = false;

        $scope.login = function (email, pass) {
            $scope.err = null;
            authSetup.$authWithPassword({ email: email, password: pass }, {rememberMe: true})
                .then(function (/* user */) {
                    $location.path('/account');
                }, function (err) {
                    $scope.err = errMessage(err);
                });
        };

        $scope.createAccount = function () {
            $scope.err = null;
            if (assertValidAccountProps()) {
                var email = $scope.email;
                var pass = $scope.pass;
                // create user credentials in Firebase auth system
                authSetup.$createUser({email: email, password: pass})
                    .then(function () {
                        // authenticate so we have permission to write to Firebase
                        return authSetup.$authWithPassword({email: email, password: pass});
                    })
                    .then(function (user) {
                        // create a user profile in our data store
                        var ref = fbutil.ref('users', user.uid);
                        return fbutil.handler(function (cb) {
                            ref.set({email: email, name: name || firstPartOfEmail(email)}, cb);
                        });
                    })
                    .then(function (/* user */) {
                        // redirect to the account page
                        $location.path('/account');
                    }, function (err) {
                        $scope.err = errMessage(err);
                    });
            }
        };

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

        function errMessage(err) {
            return angular.isObject(err) && err.code ? err.code : err + '';
        }

        function firstPartOfEmail(email) {
            return ucfirst(email.substr(0, email.indexOf('@')) || '');
        }

        function ucfirst(str) {
            // inspired by: http://kevin.vanzonneveld.net
            str += '';
            var f = str.charAt(0).toUpperCase();
            return f + str.substr(1);
        }

        //var ref = new Firebase(url);
        function facebookLogin() {
            ref.authWithOAuthPopup('facebook', function (error, authData) {
                if (error) {
                    console.log('Log in to Facebook Failed', error);
                    authC.message = 'Log in to Facebook Failed. ' + error;
                } else {
                    console.log('Logged in to Facebook');
                    authC.message = 'Logged in to Facebook.';
                    $timeout(function() { // invokes $scope.$apply()
                        authC.fbData = authData;
                    });
                }
            });
        }
    //    TODO: Need a logout option
        function deleteFacebookData() {
            $localStorage.$reset();
            authC.fbData = {};
            authC.message = 'Facebook data deleted.'
        }
    }
}());