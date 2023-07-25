const express = require('express');
// const jwt = require("jsonwebtoken");
const amqp = require('amqplib');
const Product =require("./Product.js");
const PORT = process.env.PORT_ONE||3000;
const isAuthenticated = require("../isAuthenticated.js")
const isAuthenticatedAdmin = require("../isAuthenticatedAdmin.js")
let order;
let connection,channel;

const app = express();
app.use(express.json());

//DB connection
require('./mongoose.js');


//RabbitMQ
async function connect(){
    const ampqpServer = "amqp://localhost";
    try {
        connection =await  amqp.connect(ampqpServer)
        channel = await connection.createChannel();
        await channel.assertQueue("PRODUCT")
    } catch (error) {
        console.log(error);
    }
}
connect();

//Create new product
app.post("/products/create",isAuthenticatedAdmin,async function(req,res){
    const {name,description,price} = req.body;
    const newProduct = new Product({name,price,description});
    await newProduct.save();
    res.json(newProduct);
});

app.post("/products/buy",isAuthenticated,async function(req,res){
    const {ids} = req.body;
    try {
        const products = await Product.find({'_id':{$in:ids}});
        console.log("Products: \n",products);
        await channel.sendToQueue("ORDER",Buffer.from(JSON.stringify({
            products,
            userEmail:req.user.email
        })));
        await channel.consume("PRODUCT",data=>{
            console.log("Consuming PRODUCT queue");
            // console.log(JSON.parse(data.content));
            order = JSON.parse(data.content); 
            channel.ack(data);
        });
        return res.json(order)
        // res.send("OK");
    } catch (error) {
        console.log(error);
    }
});



app.listen(PORT,function(){
    console.log("Product Service listening at port " + PORT);
});


