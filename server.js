// load .env data into process.env
require('dotenv').config();

// import database query functions
const databaseFn = require('./db/index.js');

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
  keys: ['userID'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
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
const { database } = require('pg/lib/defaults.js');

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

// homepage
app.get('/', (req, res) => {

  /* ONLY USE THIS BLOCK FOR RENDERS WHERE THE USER IS LOGGED IN
  This block is currently required by every page that uses the navbar, and is
  used to render the view with the correct templateVars.user value.
  This is required by the navbar partial.
  It checks to see if the cookie matches a user in the db, then injects the
  matched user into the EJS view & partials.
  On line with return render, change the first param of .render to the view you want to render.
  */
  const {userID} = req.session;
  const templateVars = {user: undefined};
  if (userID) {
    return databaseFn.getUserWithId(userID)
    .then(dbUser => {
      console.log(`returned user from Id:`, dbUser);
      templateVars.user = dbUser;
      console.log('logged in successfully as: ', dbUser.name)

      databaseFn.getLimitListings(8)
        .then(listings => {
          templateVars.listings = listings;
          console.log(`listings from fn:`, listings);
          return res.render('index', templateVars);
        })
      // route logic here

    })
    .catch(e => {
      console.log(e);
      res.send(e);
    })
  }
  /* end of required block */
  databaseFn.getLimitListings(8)
        .then(listings => {
          templateVars.listings = listings;
          console.log(`listings from fn:`, listings);
          return res.render('index', templateVars);
        })
        .catch(e => {
          console.log(e);
          res.send(e);
        })
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

// POST - login
app.post("/login", (req, res) => {

  const {email, password} = req.body;
  console.log(`taken email ${email} and ${password} from req.body`);

  // call login function from index.js
  databaseFn.login(email, password)
    .then(user => {
      if (!user) {
        res.send({error: "error"});
        return;
      }
      req.session.userID = user.id;
      res.redirect('/');
    })
    .catch(e => {
      console.log(e);
    });

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

// POST - register new user
app.post("/register", (req, res) => {
  const user = req.body;

  //password check, REPLACE WITH AJAX form validation
  if (user.password !== user.password2) {
    res.statusCode = 403;
    return res.send("Passwords do not match. Please try again.");
  }
  user.password = bcrypt.hashSync(user.password, 12);

  // call helper function from db/index.js
  databaseFn.registerNewUser(user)
  .then(user => {
    if (!user) {
      res.send({error: 'error'});
      return;
    }
    req.session.userID = user.id;
    res.redirect(`/`);
  })
  // .catch(e => res.send(e));

});

// GET - go to create new listings page
app.get("/new_listing", (req, res) => {

  // req. logged in path block
  const {userID} = req.session;
  const templateVars = {user: undefined};

  if (userID) {
    return databaseFn.getUserWithId(userID)
    .then(dbUser => {
      console.log(`returned user from Id:`, dbUser);
      templateVars.user = dbUser;
      console.log('logged in successfully as: ', dbUser.name)

      /*
      implement route logic here
      */

      return res.render('new_listing', templateVars);
    })
    .catch(e => {
      console.log(e);
      res.send(e);
    })
  }
  // end of req. logged in path block

  // Checks if user is logged in
  if (!userID) {
    res.statusCode = 404;
    return res.send("Please Log in to create new listing.");
  }

  res.render("new_listing", templateVars);
});


// POST - Take input from create listings page and input data into Obj
app.post('/listings', (req, res) => {

  // req. logged in path block
  const {userID} = req.session;

  if (userID) {
    return databaseFn.getUserWithId(userID)
    .then(dbUser => {
      console.log(`returned user from Id:`, dbUser);
      console.log('logged in successfully as: ', dbUser.name)

      // tommy's route logic
      const ownerId = dbUser.id;

      const listing = {};
      listing.title = req.body.name;
      listing.description = req.body.description;
      listing.price = req.body.price;
      listing.owner_id = ownerId;

      return databaseFn.addNewListing(listing);
    })
    .then(result => {

      return res.redirect('listings');
    })
    .catch(e => {
      console.log(e);
      res.send(e);
    })
  }
  // end of req. logged in path block


  res.redirect(`/listings`)
  // res.redirect(`/listings/${id}`)
})

// GET - View all listings IF you are the owner
app.get('/listings', (req, res) => {

  // req. logged in path block
  const {userID} = req.session;
  const templateVars = {user: undefined};

  if (userID) {
    return databaseFn.getUserWithId(userID)
    .then(dbUser => {
      console.log(`returned user from Id:`, dbUser);
      templateVars.user = dbUser;
      console.log('logged in successfully as: ', dbUser.name)

      let filteredDatabase = {}
      for(let keys in listings) {
        let value = listings[keys]

        if(value.owner_id === dbUser.id || value.userID === null) { // -> should filter the url from the users Id
          filteredDatabase[keys] = value;
        }
  }
      return databaseFn.getListingsByOwnerId(dbUser.id)
    })
    .then(listings => {
      console.log(`return value of promise/result.rows:`, listings);
      // console.log('filtered db:', filteredDatabase)
      templateVars['listings'] = {};
      for (let listing of listings) {

        templateVars.listings[listing.id] = {
          name: listing.name,
          description: listing.description,
          price: listing.price,
          is_sold: listing.is_sold,
          owner_id: listing.owner_id,
          owner_name: listing.owner_name,
          is_removed: listing.is_removed,
          id: listing.id
        }

      }
      console.log(`formatted return listings for ejs view:`, templateVars.listings);
      return res.render('listings', templateVars);
    })
    .catch(e => {
      console.log(e);
      res.send(e);
    })
  }
  // end of req. logged in path block

  // Checks if user is logged in
  if (!userID) {
    res.statusCode = 404;
    return res.send("Please Log in to create new listing.");
  }

  // let filteredDatabase = {}
  // for(let keys in listings) {
  //   let value = listings[keys]
  //   if(value.owner_id === users[userID].id || value.userID === null) { // -> should filter the url from the users Id
  //     filteredDatabase[keys] = value;
  //   }
  // }


  // res.render('listings', templateVars)
})

// GET - Show individual listings
app.get('/listings/:id', (req, res) => {

  const id = req.params.id;

  /* db users query/navbar req. logic */
  const {userID} = req.session;
  const templateVars = {user: undefined};
  if (userID) {
    return databaseFn.getUserWithId(userID)
    .then(dbUser => {
      console.log(`returned user from Id:`, dbUser);
      templateVars.user = dbUser;
      console.log('logged in successfully as: ', dbUser.name)

      // route logic here
      return databaseFn.getListingWithId(id);
    })
    .then(listing => {
        templateVars.title = listing.title;
        templateVars.price = listing.price;
        templateVars.description = listing.description;
        templateVars.listing_id = listing.listing_id;
        templateVars.owner_name = listing.owner_name;
      // end of route logic

      return res.render('single_listing', templateVars);
    })
    .catch(e => {
      console.log(e);
      res.send(e);
    })
  }
  /* end of required block */

  if (!userID) {
    res.redirect('/');
  }
})

// GET - View favorites page
app.get('/favorites', (req, res) => {

  const {userID} = req.session;
  const templateVars = {user: undefined};
  if (userID) {
    return databaseFn.getUserWithId(userID)
    .then(dbUser => {
      console.log(`returned user from Id:`, dbUser);
      templateVars.user = dbUser;

      // route logic here

      console.log('logged in successfully as: ', dbUser.name)
      return res.render('favorites', templateVars);
    })
    .catch(e => {
      console.log(e);
      res.send(e);
    })
  }
  /* end of required block */

  res.render('index', templateVars);
});

app.post('/favorites', (req, res) => {

  // req. logged in path block
  const {userID} = req.session;

  if (userID) {
    return databaseFn.addFavorite({user_id: req.body.user_id, listing_id: req.body.listing_id})
    .then(response => {
      console.log(`added`, response, ` to favorites`);
      return console.log('favorite added successfully!');
    })
    .catch(e => {
      console.log(e);
      res.send(e);
    })
  }
  // end of req. logged in path block

  // Checks if user is logged in
  if (!userID) {
    res.statusCode = 404;
    return res.send("Please Log in to create new listing.");
  }
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
