(function () {
    "use strict";

    angular.module('accountController', [])
        .controller('accountController', accountController);

    accountController.$inject = ['$scope', '$location', 'toaster', '$sessionStorage', '$http'];

    function accountController($scope, $location, toaster, $sessionStorage, $http) {

        $scope.profile = $sessionStorage.user;
        $scope.loggedIn = $sessionStorage.loggedIn;

        $scope.saveName = function () {
            console.log($scope.profile.user);
            $http.put('/api/profile/user', {
                "_id": $scope.profile._id,
                "user": $scope.profile.user,
                "password": $scope.profile.password,
                "email": $scope.profile.email,
                "provider": $scope.profile.provider,
                "oldEmail": $sessionStorage.user.email
            }).then(function (data) {
                console.log(data.data);
                $sessionStorage.user = data.data;
                $scope.profile = $sessionStorage.user;
                toaster.pop('success', "Successfully Changed Your User Name: ", $scope.profile.user);
            });
        };

        $scope.logout = function () {
            $sessionStorage.loggedIn = false;
            $location.path('/login');
        };

        $scope.changePassword = function (pass, confirm, newPass) {
            resetMessages();
            if (!pass || !confirm || !newPass) {
                $scope.err = 'Please fill in all password fields';
            } else if (newPass !== confirm) {
                $scope.err = 'New pass and confirm do not match';
            } else if (pass != $sessionStorage.user.password) {
                $scope.err = 'Incorrect Password';
            } else {
                console.log($scope.newpass);
                console.log(newPass);
                $http.put('/api/profile/pass', {
                    "_id": $scope.profile._id,
                    "user": $scope.profile.user,
                    "password": newPass,
                    "email": $scope.profile.email,
                    "provider": $scope.profile.provider,
                    "oldEmail": $sessionStorage.user.email
                }).then(function (data) {
                    console.log(data.data);
                    $sessionStorage.user = data.data;
                    $scope.profile = $sessionStorage.user;
                    toaster.pop('success', "Successfully Changed Your Password");
                });
            }
        };

        $scope.clear = resetMessages;

        function resetMessages() {
            $scope.err = null;
            $scope.msg = null;
            $scope.emailerr = null;
            $scope.emailmsg = null;
        }

        $scope.changeEmail = function (pass, newEmail) {
            resetMessages();
            if (!pass || !newEmail) {
                $scope.err = 'Please fill in all fields';
            } else if (pass != $sessionStorage.user.password) {
                $scope.err = 'Incorrect Password';
            } else {
                $http.put('/api/profile/email', {
                    "_id": $scope.profile._id,
                    "user": $scope.profile.user,
                    "password": $scope.profile.password,
                    "email": newEmail,
                    "provider": $scope.profile.provider,
                    "oldEmail": $sessionStorage.user.email
                }).then(function (data) {
                    if (data.data == 'Email already registered') {
                        $scope.emailerr = data.data;
                    } else {
                        console.log(data.data);
                        $sessionStorage.user = data.data;
                        $scope.profile = $sessionStorage.user;
                        toaster.pop('success', "Successfully Changed Your Email: " + $scope.profile.email);
                    }
                });
            }
        };
    }
}());
