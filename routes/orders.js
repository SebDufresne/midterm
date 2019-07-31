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
    // console.log("req", req);
    // console.log("res", res);
    // const cartURL = req.params.cart;


    // console.log(req.body.cart); // SEB: Temporarily removed

    const ownerId = 1; // Seb: Just did it like that for the moment

    sendSMS(getPhoneNumber(ownerId), `A new 🌭 order has been placed.`);


    // console.log("req.body: ", req.body)
    // console.log("cartURL: ", cartURL);

    // const cart = JSON.parse(cartURL);

    // console.log("Cart within POST:", cart)

    // const user = '';
    // const params = {user, cart, iconsKey};

    // res.render("cart", params);

    req.session.cart = null; // Empty Cart Cookie
  });
  return router;
};
