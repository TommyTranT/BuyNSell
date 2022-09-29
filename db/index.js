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
      SELECT listings.*, listings.id as listing_id, users.name as owner_name, users.id as owner_id, time_created
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
      SELECT listings.id, title AS name, description, price, is_sold, is_removed, owner_id, users.name AS owner_name, time_created
      FROM listings
      JOIN users ON owner_id = users.id
      WHERE owner_id = $1 AND is_removed = false;
      `, [id]
    )
    .then((result) => {
      if (result.rows) {
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
      SELECT listings.id, title AS name, description, price, is_sold, is_removed, owner_id, users.name AS owner_name, time_created
      FROM listings
      JOIN users ON owner_id = users.id
      WHERE is_removed = false
      ORDER BY listings.id DESC
      LIMIT $1;
      `, [limit]
    )
    .then((result) => {
      if (result.rows) {
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
      SELECT listing_id, users.name as sender_name, listings.owner_id as owner_id, listings.title as listing_title, contents
      FROM messages
      JOIN users on users.id = sender_id
      JOIN listings on listings.id = listing_id
      WHERE sender_id = $1
      OR recipient_id = $1
      GROUP BY listings.id, users.name, listings.owner_id, messages.contents, messages.id
      ORDER BY messages.id;
      `, [id]
    )
    .then((result) => {
      if (result.rows) {
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


/**
 * Get all favorites for a given user id
 * @param {Number} id
 * @return {Promise<{}>} A promise to the user.
**/
const getFavoritesByOwnerID = function(id) {
  console.log(`called getFavoritesByOwnerID`);
  return pool
    .query(`
      SELECT listings.id, title AS name, description, price, is_sold, is_removed, owner_id, time_created
      FROM listings
      JOIN favorites ON favorites.listing_id = listings.id
      JOIN users ON favorites.user_id = users.id
      WHERE users.id = $1
      GROUP BY listings.id, users.name
      ORDER BY listings.id DESC;
      `, [id]
    )
    .then((result) => {
      if (result.rows) {
        return Promise.resolve(result.rows);
      } else {
        return null;
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
}
exports.getFavoritesByOwnerID = getFavoritesByOwnerID;


/**
 * Update a specific listing with new information
 * @param {{id: integer, title: string, description: string, price: integer}} updatedListing
 * @return {Promise<{}>} A promise to the user.
**/
const updateListing = function(updatedListing) {
  console.log(`called getFavoritesByOwnerID`);
  return pool
    .query(`
      UPDATE listings
      SET title = $1, description = $2, price = $3
      WHERE listings.id = $4
      RETURNING *;
      `, [updatedListing.title, updatedListing.description, updatedListing.price, updatedListing.id]
    )
    .then((result) => {
      if (result.rows) {
        return Promise.resolve(result.rows);
      } else {
        return null;
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
}
exports.updateListing = updateListing;


/**
 * Updates a listing to indicate removal
 * @param {Number} id
 * @param {Boolean} isRemoved
 * @return {Promise<{}>} A promise to the user.
**/
const changeListingRemovalStatus = function(id, isRemoved) {
  console.log(`called changeListingRemovalStatus`);
  return pool
    .query(`
      UPDATE listings
      SET is_removed = $2
      WHERE listings.id = $1
      RETURNING *;
      `, [id, isRemoved]
    )
    .then((result) => {
      if (result.rows) {
        return Promise.resolve(result.rows);
      } else {
        return null;
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
}
exports.changeListingRemovalStatus = changeListingRemovalStatus;


/**
 * Updates a listing to indicate sold status
 * @param {Number} id
 * @param {Boolean} isSold
 * @return {Promise<{}>} A promise to the user.
**/
const changeListingSoldStatus = function(id, isSold) {
  console.log(`called changeListingSoldStatus`);
  return pool
    .query(`
      UPDATE listings
      SET is_sold = $2
      WHERE listings.id = $1
      RETURNING *;
      `, [id, isSold]
    )
    .then((result) => {
      if (result.rows) {
        return Promise.resolve(result.rows);
      } else {
        return null;
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
}
exports.changeListingSoldStatus = changeListingSoldStatus;


/**
 * Add a new message to the database.
 * @param {{sender_id: integer, recipient_id: integer, contents: string, listing_id: integer }} message
 * @return {Promise<{}>} A promise to the user.
**/
const addMessage = function(message) {
  console.log(`addMessage fn called...`);
  return pool
    .query(`
      INSERT INTO messages (sender_id, recipient_id, contents, listing_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `, [message.sender_id, message.recipient_id, message.contents, message.listing_id]
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
exports.addMessage = addMessage;


/**
 * Get all listings from the db with limit option
 * @param {Number} limit
 * @param {{minPrice: integer, maxPrice: integer}} filters
 * @return {Promise<{}>} A promise to the user.
**/
const getFilteredListings = function(limit, filters) {
  console.log(`called getFilteredListings`);
  return pool
    .query(`
      SELECT listings.id, title AS name, description, price, is_sold, is_removed, owner_id, users.name AS owner_name, time_created
      FROM listings
      JOIN users ON owner_id = users.id
      WHERE is_removed = false AND price >= $2 AND price <= $3
      ORDER BY listings.id DESC
      LIMIT $1;
      `, [limit, filters.minPrice, filters.maxPrice]
    )
    .then((result) => {
      if (result.rows) {
        return Promise.resolve(result.rows);
      } else {
        return null;
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
}
exports.getFilteredListings = getFilteredListings;
