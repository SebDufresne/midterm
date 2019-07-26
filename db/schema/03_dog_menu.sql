DROP TABLE IF EXISTS dog_menu CASCADE;

CREATE TABLE dog_menus (
  id SERIAL PRIMARY KEY,
  name TEXT,
  description TEXT,
  price INTEGER,
  picture_url TEXT,
  vegan BOOLEAN,
  vegetarian BOOLEAN,
  gluten_free BOOLEAN
)

