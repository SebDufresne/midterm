require('dotenv').config();

const sendSMS = function(phone, message, PHONE_TWILIO = process.env.PHONE_TWILIO, ACCOUNT_SID = process.env.ACCOUNT_SID, AUTH_TOKEN = process.env.AUTH_TOKEN) {
  const accountSid = 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
  const authToken = 'your_auth_token';
  const client = require('twilio')(ACCOUNT_SID, AUTH_TOKEN);

  client.messages
    .create({
      body: message,
      from: PHONE_TWILIO,
      to: phone
    })
    .then(message => console.log(message.sid));
};

module.exports = { sendSMS };
