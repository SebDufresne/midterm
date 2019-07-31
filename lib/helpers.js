// load .env data into process.env
require('dotenv').config();

/*
* Helper functions
*/

const generateEmptyUser = () => {
  const emptyUser = {id: '', name: '', phone_number: '', email: '', admin: ''};
  return emptyUser;
};

// Generate a price list (id, price)
const getPriceList = function(db) {
  let queryUsers = `SELECT id, price FROM foods`;
  return db.query(queryUsers)
    .then(data => data.rows)
    .catch(err => err);
};

// Takes a userId and returns the: id, name, phone_number, email and admin status, or an empty object
const getUserInfo = function(userId, db) {
  return new Promise((resolve, reject) => {
    if (userId) {
      const queryUsers = `SELECT id, name, phone_number, email, admin FROM users WHERE id = '${userId}'`;
      return db.query(queryUsers)
        .then(data => resolve(data.rows[0]))
        .catch(err => reject(err));
    } else {
      const user = generateEmptyUser();
      return resolve(user);
    }
  });
};

// Returns a phone number, based on userID
// (FAKING IT, for privacy reasons and demo)
const getPhoneNumber = (userId, db) => {
  let phoneNumber;
  switch (userId) {
  case 1:
    phoneNumber = process.env.PHONE_OWNER;
    break;
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
    const {user_id, customer_name, email, phone_number} = order;
    const customer = {user_id, customer_name, email, phone_number};
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

// Takes a list of orders from the DB and returns a list of structured objects, of this kind:
/*
[
  {
    order_id: 1,
    ordered_at: "2019-07-26T10:02:20.000Z",
    order_status: "new",
    customer_comments: null,
    total_cost: 1799,
    foods: [{
      food_id: 3,
      food_name: "Yogi Bear",
      food_qty: "1",
      picture_url: "src/images/foods/dog_yogi.jpg",
    },{
      food_id: 4,
      food_name: "Harlo",
      food_qty: "3",
      picture_url: "src/images/foods/dog_harlo.jpg",
    }],
    user: {
      user_id: 7,
      customer_name: "jess",
      email: "jess@test.com",
      phone_number: "514-555-5555"
    }
  }
]
*/
const refactorOrder = ordersArray => {
  const structuredOrder = [];
  for (const order of ordersArray) {
    const currentIndex = findOrderIndex(order.order_id, structuredOrder);

    if (currentIndex === undefined) { // If there's no index with that order
      const order_id = order.order_id;
      const ordered_at = order.ordered_at;
      const order_status = order.order_status;
      const customer_comments = order.customer_comments;
      const total_cost = order.total_cost;

      const foodObject = extractFoodObj(order);
      const foods = [foodObject];

      const user = extractCustomerObj(order);

      const newOrder = {order_id, ordered_at, order_status, customer_comments, total_cost, foods, user};

      structuredOrder.push(newOrder);
    } else {
      const foodObject = extractFoodObj(order);
      structuredOrder[currentIndex].foods.push(foodObject);
    }
  }

  return structuredOrder;
};

module.exports = {
  extractCustomerObj,
  extractFoodObj,
  findOrderIndex,
  generateEmptyUser,
  getPhoneNumber,
  getPriceList,
  getUserInfo,
  refactorOrder
};
