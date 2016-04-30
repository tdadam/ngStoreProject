(function(){
    'use strict';

   angular.module('authController', [])
       .controller('authController', authController);

    authController.$inject = ['$http', '$scope', 'authSetup', '$localStorage', '$timeout', '$location', 'fbutil', 'facebookService'];

    function authController($http, $scope, authSetup, $localStorage, $timeout, $location, fbutil, facebookService) {

        var authC = this;
        this.$http = $http;
        //var url = 'https://store-project.firebaseio.com';

        authC.fbData = $localStorage['firebase:session::store-project'];
        // if facebook data is found in local storage, use it
        authC.message = authC.fbData && authC.fbData.facebook ? "Logged in to Facebook." : "No Facebook data found.";
        authC.fbData = {};

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
                email: email,
                pass: pass
            }).then(function(data){
                $location.path('/home');
            });
        };

        $scope.createAccount = function () {
            $scope.err = null;
            if ( assertValidAccountProps() ) {
                var email = $scope.email;
                var pass = $scope.pass;
                var name = $scope.firstName + ' ' + $scope.lastName;
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
                            ref.set({email: email, name: name || firstPartOfEmail(email), provider: 'email' }, cb);
                        });
                    })
                    .then(function (/* user */) {
                        // redirect to the account page
                        $location.path('/home');
                    }, function (err) {
                        $scope.err = errMessage(err);
                    });
            }
        };

        function assertValidAccountProps() {
            if( !$scope.email ) {
                $scope.err = 'Please enter an email address';
            }
            else if( !$scope.pass || !$scope.confirm ) {
                $scope.err = 'Please enter a password';
            }
            else if( $scope.createMode && $scope.pass !== $scope.confirm ) {
                $scope.err = 'Passwords do not match';
            }
            return !$scope.err;
        }

        function errMessage(err) {
            return angular.isObject(err) && err.code? err.code : err + '';
        }

        function firstPartOfEmail(email) {
            return ucfirst(email.substr(0, email.indexOf('@'))||'');
        }

        function ucfirst (str) {
            // inspired by: http://kevin.vanzonneveld.net
            str += '';
            var f = str.charAt(0).toUpperCase();
            return f + str.substr(1);
        }
    }
}());