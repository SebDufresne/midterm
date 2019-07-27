DROP TABLE IF EXISTS food_orders CASCADE;

CREATE TABLE food_orders (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  food_id INTEGER REFERENCES foods(id) ON DELETE CASCADE
);