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

const { generateEmptyUser } = require('../lib/helpers');

module.exports = (db, iconsKey) => {

  router.get("/", (req, res) => {
    const userId = req.session.userId || '';
    if (userId) {
      res.redirect('/');
    } else {
      const user = generateEmptyUser();
      const {statusCode} = 200;
      const errorMessage = '';
      const params = {user, statusCode, errorMessage, iconsKey};
      res.render('login', params);
    }
  });

  router.post("/", (req, res) => {
    const userId = req.session.userId || '';

    if (userId) {
      res.redirect('/');
    }

    const formEmail = req.body.email;
    const formPassword = req.body.password;

    if (!formEmail || !formPassword) {
      res.status(403);
      const user = generateEmptyUser();
      const errorMessage = 'Please enter an email and a password';
      const params = {user, errorMessage, iconsKey};

      res.render('login', params);
    } else {
      const getPasswordQuery = `SELECT id, password FROM users WHERE email = '${formEmail}'`;

      db.query(getPasswordQuery)
        .then(data => {
          // email IS unique in DB
          const userData = data.rows[0];

          if (bcrypt.compareSync(formPassword, userData.password)) {
            req.session.userId = userData.id;
            res.redirect('/');
          } else {
            res.status(403);
            const user = generateEmptyUser();
            const errorMessage = "Password and email doesn't match";
            const params = {user, errorMessage, iconsKey};

            res.render('login', params);
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
