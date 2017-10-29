angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

	// home page
	.when('/', {
		templateUrl: 'views/home.html',
		controller: 'MainController',
        loginRequired: true //
    })
    .when('/login', {
      templateUrl: 'views/login.html',
      controller: 'LoginController',
      loginRequired: true //
    })
	.when('/users', {
	  templateUrl: 'views/user.html',
	  controller: 'UserController',
      loginRequired: true //
    })
    .when('/adduser', {
      templateUrl: 'views/adduser.html',
      controller: 'AddUserController',
      loginRequired: true //
    })
    .when('/addcompany', {
      templateUrl: 'views/addcompany.html',
      controller: 'AddCompanyController',
      loginRequired: true //
    })
    .otherwise({redirectTo: '/login'})

  $locationProvider.html5Mode(true);

}]);