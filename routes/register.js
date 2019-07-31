/*
 * All routes for Register are defined here
 * Since this file is loaded in server.js into /register,
 *   these routes are mounted onto /register
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

// Secure authentication
const bcrypt = require('bcrypt');

const { generateEmptyUser } = require('../lib/helpers');

module.exports = (db, iconsKey, saltRounds) => {

  router.get("/", (req, res) => {
    const userId = req.session.userId || '';
    if (userId) {
      res.redirect('/');
    } else {
      const user = generateEmptyUser();
      const {statusCode} = 200;
      const errorMessage = '';
      const params = {user, statusCode, errorMessage, iconsKey};
      res.render('register', params);
    }
  });

  router.post("/", (req, res) => {
    const userId = req.session.userId || '';

    if (userId) {
      res.redirect('/');
    }

    const { name, phoneNumber, email, password} = req.body;

    // Issue with bcrypt v3.0.6 and node prior to Node 8.12.0
    // Possible fix: Node 8.12.0 ir bcrypt v3.0.0
    // bcrypt.hash(password, saltRounds, function(err, hash) {
    //   console.log('hashedPass', hash);
    // });

    if (!name || !phoneNumber || !email || !password) {
      const user = generateEmptyUser();
      const {statusCode} = 400;
      const errorMessage = 'all fields must have a value';
      const params = {user, statusCode, errorMessage, iconsKey};
      res.render('register', params);
    }

    const getUserIdQuery = {
      text: `SELECT id FROM users WHERE email = $1`,
      values: [email],
    };

    db.query(getUserIdQuery)
      .then(data => {
        const existUser = data.rows[0];

        if (!existUser) {

          const insertUserQuery = {
            text: `INSERT INTO users (name,email,phone_number,password)
              VALUES ($1, $2, $3, $4)
              RETURNING id;`,
            values: [name, email, phoneNumber, password],
          };

          db.query(insertUserQuery)
            .then(userInfo => {
              const newUserId = userInfo.rows[0].id;

              req.session.userId = newUserId;
              res.redirect('/'); // Could redirect to user page instead!!!
            })
            .catch(err => {
              res
                .status(500)
                .json({ error: err.message });
            });
        } else {
          const user = generateEmptyUser();
          const {statusCode} = 400;
          const errorMessage = 'you seem to already exit in our systems';
          const params = {user, statusCode, errorMessage, iconsKey};
          res.render('register', params);
        }
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
