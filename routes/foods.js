/*
 * All routes for Foods are defined here
 * Since this file is loaded in server.js into api/foods,
 *   these routes are mounted onto /foods
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    let query = `SELECT * FROM foods`;
    // console.log(query);  // SEB: Temporarily removed
    db.query(query)
      .then(data => {
        const foods = data.rows;
        res.json({ foods });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
