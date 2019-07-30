// load .env data into process.env
require('dotenv').config();

/*
* Helper functions
*/

// Takes a userId and returns the: id, name, phone_number, email and admin status
const getUserInfo = function(userId, db) {
  let queryUsers = `SELECT id, name, phone_number, email, admin FROM users WHERE id = '${userId}'`;
  console.log(queryUsers);
  return db.query(queryUsers)
    .then(data => data.rows[0])
    .catch(err => err);
};

// Returns a phone number, based on userID (FAKING IT)
const getPhoneNumber = (userId, db) => {
  let phoneNumber;
  switch (userId) {
  case 2:
    phoneNumber = process.env.PHONE_SEB;
    break;
  case 3:
    phoneNumber = process.env.PHONE_JESS;
    break;
  case 4:
    phoneNumber = process.env.PHONE_ROB;
    break;
  default:
    phoneNumber = +15555555555;
  }
  return phoneNumber;
};

// Given an order object, returns a food object
const extractFoodObj = order => {
  if (order) {
    const {food_id, food_name, food_qty, picture_url} = order;
    const food = {food_id, food_name, food_qty, picture_url};
    return food;
  }
  return {};
};

const extractCustomerObj = order => {
  if (order) {
    const {customer_name, email, phone_number} = order;
    const customer = {customer_name, email, phone_number};
    return customer;
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
  extractCustomerObj,
  extractFoodObj,
  findOrderIndex,
  getPhoneNumber,
  getUserInfo
};
