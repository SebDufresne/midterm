const assert = require('chai').assert;
const extractCustomerObj = require('../lib/helpers').extractCustomerObj;
const extractFoodObj = require('../lib/helpers').extractFoodObj;
const findOrderIndex = require('../lib/helpers').findOrderIndex;

const orderData = [
  {
    order_id: 1,
    ordered_at: "2019-07-26T10:02:20.000Z",
    order_status: "new",
    customer_comments: null,
    food_id: "3",
    food_name: "Yogi Bear",
    food_qty: "1",
    picture_url: "src/images/foods/dog_yogi.jpg",
    customer_name: "jess",
    email: "jess@test.com",
    phone_number: "514-555-5555"
  },
  {
    order_id: 1,
    ordered_at: "2019-07-26T10:02:20.000Z",
    order_status: "new",
    customer_comments: null,
    food_id: "3",
    food_name: "Harlo",
    food_qty: "3",
    picture_url: "src/images/foods/dog_harlo.jpg",
    customer_name: "jess",
    email: "jess@test.com",
    phone_number: "514-555-5555"
  },
  {
    order_id: 2,
    ordered_at: "2019-07-26T10:01:20.000Z",
    order_status: "new",
    customer_comments: null,
    food_id: "1",
    food_name: "Tubby Dog",
    food_qty: "1",
    picture_url: "src/images/foods/dog_tubbydog.jpg",
    customer_name: "robin",
    email: "robin@test.com",
    phone_number: "514-555-5555"
  }
];

describe('#extractCustomerObj', function() {
  it(`Expect an empty object when submitted an empty value`, function() {
    const input = '';
    const output = {};
    assert.deepEqual(extractCustomerObj(input),output);
  });
});

describe('#extractCustomerObj', function() {
  it(`Expect a customer object when passed an order`, function() {
    const input =   {
      order_id: 2,
      ordered_at: "2019-07-26T10:01:20.000Z",
      order_status: "new",
      customer_comments: null,
      food_id: "1",
      food_name: "Tubby Dog",
      food_qty: "1",
      picture_url: "src/images/foods/dog_tubbydog.jpg",
      customer_name: "robin",
      email: "robin@test.com",
      phone_number: "514-555-5555"
    };
    const output =   {
      customer_name: "robin",
      email: "robin@test.com",
      phone_number: "514-555-5555"
    };
    assert.deepEqual(extractCustomerObj(input),output);
  });
});

describe('#extractFoodObj', function() {
  it(`Expect an empty object when submitted an empty value`, function() {
    const input = '';
    const output = {};
    assert.deepEqual(extractFoodObj(input),output);
  });
});

describe('#extractFoodObj', function() {
  it(`Expect a food object when passed an order`, function() {
    const input =   {
      order_id: 2,
      ordered_at: "2019-07-26T10:01:20.000Z",
      order_status: "new",
      customer_comments: null,
      food_id: "1",
      food_name: "Tubby Dog",
      food_qty: "1",
      picture_url: "src/images/foods/dog_tubbydog.jpg",
      customer_name: "robin",
      email: "robin@test.com",
      phone_number: "514-555-5555"
    };
    const output =   {
      food_id: "1",
      food_name: "Tubby Dog",
      food_qty: "1",
      picture_url: "src/images/foods/dog_tubbydog.jpg"
    };
    assert.deepEqual(extractFoodObj(input),output);
  });
});

describe('#findOrderIndex', function() {
  it(`return undefined if order isn't found`, function() {
    const orderId = 4;
    const ordersArray = [
      {order_id: 1, ordered_at: "2019-07-26T10:01:20.000Z"},
      {order_id: 2, ordered_at: "2019-07-26T10:01:20.000Z"},
      {order_id: 3, ordered_at: "2019-07-26T10:01:20.000Z"},
    ];
    const output = undefined;
    assert.strictEqual(findOrderIndex(orderId,ordersArray),output);
  });
});

describe('#findOrderIndex', function() {
  it(`return index of order in array if found`, function() {
    const orderId = 2;
    const ordersArray = [
      {order_id: 1, ordered_at: "2019-07-26T10:01:20.000Z"},
      {order_id: 2, ordered_at: "2019-07-26T10:01:20.000Z"},
      {order_id: 3, ordered_at: "2019-07-26T10:01:20.000Z"},
    ];
    const output = 1;
    assert.strictEqual(findOrderIndex(orderId,ordersArray),output);
  });
});
