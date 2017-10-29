var userController = angular.module('UserCtrl', []);

userController.controller('UserController', function($scope, UserSrv)
{
  console.log('In UserController....calling UserService now.')

  UserSrv.getAll().success(function(data)
  {
    // Create userList property on the Application $scope object
    $scope.userList = data;
    $scope.userSize = data.length;
  }).
  error(function(data, status) {
    console.log('UserController:Error');
    console.log(data);
    $scope.errorMsg = {message: 'Error: no users were found.'};
  });

})


userController.controller('AddUserController', function($scope, $location, UserSrv)
{
  $scope.save = function() {
    var userEntry = { firstname: $scope.firstname, lastname: $scope.lastname,
                      username: $scope.username, password: $scope.password,
                      email: $scope.email, endpoint_type: 'email', endpoint_value: $scope.email};

    console.log('User Entry object:')
    console.log(userEntry)

    UserSrv.create(userEntry).success(function(data)
    {
      $location.path('/users');
    }).
    error(function(data, status) {
      $scope.errorMsg = {message: 'Error: could not create user'};
    });

  }

})