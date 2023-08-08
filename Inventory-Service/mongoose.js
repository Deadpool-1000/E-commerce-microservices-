const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://admin:1234@travelbuddy.mwmagj8.mongodb.net/inventory-service")
  .then(() => console.log('Order Service DB Connected!'));