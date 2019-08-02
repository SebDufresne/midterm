# Top Dogs

A Hot Dog ordering app.

## Final Product

A node express web app to connect customers with restaurant owners.

### Client Side

Users can register with their email and phone number. Users can then select menu items and add them to their cart, once an order if confirmed, and the restaurant has accepted the order, the user is notified via text message when their order will be ready for pickup. 

Order history lists a users order history and can be clicked to show details of the order.

!["Screen capture of highlighting in desktop mode"](https://github.com/SebDufresne/tweeter/blob/master/docs/desktop_highlight_menu.png)

### Admin Side

Admin users would typically be restaurants. Admins are notified when an order is placed, via text message. Admins can then use their active order page to either accept the order, and indicate how long it will take to fulfill, or reject the order. The admins response is communicated to the user through text-message.

Admins can see a history of their orders on order-history page, with drop down to show details.

!["Screen capture of layout in tablet mode"](https://github.com/SebDufresne/tweeter/blob/master/docs/tablet_layout.png)

### Mobile Mode

Food menu designed to be comfortable for both mobile and desktop views. Menu item pictures bigger on mobile.

!["Screen capture of Back To Top Button in mobile mode"](https://github.com/SebDufresne/tweeter/blob/master/docs/mobile_backToTop_Button.png)

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
