/*
 * All routes for Orders are defined here
 * Since this file is loaded in server.js into /orders,
 *   these routes are mounted onto /orders
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();

// Allows time manipulation
const moment = require('moment-timezone');

const { sendSMS } = require("../public/scripts/sms");

const {
  generateEmptyUser,
  getUserInfo,
  getPhoneNumber,
  refactorOrder
} = require("../lib/helpers");

module.exports = (db, iconsKey) => {
  router.get("/", (req, res) => {
    const userId = req.session.userId || "";

    if (userId) {
      getUserInfo(userId, db)
        .then(userInfo => {
          if (!userInfo.admin) {
            const getOrdersQuery = {
              text: `SELECT * FROM order_summary WHERE user_id = $1`,
              values: [userId]
            };

            db.query(getOrdersQuery)
              .then(data => {
                const currentOrder = data.rows;

                const structuredOrders = refactorOrder(currentOrder);

                const user = userInfo;
                const params = { user, structuredOrders, iconsKey };

                console.log(structuredOrders);
                res.render("orders", params);
              })
              .catch(err => {
                res.status(500).json({ error: err.message });
              });
          } else {
            const user = userInfo;
            const params = { user, iconsKey };
            res.render("404", params);
          }
        })
        .catch(err => {
          res.status(500).json({ error: err.message });
        });
    } else {
      res.redirect("/");
    }
  });

  router.post("/", (req, res) => {
    const userId = req.session.userId || '';
    const processedOrder = req.body.cart;
    if (userId && processedOrder) {
      const cart = JSON.parse(processedOrder);
      let totalCost = 0;

      for (let item of cart) {
        let numItem = item.price * item.qty;
        totalCost += numItem;
      }

      const insertOrders = {
        text:
          "INSERT INTO orders (user_id, total_cost) VALUES ($1, $2) RETURNING id",
        values: [userId, totalCost]
      };

      db.query(insertOrders)
        .then(data => {
          const orderId = data.rows[0].id;

          for (let item of cart) {
            const qty = item.qty;
            for (let i = 0; i < qty; i++) {
              const insertFoodOrders = {
                text: "INSERT INTO food_orders (order_id, food_id) VALUES ($1, $2)",
                values: [orderId, item.id]
              };

              db.query(insertFoodOrders);
            }
          }

          const ownerId = 3;
          sendSMS(
            getPhoneNumber(ownerId),
            `A new 🌭 order has been placed. The order number is ${orderId}.`
          );

          req.session.cart = null;

          res.redirect(`/orders/${orderId}`);
        })
        .catch(err => {
          res.status(500).json({ error: err.message });
        });
    } else {
      res.redirect("/");
    }
  });

  router.get('/:id', (req, res) => {
    const userId = req.session.userId || "";
    const orderIdForUser = req.params.id;

    if (userId) {
      getUserInfo(userId, db)
        .then(userInfo => {
          const orderSummQuery = `SELECT * FROM order_summary WHERE order_id = ${orderIdForUser}`;

          db.query(orderSummQuery)
            .then(data => {
              const orderData = data.rows;
              const structuredOrders = refactorOrder(orderData)[0];
              const user = userInfo;

              const params = { user, structuredOrders, iconsKey };
              res.render("new_order", params);
            })
            .catch(err => {
              res.status(500).json({ error: err.message });
            });

        })
        .catch(err => {
          res.status(500).json({ error: err.message });
        });
    } else {
      const user = generateEmptyUser();
      const params = { user, iconsKey };
      res.render("404", params);
    }
  });
  return router;
};
