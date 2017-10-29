var User = require('../models/user');
var userService = require('./users');
var cred = require('credential')({work: 0.3})
var async = require('async')
var secrets = require('../secrets')
var _ = require('lodash')
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

exports.authenticate = function(body, callback) {
  console.log('login::authenticate')
  login(body, callback)
}

login = function(body, callback) {
  var user;

  async.waterfall([

    function(next) {
      userService.getUserByName(body.username, function (err, r) {
        if (err) {
          callback(500, {error: 'Internal error'})
          next(err)
        } else if (_.isEmpty(r)) {
          callback(401, {error: 'Authentication failed'})
          next(new Error())
        } else {
          next(null, r)
        }
      })
    },
    function(u, next) {
      user = u[0];
      cred.verify(user.password, body.password,
        function(err, valid) {
          if (err || !valid) {
            callback(401, {error: 'Login failed'})
            next(err || new Error())
          } else {
            next(null)
          }
        })
    }
  ], function(err) {
      sendToken(err, user, callback)
  })
}

// Create and send JWT (token) back to client for future authenticating
function sendToken(err, user, cb) {
  if (! err) {
    // User is fully authed at this point
    // JWT Payload has user information
    var jwt_payload = { user_id: user.id }

    cb(200, {
      token: sign(jwt_payload, secrets.user),
      auth_state: 'success',
      user: user
    }, 'Test')
  }
}

// JWT sign prepends header to token before it signs it
function sign(payload, conf) {
  return jwt.sign(payload, conf.secret, conf.options)
}