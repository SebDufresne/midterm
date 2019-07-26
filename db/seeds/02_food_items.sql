-- CREATE TABLE food_items (
--   id SERIAL PRIMARY KEY,
--   name TEXT NOT NULL,
--   description TEXT NOT NULL,
--   price INTEGER NOT NULL,
--   picture_url TEXT,
--   vegan BOOLEAN DEFAULT FALSE,
--   vegetarian BOOLEAN DEFAULT FALSE,
--   gluten_free BOOLEAN DEFAULT FALSE
-- );

INSERT INTO food_items (name,description,price,picture_url,vegan,vegetarian,gluten_free)
VALUES
('Tubby Dog', 'homemade chili, bacon, cheese, onions, mustard'),
('Cheetah', 'sauerkraut, cheese, mustard, relish'),
('Yogi Bear', 'mustard, ketchup, relish, onions, cheese slices'),
('Harlo', 'bacon, cheese, mustard, relish'),
('A-Bomb', 'cheese, bacon, mayo, mustard, ketchup, potato chips'),
('Sumo', 'Japanese mayo, wasabi, pickled ginger, lightly toasted sesame seeds, seaweed salad'),
('Slaw Dog', 'coleslaw, jpmemade chili, mustard, cheese, pickles'),
('PBJ', 'peanut butter & jelly'),
("Sherm's Ultimate Gripper", 'dog is bacon wrapped then deep-fried! topped with ham, homemade chili, cheese, mustard, bacon, hot peppers, onions, and a friend egg');
