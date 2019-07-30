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

// Key for Font Awesome
const iconsKey = process.env.FONT_AWESOME;

// Helper Functions
const { getUserInfo } = require('./lib/helpers');

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
// API
const foodsRoutes = require("./routes/foods");
const ordersRoutes = require("./routes/orders");
const usersRoutes = require("./routes/users");

// APP
const checkoutRoutes      = require("./routes/checkout");
const loginRoutes         = require("./routes/login");
const logoutRoute         = require("./routes/logout");
const orderSummaryRoutes  = require("./routes/order-summary");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// API
app.use("/api/foods",  foodsRoutes(db));
app.use("/api/orders", ordersRoutes(db));
app.use("/api/users",  usersRoutes(db));

// APP
app.use("/checkout",      checkoutRoutes(db, iconsKey));
app.use("/login",         loginRoutes(db, iconsKey));
app.use("/logout",        logoutRoute());
app.use("/order-summary", orderSummaryRoutes(db, iconsKey));
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
        getUserInfo(userId, db)
          .then(usersData => {
            // console.log(usersData); // SEB: Temporarily removed
            // console.log(foods); // SEB: Temporarily removed
            const user = usersData; // Implies there's ONLY one
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

app.post("/", (req, res) => {
  const cartStr = req.body.cart;
  // console.log("SEB - I'm here now!!!", cartStr);
  req.session.cart = cartStr;
  res.redirect('checkout');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

module.exports = { db };
