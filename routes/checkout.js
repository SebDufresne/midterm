/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const { sendSMS } = require('../public/scripts/sms');

const { getUserInfo, getPhoneNumber } = require('../lib/helpers');

module.exports = (db, iconsKey) => {
  router.get("/", (req, res) => {
    const userId = req.session.userId || '';

    const cartContentStr = req.session.cart;

    let cartContentObj;
    if (cartContentStr) {
      cartContentObj = JSON.parse(cartContentStr);
    } else {
      cartContentObj = {};
    }

    // Selected food items, based on their IDs
    const gatheredIds = Object.keys(cartContentObj).join(', ');

    // Query based on the user's selected food items
    const queryFoods = `SELECT id, name, price, picture_url FROM foods WHERE id IN (${gatheredIds})`;

    // Empty cart
    const emptyCart = Object.keys(cartContentObj).length === 0;

    // User is not logged in
    if (!userId) {
      const user = {};
      user.id = '';
      res.redirect('/login');

      // User is logged in. Cart is empty.
    } else if (userId && emptyCart) {
      getUserInfo(userId, db)
        .then(usersData => {
          const user = usersData; // Implies there's ONLY one
          const params = {user, cart:[], iconsKey};
          res.render("checkout", params);
        })
        .catch(err => {
          res
            .status(500)
            .json({ error: err.message });
        });
    }

    // User is logged in. Food items were selected.
    if (userId && !emptyCart) {
      db.query(queryFoods)
        .then(foodData => {
          const foods = foodData.rows;
          const cart = [];

          for (const foodItem of foods) {
            const id = foodItem.id;
            const name = foodItem.name;
            const price = foodItem.price;
            const qty = cartContentObj[foodItem.id];

            const eachFood = {id, name, price, qty};
            cart.push(eachFood);
          }

          getUserInfo(userId, db)
            .then(usersData => {
              const user = usersData; // Implies there's ONLY one
              const params = {user, cart, iconsKey};
              res.render("checkout", params);
            });
          })
          .catch(err => {
            res
              .status(500)
              .json({ error: err.message });
          });
    }
  });


  router.post("/", (req, res) => {
    const userId = req.session.userId || '';
    const processedOrder = req.body.cart;
    const cart = JSON.parse(processedOrder);

    getUserInfo(userId, db)
      .then(usersData => {
        const user = usersData;

        // Timestamp
        const orderedTime = new Date();
        const orderedTimeReformat = `${orderedTime.getFullYear()}-${(orderedTime.getMonth() + 1)}-${orderedTime.getDate()} ${orderedTime.getHours()}:${orderedTime.getMinutes()}:${orderedTime.getSeconds()}`;

        const insertOrders = (`INSERT INTO orders (user_id, ordered_at, status) VALUES ($1, $2, $3) RETURNING *;`,
        [userId, orderedTimeReformat, 'new']);

        console.log("insertOrders:", insertOrders);

        for (let item of cart) {
          // name = item.name;

          const {id, name, price, qty} = item;
          console.log('name in for of:', name);
          console.log('id in for of:', id);

          for (let i = 0; i < qty; i++) {
            const insertFoods = (`INSERT INTO foods (name, price) VALUES ($1, $2);`,
            [name, price]);
            console.log("insertFoods in for of:", insertFoods);
          }

          const queryFoodOrders = function(id) {
            return pool.query(`
            SELECT id, orders.id as order_id, foods.id as food_id
            FROM food_orders
            JOIN orders ON orders.id = order_id
            JOIN foods ON foods.id = food_id
            GROUP BY orders.name
            ORDER BY foods.id;
            `, [id])
            .then(res => res.rows[0]);
          }
          exports.queryFoodOrders = queryFoodOrders;


        }

        sendSMS(getPhoneNumber(userId), `A new 🌭 order has been placed.`);
        const params = {user, cart, iconsKey};
        res.redirect('/orders:id');

      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
