/*
 * All routes for Orders are defined here
 * Since this file is loaded in server.js into /orders,
 *   these routes are mounted onto /orders
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();

const { getUserInfo } = require("../lib/helpers");

module.exports = (db, iconsKey) => {

  // GET of /profile
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

  // POST of /profile
  router.post("/", (req, res) => {
    const userId = req.session.userId || "";
    const newName = req.body.name;
    const newPhone = req.body.phone;

    if (!newPhone && (newName.length >= 1)) {
      const updateUserName = {
        text: `UPDATE users SET name = $1 WHERE id = ${userId}`,
        values: [newName]
      };

      db.query(updateUserName);
      res.send(`Succesfully updated name in DB!`);
    }

    if (!newName && (newPhone.length >= 1)) {
      const updateUserPhone = {
        text: `UPDATE users SET phone_number = $1 WHERE id = ${userId}`,
        values: [newPhone]
      };

      db.query(updateUserPhone);
      res.send(`Succesfully updated phone number in DB!`);
    }

  });

  return router;
};
