(function () {
  "use strict";

  angular.module('accountController', [])
      .controller('accountController', accountController);

  accountController.$inject = ['$scope', '$location', 'toaster', '$sessionStorage', '$http'];

    function accountController($scope, $location, toaster, $sessionStorage, $http) {

      $scope.profile = $sessionStorage.user;
      $scope.loggedIn = $sessionStorage.loggedIn;

      //TODO: This entire file will need massive updates for PUT calls

      $scope.saveName = function () {
          console.log($scope.profile.user);
        $http.put('/api/profile/user', {
          "_id": $scope.profile._id,
          "user": $scope.profile.user,
          "password": $scope.profile.password,
          "email": $scope.profile.email,
          "provider": $scope.profile.provider,
          "oldEmail": $sessionStorage.user.email
        }).then (function(data) {
            console.log(data.data);
          $sessionStorage.user = data.data;
          $scope.profile = $sessionStorage.user;
            toaster.pop('success', "Successfully Changed Your User Name: ", $scope.profile.user);
        });
      };

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
        else if (pass != $sessionStorage.user.password) {
          $scope.err = 'Incorrect Password';
        }
        else{
          console.log($scope.newpass);
          console.log(newPass);
          $http.put('/api/profile/pass', {
          "_id": $scope.profile._id,
          "user": $scope.profile.user,
          "password": newPass,
          "email": $scope.profile.email,
          "provider": $scope.profile.provider,
          "oldEmail": $sessionStorage.user.email
        }).then (function(data) {
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

      //TODO: Again, this needs to be updated to a PUT
      $scope.changeEmail = function(pass, newEmail) {
        resetMessages();
        //var oldEmail = profile.email;
        //authSetup.$changeEmail({oldEmail: oldEmail, newEmail: newEmail, password: pass})
        //  .then(function() {
        //    // store the new email address in the user's profile
        //    return fbutil.handler(function(done) {
        //      fbutil.ref('users', user.uid, 'email').set(newEmail, done);
        //    });
        //  })
        //  .then(function() {
        //    $scope.emailmsg = 'Email changed';
        //  }, function(err) {
        //      if (err.code === 'EMAIL_TAKEN') {
        //          $scope.emailerr = 'The Email you entered has been taken.';
        //      }
        //      else if( !oldEmail || !newEmail || !pass ) {
        //          $scope.emailerr = 'Please fill in all fields';
        //      }
        //      else if (err.code === 'INVALID_PASSWORD') {
        //          $scope.emailerr = 'Incorrect Password';
        //      }
        //  });
      };
    }
}());