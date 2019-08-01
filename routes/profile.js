/*
 * All routes for Orders are defined here
 * Since this file is loaded in server.js into /orders,
 *   these routes are mounted onto /orders
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();

const {
  getUserInfo,
  getPhoneNumber,
  refactorOrder
} = require("../lib/helpers");

module.exports = (db, iconsKey) => {
  router.get("/", (req, res) => {
    const userId = req.session.userId || "";

    if (!userId) {
      res.redirect("/login");
    }

    const selectUser = {
      text: `SELECT name, phone_number, email FROM users WHERE id = $1`,
      values: [userId]
    };

    if (userId) {
      getUserInfo(userId, db)
        .then(userInfo => {
          db.query(selectUser)
            .then(data => {
              const userData = data.rows[0];
              const user = userInfo;
              console.log("userData:", userData);

              const params = { user, userData, iconsKey };
              res.render("profile", params);
            })
            .catch(err => {
              res.status(500).json({ error: err.message });
            });
        })
        .catch(err => {
          res.status(500).json({ error: err.message });
        });
    }
  });

  return router;
};
