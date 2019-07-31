/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

const { getUserInfo } = require('../lib/helpers');

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
          res.render("cart", params);
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
              res.render("cart", params);
            });
        })
        .catch(err => {
          res
            .status(500)
            .json({ error: err.message });
        });
    }
  });

  return router;
};
