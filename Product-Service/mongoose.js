const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://admin:1234@travelbuddy.mwmagj8.mongodb.net/product-service")
  .then(() => console.log('Product Service DB Connected!'));