GET /cart
- INFO: The owner will be able to see an empty cart -- Seb

POST /register
- FEATURE: We could have an event handler on submit, and if some fields are missing, highlight them, instead of doing error handling on POST submit.

POST /:userId/orders/:orderId
- BUG: At the moment, the phone number is faked, for confidentiality, but were we to try to make it for real, since it's a DB query, it would have to be
in a promise (refactored slightly)
