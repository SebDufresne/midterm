/*
* Helper functions
*/

// Takes a userId and returns the: id, name, phone_number, email and admin status
const getUserInfo = function(db, userId) {
  let queryUsers = `SELECT id, name, phone_number, email, admin FROM users WHERE id = '${userId}'`;
  console.log(queryUsers);
  return db.query(queryUsers)
    .then(data => data.rows[0])
    .catch(err => err);
};

module.exports = {
  getUserInfo
};
