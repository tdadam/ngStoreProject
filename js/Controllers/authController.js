(function(){
    'use strict';

   angular.module('authController', [])
       .controller('authController', authController);

    authController.$inject = ['$scope', 'authFactory', '$localStorage', '$timeout'];

    function authController($scope, authFactory, $localStorage, $timeout) {

        var authC = this;
        var url = 'https://store-project.firebaseio.com';
        authC.facebookLogin = facebookLogin;
        authC.deleteFacebookData = deleteFacebookData;

        authC.fbData = $localStorage['firebase:session::store-project'];
        // if facebook data is found in local storage, use it
        authC.message = authC.fbData && authC.fbData.facebook ? "Logged in to Facebook." : "No Facebook data found.";

        $scope.login = function () {
            authFactory.$authWithPassword({
                email: $scope.uEmail,
                password: $scope.uPass
            }).then(function (authData) {
                console.log("Logged in as:", authData.uid);
            }).catch(function (error) {
                console.error("Authentication failed:", error);
            });
        };

        $scope.addUser = function () {

        };
        var ref = new Firebase(url);
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