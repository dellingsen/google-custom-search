var should = require('chai').should()
  , expect = require('chai').expect
  , assert = require('chai').assert
  , server = require('../server');

var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
  
var loginCreds = {username: "admin", password: "password"};
var authToken = '';

describe('Companies', function() {

    it('should add company(s) on /companies POST', function(done) {

		var login = function (){
		  return new Promise(function (resolve, reject){
			chai.request(server)
				.post('/api/authenticate')
				.send(loginCreds)
				.then(function(res){
					expect(res).to.have.status(200);
					authToken = res.body.token;
					resolve(authToken)
					return authToken;
				})
				.catch(function (err) {
				  reject(err)
				})
		  })
		}

		var create = function (){
		  return new Promise(function (resolve, reject){
			chai.request(server)
				.post('/api/companies')
				.set('authorization', 'Bearer ' + authToken)
				.send({'companynames': 'Spyder'})
				.then(function(res){
				  console.log('status: ' + res.status);
				  res.should.have.status(200);
				  res.should.be.json;
				  console.log(res.body)
					resolve(res.body)
				})
				.catch(function (err) {
				  reject(err)
				})
			})
		}

		var deleteCompanies = function () {
		  return new Promise(function (resolve, reject){
			chai.request(server)
				.delete('/api/companies')
				.set('authorization', 'Bearer ' + authToken)
				.then(function(res){
					console.log("Delete Companies Response:");
					console.log(res.status);
					res.should.have.status(200);
					resolve(res.body)
					//done();
				})
				.catch(function (err) {
				  reject(err)
				})
			})
		}				

			
		login()
		  .then(function() {
		    return create();
		  })
		  .then(function() {
		    return deleteCompanies();
		  })
		  .then(function(){ done() });
  })		
		
})