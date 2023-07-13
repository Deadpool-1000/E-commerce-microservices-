const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/order-service")
  .then(() => console.log('Order Service DB Connected!'));