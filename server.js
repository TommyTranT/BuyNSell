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

// TEMP database for Listings
const listings = {};

// Generates a random ID
const generateRandomString = () => {
  let result = (Math.random() + 1).toString(36).substring(6);
  return result;
}

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
  const newID = generateRandomString();
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


// GET - go to create new listings page
app.get("/new_listing", (req, res) => {
  const {userID} = req.session;
  const templateVars = { user: users[userID] || undefined };
  console.log('logged in as: ', users[userID])

  // Checks if user is logged in
  if (!userID) {
    res.statusCode = 404;
    return res.send("Please Log in to create new listing.");
  }

  res.render("new_listing", templateVars);
});

// POST - Take input from create listings page and input data into Obj
app.post('/listings', (req, res) => {
  const {userID} = req.session;
  const templateVars = { user: users[userID] || undefined };
  const ownerId = users[userID].id;
  const ownerName = users[userID].name;
  console.log('logged in as: ', users[userID])

  let id = generateRandomString();
  listings[id] = {};
  listings[id].name = req.body.name;
  listings[id].description = req.body.description;
  listings[id].price = req.body.price;
  listings[id].is_sold = false;
  listings[id].owner_id = ownerId;
  listings[id].owner_name = ownerName;
  listings[id].is_removed = false;

  console.log(`Listings database`, listings);

  res.redirect(`/listings`)
  // res.redirect(`/listings/${id}`)
})

// GET - View all of your listings
app.get('/listings', (req, res) => {
  const {userID} = req.session;

  const templateVars = {
    user: users[userID] || undefined,
    listings: listings
  };

  res.render('listings', templateVars)
})

// GET - Show individual listings
app.get('/listings/:id', (req, res) => {
  const {userID} = req.session;
  console.log('logged in as: ', users[userID])

  const id = req.params.id;

  const templateVars = {
    user: users[userID] || undefined,
    name: listings[req.params.id].name,
    price: listings[req.params.id].price,
    description: listings[req.params.id].description,
    owner_name: listings[req.params.id].owner_name,
  };

  res.render('single_listing', templateVars)
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
