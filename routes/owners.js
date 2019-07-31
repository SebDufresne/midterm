/*
 * All routes for Owners are defined here
 * Since this file is loaded in server.js into /owners,
 *   these routes are mounted onto /owners
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

const { refactorOrder } = require('../lib/helpers');

module.exports = (db, iconsKey) => {
  router.get("/", (req, res) => {
    const userId = req.session.userId || '';

    const orderSummQuery = `SELECT * FROM order_summary;`;
    db.query(orderSummQuery)
      .then(data => {
        const orderData = data.rows;

        const structuredOrders = refactorOrder(orderData);

        const user = {};
        if (!userId) {
          user.id = '';
        }
        const params = {user, structuredOrders, iconsKey};
        res.render("owner-summary", params);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
