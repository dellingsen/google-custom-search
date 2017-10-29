var companyController = angular.module('CompanyCtrl', []);

companyController.controller('CompanyController', function($scope, CompanySrv)
{
  console.log('In companyController....calling Service now.')

  CompanySrv.getAll().success(function(data)
  {
    $scope.companyList = data;
    $scope.companySize = data.length;
  }).
  error(function(data, status) {
    console.log('CompanyController:Error');
    console.log(data);
    $scope.errorMsg = {message: 'Error: no companies were found.'};
  })
})


companyController.controller('AddCompanyController', function($scope, $location, CompanySrv)
{
  console.log('In AddCompanyController.....')

  $scope.save = function() {
    console.log('Form data for company:')
    console.log($scope.companyname)

    var array = $scope.companyname.split(',');
    if (array.length < 25) {

      var companies = { companynames: $scope.companyname};

      CompanySrv.create(companies).success(function(data)
      {
        console.log('CompanyController:Save Success');
        console.log(data);
        $scope.companyResults = data;
      }).
      error(function(data, status) {
        console.log('CompanyController:Error');
        console.log(data);
        $scope.errorMsg = {message: 'Error: could not create company'};
      });
    }
    else {
      $scope.errorMsg = {message: 'Error: Please limit your search to 25 companies.'};
    }
  }
})