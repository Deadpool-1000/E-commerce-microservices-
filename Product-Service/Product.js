const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name:String,
    description:String,
    price:Number
},{ timestamps: true });


module.exports=Product=mongoose.model("product",productSchema);

