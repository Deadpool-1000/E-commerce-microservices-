const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:String,
    email:String,
    password:String,
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
      }
},{ timestamps: true });


module.exports=User=mongoose.model("user",userSchema);

