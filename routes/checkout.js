/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db, iconsKey) => {
  router.get("/", (req, res) => {
    const order = JSON.parse(req.session.cart);

    console.log('In the checkout GET', order);

    const params = {user, cart, iconsKey};
    res.render("checkout", params);

  });
  router.post("/", (req, res) => {
    console.log("req", req);
    console.log("res", res);
    const cartURL = req.params.cart;

    const cart = JSON.parse(cartURL);

    const user = '';
    const params = {user, cart, iconsKey};

    res.render("checkout", params);
  });
  return router;
};



