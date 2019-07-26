DROP TABLE IF EXISTS orders CASCADE;

CREATE TYPE status_opt AS ENUM('new', 'processing', 'declined', 'fulfilled');

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES user(id) ON DELETE CASCADE,
  ordered_at TIMESTAMP,
  status STATUS_OPT DEFAULT 'new',
  total_cost INTEGER DEFAULT NULL,
  customer_comments TEXT
);
