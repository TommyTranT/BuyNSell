const { Pool } = require('pg');

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
 */
const registerNewUser = function(user) {
  console.log('fn called'); // tester REMOVE
  return pool
    .query(`
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING *
      `, [user.name, user.email, user.password]
    )
    .then((result) => {
      if (result.rows[0]) {
        console.log(`this is result rows`, result.rows); // tester remove
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
