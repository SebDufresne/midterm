/*
 * All routes for Foods are defined here
 * Since this file is loaded in server.js into api/foods,
 *   these routes are mounted onto /foods
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();


const { sendSMS } = require('../public/scripts/sms');

const { getPhoneNumber } = require('../lib/helpers');

module.exports = (db) => {
  router.get("/", (req, res) => {
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
