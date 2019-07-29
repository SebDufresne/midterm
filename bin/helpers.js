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

/*
* Order Object PartialMockup:
* [
*  {order_id: 1, ..., food_list: [], ...},
*  {order_id: 2, ..., food_list: [], ...},
*  {order_id: 3, ..., food_list: [], ...},
* ]
*/

// F1 - Takes an order from DB and restructure it in a nicer way

// F2 - In an "object array", returns index of corresponding food item

// F3 - Create food item object from food Order Object


// Just for test chai & Mocha installation (TO BE REMOVED)
const aTest = () => {
  return 'aTest';
};

module.exports = {
  aTest,
  getUserInfo
};
