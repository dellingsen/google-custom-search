var Company = require('../models/company')
var async = require('async')
var _ = require('lodash');
var splitBy = require('split-by')
var uuid = require('node-uuid')

var google = require('googleapis');
var customsearch = google.customsearch('v1');
const CX = '009637816073108880163:nfsysoqnztc';
const API_KEY = 'AIzaSyBXGkVilmqEN0KSDAaQy1BlVVIA8r4nS6w';

exports.createCompany = function(body, callback) {

  var companies = body.companynames;
  var array = companies.split(',');
  var arrayLength = array.length;

  // find best matched URL from company name,
  // then pass url to new company and save to db
  var companyUrls = [];

  var counter = 0;
  array.map(function(element) {

    var cleanname = clean(element);
    var domain = '';

    customsearch.cse.list({ cx: CX, q: cleanname, auth: API_KEY, num: 1, start: 1 }, function (err, resp) {
      if (err) {
        return console.log('An error occured', err);
      }
      // Got the response from custom search
      if (resp.items && resp.items.length == 1) {
        domain = resp.items[0].displayLink;

        var newCompany = new Company();
        newCompany._id = uuid.v1();
        newCompany.companyname = element;
        newCompany.url = domain;

        companyUrls.push({companyname: element, companyurl: domain})

        newCompany.save(function (err, result) {
          if (err) {
            console.log('company save error')
            console.log(err)
            callback(err)
          } 
          counter++;                
          if (counter === arrayLength) {
            callback(companyUrls);
          }
        })              
      }
    })
  })
}

function clean(company) {
  var c = company;
  c = _.trimEnd( c, '"' );
  c = _.trimStart( c, '"' );
  c = _.deburr( c );
  c = _.replace( c, new RegExp( '-[0-9]12$', 'i' ), '' );
  c = _.replace( c, new RegExp( '^_(private|public)_', 'g' ), '' );
  c = splitBy( c, '-- ' );
  c = splitBy( c, '--' );
  c = splitBy( c, ' - - ' );
  c = splitBy( c, '__' );
  c = _.trimStart( c, '_' );
  c = _.trimStart( c, '-' );
  c = _.trimStart( c, '*' );
  c = _.trimStart( c, '.' );
  c = _.trimStart( c, '1 - ' );
  c = _.trimStart( c, '0' );
  c = _.trimStart( c, '- - ' );
  c = _.trimEnd( c, ' -' );
  c = _.replace( c, '*', '' );
  c = _.replace( c, "'", '' );
  c = _.replace( c, "''", '' );
  c = _.replace( c, "!", '' );
  c = _.replace( c, new RegExp( "'", 'g' ), '' );
  c = _.replace( c, new RegExp( ' - ', 'g' ), ' ' );
  c = _.replace( c, new RegExp( '_', 'g' ), ' ' );
  c = _.replace( c, new RegExp( ' ', 'g' ), '' );
  c = _.replace( c, new RegExp( '-', 'g' ), '' );
  c = _.replace( c, new RegExp( '_', 'g' ), '' );
  c = _.replace( c, new RegExp( '&', 'g' ), '' );
  c = _.trim( c );
  return c;
}

exports.deleteAll = function(callback) {
  Company.remove().exec(function(err) {
    if (err) {
      console.log('error removing company documents')
      callback({error: 'companies could not be deleted'})
    }
    else {
      console.log('successfully deleted company documents')
      callback({message: 'all companies have been deleted'})
    }
  })
}