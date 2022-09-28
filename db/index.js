const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
**/
const registerNewUser = function(user) {
  return pool
    .query(`
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING *
      `, [user.name, user.email, user.password]
    )
    .then((result) => {
      if (result.rows[0]) {
        return Promise.resolve(result.rows[0]);
      } else {
        return null;
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
}
exports.registerNewUser = registerNewUser;

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
**/
const getUserWithEmail = function(email) {
  console.log(`fn getuserwithemail called`); // tester delete
  return pool
    .query(`
      SELECT *
      FROM users
      WHERE email = $1;
      `, [email]
    )
    .then((result) => {
      console.log(`fn getuserwithemail resolved, got result`, result.rows[0]); // tester delete
      if (result.rows[0]) {
        return Promise.resolve(result.rows[0]);
      } else {
        return null;
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
}
exports.getUserWithEmail = getUserWithEmail;


/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
**/
 const getUserWithId = function(id) {
  console.log(`called getUserWithId`);
  return pool
    .query(`
      SELECT *
      FROM users
      WHERE id = $1;
      `, [id]
    )
    .then((result) => {
      if (result.rows[0]) {
        return Promise.resolve(result.rows[0]);
      } else {
        return null;
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
}
exports.getUserWithId = getUserWithId;


/**
 * Check if a user exists with a given username and password
 * @param {String} email
 * @param {String} password encrypted
**/
const login = function(email, password) {
  console.log(`fn login called`);
  return getUserWithEmail(email)
  .then(user => {
    if (user) {
      console.log(`login resolved, user retrieved:`, user);
      if (bcrypt.compareSync(password, user.password)) {
        console.log(`password matches`);
        return Promise.resolve(user);
      }
    }
    console.log(`password doesn't match/user doesn't exist`);
    return null;
    });
}
exports.login = login;


/**
 * Get a single listing from the db given its id
 * @param {Number} id
 * @return {Promise<{}>} A promise to the user.
**/
const getListingWithId = function(id) {
  console.log(`called getListingWithId`);
  return pool
    .query(`
      SELECT listings.*, listings.id as listing_id, users.name as owner_name
      FROM listings
      JOIN users ON owner_id = users.id
      WHERE listings.id = $1;
      `, [id]
    )
    .then((result) => {
      if (result.rows[0]) {
        return Promise.resolve(result.rows[0]);
      } else {
        return null;
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
}
exports.getListingWithId = getListingWithId;


/**
 * Get all owned listings from the db given their owner's id
 * @param {Number} id
 * @return {Promise<{}>} A promise to the user.
**/
const getListingsByOwnerId = function(id) {
  console.log(`called getListingsByOwnerId`);
  return pool
    .query(`
      SELECT listings.id, title AS name, description, price, is_sold, is_removed, owner_id, users.name AS owner_name
      FROM listings
      JOIN users ON owner_id = users.id
      WHERE owner_id = $1;
      `, [id]
    )
    .then((result) => {
      if (result.rows) {
        console.log(`result rows:`, result.rows);
        return Promise.resolve(result.rows);
      } else {
        return null;
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
}
exports.getListingsByOwnerId = getListingsByOwnerId;


/**
 * Add a new listing to the database.
 * @param {{title: string, description: string, price: integer, owner_id: integer}} listing
 * @return {Promise<{}>} A promise to the user.
**/
const addNewListing = function(listing) {
  return pool
    .query(`
      INSERT INTO listings (title, description, price, owner_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `, [listing.title, listing.description, listing.price, listing.owner_id]
    )
    .then((result) => {
      if (result.rows[0]) {
        return Promise.resolve(result.rows[0]);
      } else {
        return null;
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
}
exports.addNewListing = addNewListing;


/**
 * Get all listings from the db with limit option
 * @param {Number} limit
 * @return {Promise<{}>} A promise to the user.
**/
const getLimitListings = function(limit) {
  console.log(`called getLimitListings`);
  return pool
    .query(`
      SELECT listings.id, title AS name, description, price, is_sold, is_removed, owner_id, users.name AS owner_name
      FROM listings
      JOIN users ON owner_id = users.id
      ORDER BY listings.id DESC
      LIMIT $1;
      `, [limit]
    )
    .then((result) => {
      if (result.rows) {
        console.log(`result rows:`, result.rows);
        return Promise.resolve(result.rows);
      } else {
        return null;
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
}
exports.getLimitListings = getLimitListings;


/**
 * Add a new favorite to the database.
 * @param {{user_id: integer, listing_id: integer}} favorite
 * @return {Promise<{}>} A promise to the user.
**/
const addFavorite = function(favorite) {
  console.log(`addFavorite fn called...`);
  return pool
    .query(`
      INSERT INTO favorites (user_id, listing_id)
      VALUES ($1, $2)
      RETURNING *
      `, [favorite.user_id, favorite.listing_id]
    )
    .then((result) => {
      if (result.rows[0]) {
        return Promise.resolve(result.rows[0]);
      } else {
        return null;
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
}
exports.addFavorite = addFavorite;

/**
 * Get all messages from the db given user id (logged in)
 * @param {Number} id
 * @return {Promise<{}>} A promise to the user.
**/
const getMessages = function(id) {
  return pool
    .query(`
      SELECT users.name as sender_name, listings.title as listing_title, contents
      FROM messages
      JOIN users on users.id = sender_id
      JOIN listings on listings.id = listing_id
      WHERE sender_id = $1
      OR recipient_id = $1
      ORDER BY messages.id
      `, [id]
    )
    .then((result) => {
      console.log(result);
      if (result.rows) {
        console.log("messages: ", result.rows)
        return Promise.resolve(result.rows);
      } else {
        console.log("no messages!")
        return null;
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
}
exports.getMessages = getMessages;
