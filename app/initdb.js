var mongoose = require('mongoose')
var User = require('./models/user')
var userService = require('./services/users');
var userData = require( './testdata/users.json' )

mongoose.connect('mongodb://localhost:27017/selector')

console.log("Initializing database...")

User.remove();

//User.insertMany(userData)

userData.map(data => {
  //var user = new User()
  //user.save(data)
  
  userService.createUser(data, function (out) {
    console.log('createUser callback')  
    console.log(out)  
  })
  
})

//process.exit(0)
