angular.module('appStates').config(['$stateProvider', function($stateProvider) {

  $stateProvider

      .state('users', {
        url:'/users',
        templateUrl: 'views/user.html',
        controller: 'UserController',
        authenticate: true
      })
  }]);