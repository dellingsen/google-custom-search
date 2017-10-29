var User = require('../models/user')
var cred = require('credential')({work: 0.3})
var async = require('async')
var uuid = require('node-uuid')

exports.createUser = function(body, callback) {
  // Create a new instance of the User model
  var newUser = new User();

  console.log('body:')
  console.log(body)

  var user;

  async.waterfall([
    function(next) {

      cred.hash(body.password, function (err, h) {
        if (err) return callback(err)

        console.log("building User object")
        newUser._id = uuid.v1();
        newUser.firstname = body.firstname;
        newUser.lastname = body.lastname;
        newUser.username = body.username;
        newUser.email = body.email;
        newUser.password = h;

        // Save the user and check for errors - return object result in callback
        newUser.save(function (err, result) {
          if (err) {
            console.log('user save error')
            console.log(err)
            callback(err)
            next(err)
          }
          else {
            console.log('user save success')
            user = result;
            next(null, result)
          }
        })
      })
    }
  ],
  function(err) {
    // All error cases should be handled above
    if (err) {
      console.log("Error: " + err)
    }
    else {
      console.log("End of Create user - return success")
      callback(user);
      //callback(200, user) // use with server.js defaultHandler
    }
  })
}

// Create endpoint /api/users for GET
exports.getUsers = function(callback) {
  // Use the User model to find all users
  User.find(function(err, users) {
    if (err) {
      callback(err)
    }
    else {
      callback(users)
    }
  })
}

// Create endpoint /api/users/:user_id for GET
exports.getUser = function(userid, callback) {
  // Use the User model to find a specific user
  console.log("find by userid: " + userid)
  User.findById(userid, function(err, user) {
    if (err)
      callback(err);

    console.log("found user: " + user)
    callback(user)
  })
}

exports.getUserByName = function(user_name, callback) {

  //var monthAgo = new Date();
  //monthAgo.setMonth(monthAgo.getMonth() - 1);
  //User.find({ admin: true }).where('created_at').gt(monthAgo).exec(function(err, users)

  /*
   SELECT *
   FROM users
   WHERE status = "A"
   ORDER BY user_id ASC
   */
  //User.find( { status: "admin" } ).sort( { username: 1 } )

  User.find({username: user_name}, function (err, user) {
    if (err) throw err;
    callback(err, user)
  })
}

// Create endpoint /api/users/:user_id for PUT
exports.putUser = function(userid, body, callback) {
  // Use the User model to find a specific user
  User.findById(userid, function(err, user) {
    if (err)
      callback(err);

    // Update the existing user email
    user.email = body.email;

    // Save the user and check for errors
    user.save(function(err) {
      if (err)
        callback(err);

      callback(user);
    });
  });
};

// Create endpoint /api/users/:user_id for DELETE
exports.deleteUser = function(userid, callback) {
  // Use the User model to find a specific user and remove it
  User.findByIdAndRemove(userid, function(err) {
    if (err)
      callback(err);

    callback({ message: 'User has been removed' });
  });
};

exports.deleteAll = function(callback) {
  // Use the User model to find a specific user and remove it
  User.remove().exec(function(err) {
    if (err) {
      console.log('error removing user documents')
      console.log(err)
    }
    else {
      console.log('successfully deleted user documents')
    }
  })
  callback({message: 'all users have been deleted'})
}