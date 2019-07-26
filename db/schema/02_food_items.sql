DROP TABLE IF EXISTS food_items CASCADE;

CREATE TABLE food_items (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL,
  picture_url TEXT,
  vegan BOOLEAN DEFAULT FALSE,
  vegetarian BOOLEAN DEFAULT FALSE,
  gluten_free BOOLEAN DEFAULT FALSE
);

