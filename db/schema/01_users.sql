DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  picture_url TEXT DEFAULT 'src/images/avatars/001.svg',
  admin BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE
);
