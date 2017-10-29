// AngularJS dependency injection - inject defined application modules into app
var app = angular.module('selectorApp', ['ngRoute', 'appRoutes', 'LoginCtrl', 'LoginService', 'MainCtrl', 'UserCtrl', 'UserService', 'CompanyCtrl', 'CompanyService']);

app.run(function($rootScope, $location, $http) {
  $rootScope.$on( "$routeChangeStart", function(event, next, current) {

    if ($rootScope.loggedInUser == null) {
      console.log('User is not logged in - Access Restricted')

      // no logged user, redirect to /login
      console.log('template URL = ' + next.templateUrl)

      if (next.templateUrl === "views/home.html") {
        $location.path("/");
      }
      else {
        $location.path("/login");
      }
    }
    else {
      console.log('Logged in user: ' + $rootScope.loggedInUser.username)

      // User is already logged in, so dont let them go back before logging out
      if ( next.templateUrl === "views/login.html") {
        $location.path("/");
      }

      // Send user token in each request to the server for verification
      console.log('Accessing server for route: ' + next.templateUrl)
      console.log('Send user token: ' + $rootScope.userToken)
      $http.defaults.headers.common.Authorization = 'Bearer ' + $rootScope.userToken;

    }
  });
});