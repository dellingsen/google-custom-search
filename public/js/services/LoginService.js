angular.module('LoginService',[]).factory('LoginSrv', ['$http', function($http) {

  return {
    authenticate : function(data) {
      return $http.post('/api/authenticate', data);
    }
  }

}]);