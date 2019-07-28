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

// Secure authentication
const bcrypt = require('bcrypt');

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
const widgetsRoutes = require("./routes/widgets");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/widgets", widgetsRoutes(db));
// Note: mount other resources here, using the same pattern above


// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get("/", (req, res) => {

  // const user = users[req.session.userId] || '';
  // const user = users[0];
  const user = '';

  db.query(`SELECT * FROM foods`)
    .then(response => {
      const foods = response.rows;
      // res.json(response);
      // console.log("foods:",foods)
      const params = {user, foods, iconsKey};
      res.render("index", params);
    });

});


app.post("/checkout/:cart", (req, res) => {
  const cartURL = req.params.cart;
  console.log(cartURL);
  const cart = $.parseJSON(cartURL);
  console.log("cart: ", cart);

  const user = '';
  const params = {user, cart, iconsKey};

  console.log('cart: ', cart);
  console.log("And I'm here2");
  res.render("checkout", params);
});

app.get("/login", (req, res) => {
  res.render("login");
});

// Submits Login Page
app.post('/login', (req, res) => {
  const userId = req.session.userId || '';

  // should get user by email
  const user = users[0].email = req.body.email ? users[0] : '';
  if (!userId) {
    res.status(403);
  } else if (!bcrypt.compareSync(req.body.password,user.password)) {
    res.status(403);
  } else {
    req.session.userId = user.id;
    res.redirect('/');
  }
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
