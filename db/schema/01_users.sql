DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT,
  email TEXT,
  phone_number TEXT,
  password TEXT,
  admin BOOLEAN
);
