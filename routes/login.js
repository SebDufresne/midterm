/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

// Secure authentication
const bcrypt = require('bcrypt');

module.exports = (db, iconsKey) => {

  router.get("/", (req, res) => {
    const userId = req.session.userId || '';
    if (userId) {
      res.redirect('/');
    } else {
      const user = '';
      const {statusCode} = 200;
      const params = {user, statusCode, iconsKey};
      res.render('login', params);
    }
  });

  router.post("/", (req, res) => {
    const userId = req.session.userId || '';

    // Missing Logic IF user is already logged in

    const formEmail = req.body.email;
    const formPassword = req.body.password;

    if (!formEmail || !formPassword) {
      // User didn't enter both informations
    } else {
      let query = `SELECT * FROM users WHERE email = '${formEmail}'`;
      console.log(query);
      db.query(query)
        .then(data => {
          const userData = data.rows[0]; // Imply that only the FIRST returned entry will be stored.
          console.log(userData);
          if (bcrypt.compareSync(formPassword, userData.password)) {
            console.log("YEAAAHHHH IT MATCHED!!!!");
            req.session.userId = userData.id;
            res.redirect('/');
          } else {
            // It didn't match :-(
          }
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
