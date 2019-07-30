/*
 * All routes for Oder-Summary are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db, iconsKey) => {
  router.get("/", (req, res) => {
    const userId = req.session.userId || '';

    const orderSummQuery = `SELECT * FROM order_summary;`;
    db.query(orderSummQuery)
      .then(data => {
        const orderData = data.rows;


        res.json({ orderData });

        const orderSummary = [];

        orderData.forEach((e) => {
          const order_id = e.order_id;
          const ordered_at = e.ordered_at;
          const newOrder = {order_id, ordered_at};
          orderSummary.push(newOrder);
        });
        res.json({ orderSummary });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
