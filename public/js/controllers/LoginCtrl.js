var loginController = angular.module('LoginCtrl', []);


loginController.controller('LoginController', function($scope, $rootScope, $location, LoginSrv)
{

  $scope.submit = function() {

    var loginEntry = { username: $scope.username, password: $scope.password };

    LoginSrv.authenticate(loginEntry).success(function(data)
    {
      console.log('Authenticate data:');
      console.log('token: ' + data.token);
      console.log('username: ' + data.user.username);

      // Set security creds in root scope
      $rootScope.loggedInUser = data.user;
      $rootScope.userToken = data.token;

      // redirect success to index page
      $location.path('/');
    }).
    error(function(data, status) {
      $scope.errorMsg = {message: 'Error: could not login'};
      //$location.path('/login');
    });

  }

})