# Top Dogs

A hot dog ordering app.

## Final Product

A node express web app to connect customers with restaurant owners.

## Authors
Sebastien D, Robin W and Jess N-L.

### Client Side

Users can register with their email and phone number. Users can then select menu items and add them to their cart. Once an order has been confirmed and the restaurant has accepted the order, the user is notified via SMS message when their order will be ready for pick up.

The user has access to an order history page. This displays a list of orders which can be expanded to view further details about a specific order. The user also has access to a profile which can be customized.

#### A list of available offers

!["A list of available offers"](https://github.com/SebDufresne/midterm/blob/master/docs/screenshots/food_items.png)

#### Shopping cart
!["Shopping cart"](https://github.com/SebDufresne/midterm/blob/master/docs/screenshots/cart.png)

#### Empty cart
!["Empty cart"](https://github.com/SebDufresne/midterm/blob/master/docs/screenshots/empty_cart.png)

#### New order has been placed
!["New order has been placed"](https://github.com/SebDufresne/midterm/blob/master/docs/screenshots/new_order.png)

#### Order history on the user's side
!["Order history on the user's side"](https://github.com/SebDufresne/midterm/blob/master/docs/screenshots/user_order_history.png)

#### User profile
!["User profile"](https://github.com/SebDufresne/midterm/blob/master/docs/screenshots/user_profile.png)

#### User profile customization
!["User profile customization"](https://github.com/SebDufresne/midterm/blob/master/docs/screenshots/user_profile_edit.png)

### Admin Side

Admin users would typically be the restaurant's owner(s). Admins are notified when an order is placed via text message. Admins can then use their active order page to either accept the order while also indicating how long it will take to fulfill or reject the order. The admins response is communicated to the user via SMS message.

Just like the user, the admin also has access to an order history page. This displays a list of orders which can be expanded to view further details about a specific order. The admin also has access to a profile which can be customized.

#### List of active orders
!["List of active orders"](https://github.com/SebDufresne/midterm/blob/master/docs/screenshots/active_orders.png)

#### Order history on the admin's side
!["Order history on the admin's side"](https://github.com/SebDufresne/midterm/blob/master/docs/screenshots/owner_order_history.png)

### Mobile Mode

The restaurant's food menu is designed to be comfortable for both mobile and desktop views. To accentuate this, menu items on mobile devices are displayed as a single column and the images widened.

#### Mobile integration
!["Mobile integration"](https://github.com/SebDufresne/midterm/blob/master/docs/screenshots/food_items_mobile.png)

### Extra features

#### Registration page
!["Registration page"](https://github.com/SebDufresne/midterm/blob/master/docs/screenshots/registration.png)

#### Login page
!["Login page"](https://github.com/SebDufresne/midterm/blob/master/docs/screenshots/login.png)

#### Dropdown navigation menu
!["Dropdown navigation menu"](https://github.com/SebDufresne/midterm/blob/master/docs/screenshots/dropdown_navigation.png)

#### 404 page
!["404 page"](https://github.com/SebDufresne/midterm/blob/master/docs/screenshots/404.png)

#### SMS notification
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
