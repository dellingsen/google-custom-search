var express        = require('express');
var app            = express();
var mongoose       = require('mongoose');
var assert         = require('assert')
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var jwt            = require('jsonwebtoken');
var config         = require('./app/config'); 
var secrets        = require('./app/secrets')

// Services
var userService = require('./app/services/users');
var companyService = require('./app/services/companies');
var login = require('./app/services/login');

//Connect to the MongoDB
//mongoose.connect('mongodb://localhost:27017/selector');
mongoose.connect(config.database);

// get all data of the body (POST) parameters
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(methodOverride('X-HTTP-Method-Override'));
app.use(express.static(__dirname + '/public'));

// route middleware that will happen on every request
app.use(function(req, res, next) {

  // Add token to request object
  var token = getToken(req)
  req.token = token

  if (req.url == '/api/authenticate') {
    next()
    return
  }

  if (! token) {
    res.set({
      'WWW-Authenticate': 'Bearer realm="cadence-cloud"'
    })
    res.status(401).json({error:'Authentication required'})
    return
  }

  var root = jwt.decode(token).root

  var secret = root
    ? secrets.root.secret
    : secrets.user.secret

  jwt.verify(token, secret, function(err, d) {
    if (err) {
      res.set({
        'WWW-Authenticate': 'Bearer realm="home"'
        + ',error="invalid_token"'
      })
      res.status(401).json({error: 'Invalid token'})
      return
    }

    next()
  })
})

function getToken(req) {
  if (req.headers.authorization) {
    var c = req.headers.authorization.split(' ')
    if (c[0] == 'Bearer')
      return c[1]
  }
  return null
}

function defaultHandler(res) {
  return function(status, result, headers) {
    assert.equal(typeof status, 'number')
    assert.equal(typeof result, 'object')
    res.status(status).json(result)
  }
}

//Login to app
app.post('/api/authenticate', function(req, res) {
  login.authenticate(req.body, defaultHandler(res))
});

//Companies REST API
app.post('/api/companies', function(req, res) {
  companyService.createCompany(req.body, function (out) {
    res.json(out)
  })
})

app.delete('/api/companies', function(req, res) {
  companyService.deleteAll(function (out) {
    res.json(out)
  })
})

//Users REST API
app.post('/api/users', function(req, res) {
  userService.createUser(req.body, function (out) {
    res.json(out)
  })
})

app.get('/api/users', function(req, res) {
  userService.getUsers(function (out) {
    res.json(out)
  })
})

app.get('/api/users/:userid', function(req, res) {
  userService.getUser(req.params.userid, function (out) {
    res.json(out)
  })
})

app.delete('/api/users', function(req, res) {
  userService.deleteAll(function (out) {
    res.json(out)
  })
})

var port = process.env.PORT || 8080; // set our port
app.listen(port);
console.log('Server listening on port ' + port);

module.exports = app
