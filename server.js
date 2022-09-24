// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT = process.env.PORT || 8080;
const express = require('express');
const app = express();
app.set('view engine', 'ejs');
const sassMiddleware = require('./lib/sass-middleware');
//const morgan = require('morgan');
//app.use(morgan('dev'));
const bcrypt = require("bcryptjs");
const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: ['userID']
}));

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(express.urlencoded({ extended: true }));
app.use(
  '/styles',
  sassMiddleware({
    source: __dirname + '/styles',
    destination: __dirname + '/public/styles',
    isSass: false, // false => scss, true => sass
  })
);
app.use(express.static('public'));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const userApiRoutes = require('./routes/users-api');
const widgetApiRoutes = require('./routes/widgets-api');
const usersRoutes = require('./routes/users');

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// Note: Endpoints that return data (eg. JSON) usually start with `/api`
app.use('/api/users', userApiRoutes);
app.use('/api/widgets', widgetApiRoutes);
app.use('/users', usersRoutes);
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

//homepage
app.get('/', (req, res) => {
  const {userID} = req.session;
  const templateVars = { user: users[userID] || undefined };
  console.log('logged in as: ', users[userID])
  //if (userID) {
  //  return res.redirect('/');
  //}
  res.render('index', templateVars);
});

//go to login page
app.get("/login", (req, res) => {
  const {userID} = req.session;
  const templateVars = { user: undefined };
  if (userID) {
    return res.redirect('/');
  }
  res.render("login", templateVars);
});

//login
app.post("/login", (req, res) => {

  //TEMPORARY helper function, replace with pool.query with conditionals
  const userLookupByEmail = function(database, email) {
    for (let user in database) {
      if (database[user].email === email) {
        return user;
      }
    }
    return null;
  };

  const { email, password } = req.body;
  const checkUser = userLookupByEmail(users, email);
//password check REPLACE with AJAX form validation
  if (!bcrypt.compareSync(password, users[checkUser].password)) {
    res.statusCode = 403;
    res.send("Password does not match for his email address.");
  }
  req.session.userID = checkUser;
  res.redirect('/');
});

//logout
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect('/');
});

//go to register page
app.get("/register", (req, res) => {
  const {userID} = req.session;
  const templateVars = { user: undefined };
  //redirect if logged in
  if (userID) {
    return res.redirect('/');
  }
  res.render("register", templateVars);
});

//TEMPORARY STORE USER TO LOCAL VARIABLE

class User {

  constructor(id, name, email, password) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
  }

}

//temp user database REPLACE WITH SQL
const users = {};

//register new user
app.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  const newID = 'TESTUSER1'
  const hashedPassword = bcrypt.hashSync(password, 10);

  //password check, REPLACE WITH AJAX form validation
  if (password !== password2) {
    res.statusCode = 403;
    return res.send("Passwords do not match. Please try again.");
  }

  users[newID] = new User(newID, name, email, hashedPassword);
  req.session.userID = newID;
  res.redirect(`/`);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
