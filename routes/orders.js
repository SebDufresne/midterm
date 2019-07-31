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
            const queryOrders = `SELECT * FROM order_summary WHERE user_id = ${userId}`;
            db.query(queryOrders)
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
        let totalCost = 0;

        for (let item of cart) {
          let numItem = item.price * item.qty;
          totalCost += numItem;
        }

        const insertOrders = {
          text: 'INSERT INTO orders (user_id, total_cost) VALUES ($1, $2) RETURNING id',
          values: [userId, totalCost],
        }

        console.log(">>>insertOrders<<<", insertOrders);

        db.query(insertOrders)
        .then(data => {
          orderId = data.rows[0].id;

          for (let item of cart) {
            const {id, name, price, qty} = item;

            for (let i = 0; i < qty; i++) {
              const insertFoodOrders = {
                text: 'INSERT INTO food_orders (order_id, food_id) VALUES ($1, $2)',
                values: [orderId, item.id],
              }
              console.log(">>>>>>>>>insertFoodOrders<<<<<<<<<", insertFoodOrders);
            }
          }

          const ownerId = 3;
          sendSMS(getPhoneNumber(ownerId), `A new 🌭 order has been placed. The order number is ${orderId}.`);

          req.session.cart = null;
          const params = {user, cart, iconsKey};
          res.redirect('/orders/:id');

        })
        .catch(err => {
          res
            .status(500)
            .json({ error: err.message });
        });

      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get("/:id", (req, res) => {
    const userId = req.session.userId || '';

    if (userId) {
      const user = userInfo;
      const params = {user, iconsKey};
      res.render("/", params);
    }

    if (!userId) {
      res.redirect('/login');
    }

  });

  return router;

};
