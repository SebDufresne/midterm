/*
 * All routes for Owners are defined here
 * Since this file is loaded in server.js into /owners,
 *   these routes are mounted onto /owners
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

const { sendSMS } = require("../public/scripts/sms");

const { getPhoneNumber, getUserInfo, refactorOrder } = require('../lib/helpers');

module.exports = (db, iconsKey) => {
  router.get("/:id/orders", (req, res) => {
    const userId = req.session.userId || '';

    getUserInfo(userId, db)
      .then(userInfo => {

        if (userInfo.admin) {

          const orderSummQuery = `SELECT * FROM order_summary WHERE order_status IN ('new', 'processing')`;

          db.query(orderSummQuery)
            .then(data => {
              const orderData = data.rows;

              const structuredOrders = refactorOrder(orderData);

              const user = userInfo;
              const params = {user, structuredOrders, iconsKey};
              res.render("owner_active", params);
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
  });
  router.post("/:userId/orders/:orderId", (req, res) => {
    const userId = req.session.userId || '';

    getUserInfo(userId, db)
      .then(userInfo => {
        if (userInfo.admin) {

          const orderId = req.params.orderId;
          const newState = req.body.state;
          const timeForReady = req.body.timer;


          const updateOrderQuery = {
            text:
              "UPDATE orders SET status = $1 WHERE id = $2",
            values: [newState, orderId]
          };

          db.query(updateOrderQuery)
            .then(() => {
              let message = `Your order #${orderId} `;
              if (newState === 'declined') {
                message += 'has been cancelled by Top Dog.';
              } else if (newState === 'processing') {
                message += `is being prepared and should be ready in ${timeForReady} minutes.`;
              } else if (newState === 'fulfilled') {
                message += 'is now ready to be picked up.';
              }

              const custumerPhone = getPhoneNumber(userId, db);

              sendSMS(
                custumerPhone,
                message
              );

              res.redirect(`/owners/${userId}/orders`);
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
  });
  return router;
};
