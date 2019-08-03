# Top Dogs

A hot dog ordering app.

## Final Product

A node express web app to connect customers with restaurant owners.

## Authors
Sebastien D, Robin W and Jess N-L.

### Client Side

Users can register with their email and phone number. Users can then select menu items and add them to their cart. Once an order has been confirmed and the restaurant has accepted the order, the user is notified via text message when their order will be ready for pick up.

Order history lists a users order history which can be clicked to expand and display details of the order.

!["List of available offers"](https://github.com/SebDufresne/midterm/blob/master/docs/screenshots/food_items.png)

!["Shopping cart"](https://github.com/SebDufresne/midterm/blob/master/docs/screenshots/cart.png)

!["Empty cart"](https://github.com/SebDufresne/midterm/blob/master/docs/screenshots/empty_cart.png)

!["Completed order page"](https://github.com/SebDufresne/midterm/blob/master/docs/screenshots/new_order.png)

!["Order history for user side"](https://github.com/SebDufresne/midterm/blob/master/docs/screenshots/user_order_history.png)

!["User profile"](https://github.com/SebDufresne/midterm/blob/master/docs/screenshots/user_profile.png)

!["User profile modifications"](https://github.com/SebDufresne/midterm/blob/master/docs/screenshots/user_profile_edit.png)

### Admin Side

Admin users would typically be the restaurant's owner(s). Admins are notified when an order is placed via text message. Admins can then use their active order page to either accept the order while also indicating how long it will take to fulfill or reject the order. The admins response is communicated to the user through SMS message.

Admins can see a history of their orders on the Order History's page which can be selected to expand and display further details about a specific order.

!["List of active orders"](https://github.com/SebDufresne/midterm/blob/master/docs/screenshots/active_orders.png)

!["Order history for admin side"](https://github.com/SebDufresne/midterm/blob/master/docs/screenshots/owner_order_history.png)

### Mobile Mode

The restaurant's food menu is designed to be comfortable for both mobile and desktop views. Menu items on mobile are displayed as a single column and the images widened.

!["Mobile integration"](https://github.com/SebDufresne/midterm/blob/master/docs/screenshots/food_items_mobile.png)

### Extra features

!["Registration page"](https://github.com/SebDufresne/midterm/blob/master/docs/screenshots/registration.png)

!["Login page"](https://github.com/SebDufresne/midterm/blob/master/docs/screenshots/login.png)

!["Dropdown navigation menu"](https://github.com/SebDufresne/midterm/blob/master/docs/screenshots/dropdown_navigation.png)

!["404 page"](https://github.com/SebDufresne/midterm/blob/master/docs/screenshots/404.png)

!["SMS notification"](https://github.com/SebDufresne/midterm/blob/master/docs/screenshots/sms_owner.png)

## Dependencies

- Express
- Node 5.10.x or above
- Bcrypt
- Body-parser
- Chalk
- Cookie-session
- Dotenv
- Ejs
- Morgan
- Node-sass-middleware
- Pg
- Ppg-native
- Twilio

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node run local` command.
