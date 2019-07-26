DROP TABLE IF EXISTS orders CASCADE;

CREATE TYPE orderstatus AS ENUM ('fulfilled', 'active', 'declined')

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES user(id) ON DELETE CASCADE,
  ordered_at TIMESTAMP,
  status ORDERSTATUS DEFAULT NULL,
  total_cost INTEGER DEFAULT NULL,
  comments TEXT
);
