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
    const userId = req.session.userId || '';

    const order = JSON.parse(req.session.cart);

    console.log('In the checkout GET', order);
    res.json({ order });

    // Selected food items, based on their IDs
    const gatheredIds = Object.keys(order).join(', ');

    // Query based on the user's selected food items
    const queryFoods = `SELECT id, name, price, picture_url FROM foods WHERE id IN (${gatheredIds})`;

    db.query(queryFoods)
      .then(foodData => {
        const foods = foodData.rows;
        const cart = [];

        for (const foodItem of foods) {
          const id = foodItem.id;
          const name = foodItem.name;
          const price = foodItem.price;
          const qty = order[foodItem.id];

          const eachFood = {id, name, price, qty};
          cart.push(eachFood);
        }

        if (userId) {
          getUserInfo(db, userId)
            .then(usersData => {
              const user = usersData; // Implies there's ONLY one
              const params = {user, cart, iconsKey};
              res.render("checkout", params);

            })
            .catch(err => {
              res
                .status(500)
                .json({ error: err.message });
            });
        } else {
          const user = {};
          user.id = '';
          const params = {user, cart, iconsKey};
          res.render("checkout", params);
        }
      })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
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
