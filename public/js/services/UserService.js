angular.module('UserService',[]).factory('UserSrv', ['$http', '$rootScope', function($http, $rootScope) {

  return {
    getAll : function() {
      return $http.get('/api/users');
    },

    // call to POST and create a new user
    create : function(userData) {
      return $http.post('/api/users', userData);
    },

    // call to DELETE a user
    delete : function(id) {
      return $http.delete('/api/users/' + id);
    }
  }


}]);