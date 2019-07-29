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

// Given an order object, returns a food object
const extractFoodObj = order => {
  if (order) {
    const {food_id, food_name, food_qty, picture_url} = order;
    const food = {food_id, food_name, food_qty, picture_url};
    return food;
  }
  return {};
};

// Returns the index of the array of objects OR undefindedF2 - In an "object array", returns index of corresponding food item
const findOrderIndex = (orderId, ordersArray) => {
  const indexFound = ordersArray.findIndex((e) => {
    return orderId === parseInt(e.order_id);
  });
  return indexFound >= 0 ? indexFound : undefined;
};

// F1 - Takes an order from DB and restructure it in a nicer way


module.exports = {
  extractFoodObj,
  findOrderIndex,
  getUserInfo
};
