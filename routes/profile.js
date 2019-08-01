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

    if (userId) {
      getUserInfo(userId, db)
        .then(userInfo => {
          const user = userInfo;

          const params = { user, iconsKey };
          res.render("profile", params);
        })
        .catch(err => {
          res.status(500).json({ error: err.message });
        });
    }
  });
  return router;
};
