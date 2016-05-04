(function () {
  "use strict";

  angular.module('accountController', [])
      .controller('accountController', accountController);

  accountController.$inject = ['$scope', 'authSetup', 'fbutil', 'user', '$location', 'toaster', '$sessionStorage', '$http'];

    function accountController($scope, authSetup, fbutil, user, $location, toaster, $sessionStorage, $http) {

      $scope.profile = $sessionStorage.user;
      $scope.loggedIn = $sessionStorage.loggedIn;

      //TODO: This entire file will need massive updates for PUT calls
      $scope.saveBtn = false;
      $scope.changeBtn = true;
      $scope.readChanged = true;
      $scope.color = "white";

      $scope.saveName = function () {
        $http.put('/api/profile/user', {
          "_id": $scope.profile._id,
          "user": $scope.profile.user,
          "password": $scope.profile.password,
          "email": $scope.profile.email,
          "provider": $scope.profile.provider
        }).then (function(data) {
          $sessionStorage.user = data.data;
          $scope.profile = $sessionStorage.user;
          $scope.color = "white";
          toaster.pop('success', "Successfully Changed Your User Name: ", $scope.profile.user);
          $scope.saveBtn = false;
          $scope.changeBtn = true;
        });
      };
      $scope.readChange = function () {
        $scope.changeBtn = false;
        $scope.readChanged = false;
        $scope.color = "yellow";
        $( "#in1" ).focus();
      };

      $scope.change = function () {
        $scope.saveBtn = true;
      };

      //TODO: This was the logout, not sure how passport does this
      $scope.logout = function() {
        $sessionStorage.loggedIn = false;
        $location.path('/login');
      };

      //TODO: This needs to be changed to a PUT call in the server.js
      $scope.changePassword = function(pass, confirm, newPass) {
        resetMessages();
        if( !pass || !confirm || !newPass ) {
          $scope.err = 'Please fill in all password fields';
        }
        else if( newPass !== confirm ) {
          $scope.err = 'New pass and confirm do not match';
        }
        else {
          authSetup.$changePassword({email: profile.email, oldPassword: pass, newPassword: newPass})
            .then(function() {
              $scope.msg = 'Password changed';
            }, function(err) {
              if (err.code === 'INVALID_PASSWORD') {
                $scope.err = 'Incorrect Password';
              }
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

      //TODO: Again, this needs to be updated to a PUT
      $scope.changeEmail = function(pass, newEmail) {
        resetMessages();
        var oldEmail = profile.email;
        authSetup.$changeEmail({oldEmail: oldEmail, newEmail: newEmail, password: pass})
          .then(function() {
            // store the new email address in the user's profile
            return fbutil.handler(function(done) {
              fbutil.ref('users', user.uid, 'email').set(newEmail, done);
            });
          })
          .then(function() {
            $scope.emailmsg = 'Email changed';
          }, function(err) {
              if (err.code === 'EMAIL_TAKEN') {
                  $scope.emailerr = 'The Email you entered has been taken.';
              }
              else if( !oldEmail || !newEmail || !pass ) {
                  $scope.emailerr = 'Please fill in all fields';
              }
              else if (err.code === 'INVALID_PASSWORD') {
                  $scope.emailerr = 'Incorrect Password';
              }
          });
      };
    }
}());
