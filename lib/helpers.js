// load .env data into process.env
require('dotenv').config();

/*
* Helper functions
*/

// Create an empty user objects will all need properties.
const generateEmptyUser = () => {
  const emptyUser = {id: '', name: '', phone_number: '', email: '', admin: ''};
  return emptyUser;
};

// Generate a price list (id, price) FROM a DB Query
const getPriceList = function(db) {

  let priceListQuery = `SELECT id, price FROM foods`;

  return db.query(priceListQuery)
    .then(data => data.rows)
    .catch(err => err);
};

// Takes a userId and returns the: id, names, phone_number, email and admin status, or an empty object.
const getUserInfo = function(userId, db) {
  return new Promise((resolve, reject) => {
    if (userId) {

      const userInfoQuery = {
        text: `SELECT id, name, phone_number, email, picture_url, admin FROM users WHERE id = $1`,
        values: [userId],
      };

      return db.query(userInfoQuery)
        .then(data => resolve(data.rows[0]))
        .catch(err => reject(err));
    } else {
      const user = generateEmptyUser();
      return resolve(user);
    }
  });
};

// Returns a phone number, based on userID
// (Faking most of it, for privacy reasons and demo)
const getPhoneNumber = (userId, db) => {

  // Prepared for official integration to DB
  const phoneNumberQuery = {
    text: `SELECT phone_number FROM users WHERE id = $1`,
    values: [userId],
  };

  switch (userId) {
  case 1:
    return process.env.PHONE_OWNER;
  case 2:
    return process.env.PHONE_SEB;
  case 3:
    return process.env.PHONE_JESS;
  case 4:
    return process.env.PHONE_ROB;
  default:
    return process.env.PHONE_OWNER;
  }
};

// Extracts the food informations from an order object
const extractFoodObj = order => {
  if (order) {
    const {food_id, food_name, food_qty, picture_url} = order;
    const food = {food_id, food_name, food_qty, picture_url};
    return food;
  }
  return {};
};

// Extracts the customer informations from an order object
const extractCustomerObj = order => {
  if (order) {
    const {user_id, customer_name, email, phone_number} = order;
    const customer = {user_id, customer_name, email, phone_number};
    return customer;
  }
  return {};
};

// In an "array of order objects", returns index of corresponding object, based on orderId
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

    if (currentIndex === undefined) {
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

// Generates query string from a given cart object
const generateQueryFromCart = (orderId, cartArray) => {
  const values = [];
  values.push(orderId);
  let text = 'INSERT INTO food_orders (order_id, food_id) VALUES';
  let variablePosition = 2;
  for (let i = 0; i < cartArray.length; i++) {
    for (let j = 0; j < cartArray[i].qty; j++) {
      text += ` ($1, $${variablePosition}),`;
      values.push(cartArray[i].id);
      variablePosition++;
    }
  }
  text = text.slice(0,-1);

  const queryObject = {text, values};
  return queryObject;
};

module.exports = {
  extractCustomerObj,
  extractFoodObj,
  findOrderIndex,
  generateEmptyUser,
  generateQueryFromCart,
  getPhoneNumber,
  getPriceList,
  getUserInfo,
  refactorOrder
};
