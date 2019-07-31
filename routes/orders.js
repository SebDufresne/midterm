/*
 * All routes for Orders are defined here
 * Since this file is loaded in server.js into /orders,
 *   these routes are mounted onto /orders
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();


const { sendSMS } = require('../public/scripts/sms');

const { getUserInfo, getPhoneNumber, refactorOrder } = require('../lib/helpers');

module.exports = (db, iconsKey) => {
  router.get("/", (req, res) => {
    const userId = req.session.userId || '';

    if (userId) {
      getUserInfo(userId, db)
        .then(userInfo => {

          if (!userInfo.admin) {

            const getOrdersQuery = {
              text: `SELECT * FROM order_summary WHERE user_id = $1`,
              values: [userId],
            };

            db.query(getOrdersQuery)
              .then(data => {
                const orderData = data.rows;

                const structuredOrders = refactorOrder(orderData);

                const user = userInfo;
                const params = {user, structuredOrders, iconsKey};

                console.log(structuredOrders);
                res.render("orders", params);
              })
              .catch(err => {
                res
                  .status(500)
                  .json({ error: err.message });
              });
          } else {
            const user = userInfo;
            const params = {user, iconsKey};
            res.render("404", params);
          }
        })
        .catch(err => {
          res
            .status(500)
            .json({ error: err.message });
        });
    } else {
      res.redirect('/');
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

        const ownerId = 1; // Seb: Just did it like that for the moment
        sendSMS(getPhoneNumber(ownerId), `A new 🌭 order has been placed.`);
        const params = {user, cart, iconsKey};
        req.session.cart = null; // Empty Cart Cookie
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
