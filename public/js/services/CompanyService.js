angular.module('CompanyService',[]).factory('CompanySrv', ['$http', '$rootScope', function($http, $rootScope) {

  return {
    getAll : function() {
      return $http.get('/api/companies');
    },

    // call to POST and create a new company
    create : function(data) {
      return $http.post('/api/companies', data);
    },

  }


}]);