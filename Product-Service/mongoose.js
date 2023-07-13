const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/product-service")
  .then(() => console.log('Product Service DB Connected!'));