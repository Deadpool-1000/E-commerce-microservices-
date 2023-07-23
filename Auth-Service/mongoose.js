const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://admin:1234@travelbuddy.mwmagj8.mongodb.net/auth-service")
  .then(() => console.log('Auth Service DB Connected!'));