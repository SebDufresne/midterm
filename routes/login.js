/*
 * All routes for Login are defined here
 * Since this file is loaded in server.js into /login,
 *   these routes are mounted onto /login
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();

// Secure authentication
const bcrypt = require("bcrypt");

const { generateEmptyUser } = require("../lib/helpers");

module.exports = (db, iconsKey) => {

  // GET of /login
  router.get("/", (req, res) => {
    const userId = req.session.userId || "";
    if (userId) {
      res.redirect("/");
    } else {
      const user = generateEmptyUser();
      const { statusCode } = 200;
      const errorMessage = "";
      const params = { user, statusCode, errorMessage, iconsKey };
      res.render("login", params);
    }
  });


  // POST of /login
  router.post("/", (req, res) => {
    const userId = req.session.userId || "";

    if (userId) {
      res.redirect("/");
    }

    const formEmail = req.body.email;
    const formPassword = req.body.password;

    if (!formEmail || !formPassword) {
      res.status(403);
      const user = generateEmptyUser();
      const errorMessage = "Please enter an email and a password";
      const params = { user, errorMessage, iconsKey };

      res.render("login", params);
    } else {
      const getPasswordQuery = {
        text: `SELECT id, password, admin FROM users WHERE email = $1`,
        values: [formEmail]
      };

      db.query(getPasswordQuery)
        .then(data => {
          const userInfo = data.rows[0];

          if (bcrypt.compareSync(formPassword, userInfo.password)) {
            req.session.userId = userInfo.id;
            if (userInfo.admin) {
              res.redirect(`/owners/${userInfo.id}/orders`);
            } else {
              res.redirect("/");
            }
          } else {
            res.status(403);
            const user = generateEmptyUser();
            const errorMessage = "Password and email doesn't match";
            const params = { user, errorMessage, iconsKey };

            res.render("login", params);
          }
        })
        .catch(err => {
          res.status(500).json({ error: err.message });
        });
    }
  });
  return router;
};
