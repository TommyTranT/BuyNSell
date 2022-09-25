// bring in DB connection/credentials
const db = require('./connect.js');
/* db code below  */

// const dbParams = {
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME
// };

// const db = new Pool(dbParams);

// db.connect();

// module.exports = db;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const registerNewUser = function(user) {
  return db
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
