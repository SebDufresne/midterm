CREATE VIEW order_summary AS
  SELECT orders.id AS order_id,
    ordered_at,
    status AS order_status,
    customer_comments,
    foods.id AS food_id,
    foods.name AS food_name,
    count(food_orders) AS food_qty,
    foods.picture_url,
    users.id AS user_id,
    users.name AS customer_name,
    users.email,
    users.phone_number,
    total_cost
  FROM orders
  JOIN users ON users.id = user_id
  JOIN food_orders ON orders.id = order_id
  JOIN foods ON foods.id = food_id
  GROUP BY orders.id, foods.id, users.id
  ORDER by orders.id;
