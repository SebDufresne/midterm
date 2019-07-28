// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT       = process.env.PORT || 8080;
const ENV        = process.env.ENV || "development";
const express    = require("express");
const bodyParser = require("body-parser");
const sass       = require("node-sass-middleware");
const app        = express();
const morgan     = require('morgan');

// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);

// Cookie Handling
const KEY_ONE = process.env.KEY_ONE;
const KEY_TWO = process.env.KEY_TWO;
const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'userSession',
  keys: [KEY_ONE, KEY_TWO]
}));

const iconsKey = process.env.FONT_AWESOME;

// Initial users database
const users = [
  {
    id: 2,
    name: 'seb',
    email: 'seb@test.com',
    phone_number: '514-555-5555',
    password: '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.',
    admin: false
  }
];

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const foodsRoutes = require("./routes/foods");
const checkoutRoutes = require("./routes/checkout");
const loginRoutes = require("./routes/login");
const logoutRoute = require("./routes/logout");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/foods", foodsRoutes(db));
app.use("/login", loginRoutes(db, iconsKey));
app.use("/logout", logoutRoute());
app.use("/checkout", checkoutRoutes(db, iconsKey));
// Note: mount other resources here, using the same pattern above


// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get("/", (req, res) => {
  const userId = req.session.userId || '';

  const queryFoods = `SELECT * FROM foods;`;
  db.query(queryFoods)
    .then(foodData => {
      const foods = foodData.rows;
      // res.json(response);
      // console.log("foods:",foods)

      if (userId) {
        const queryUsers = `SELECT * FROM users WHERE id = '${userId}'`;
        console.log(queryUsers);
        db.query(queryUsers)
          .then(usersData => {
            console.log(foods);
            const user = usersData.rows[0]; // Implies there's ONLY one
            const params = {user, foods, iconsKey};
            res.render("index", params);

          })
          .catch(err => {
            res
              .status(500)
              .json({ error: err.message });
          });
      } else {
        const user = {};
        user.id = '';
        const params = {user, foods, iconsKey};
        res.render("index", params);
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });

});

// Logout user (removes cookie)
app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/');
});

app.get("/list-orders", (req, res) => {
  res.render("list-orders");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
