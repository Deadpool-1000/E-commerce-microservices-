const express = require('express');
const amqp = require('amqplib');
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
        await channel.assertQueue("PRODUCT");
        await channel.assertQueue("NEW");
        await channel.assertQueue("NEWPRODUCT");
        // await channel.assertQueue("ALL");
    } catch (error) {
        console.log(error);
    }
}
connect();

//Create new product
app.post("/products/create",isAuthenticatedAdmin,async function(req,res){
    const {name,description,price} = req.body;
    try {
        await channel.sendToQueue("NEW",Buffer.from(JSON.stringify({
            product:{name,description,price},
        })));
        await channel.consume("NEWPRODUCT",data=>{
            console.log("Consuming NEWPRODUCT queue");
            channel.ack(data);
            newProduct = JSON.parse(data.content); 
            return res.json(newProduct);
        });
    } catch (error) {
        console.log("Error at products/create");
        res.json(error);
    }
});

//All Products Admin-only route
app.get("/products/all",isAuthenticatedAdmin,async function(req,res){
    const products = [];
    try {
        const response = await fetch("localhost:4000/allProducts");
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.json({error});
    }
});


//Buy a particular Product
app.post("/products/buy",isAuthenticated,async function(req,res){
    const {ids} = req.body;
    try {
        //SENDING DATA TO ORDER QUEUE FOR INVOICE GENERATION
        const products = await Product.find({'_id':{$in:ids}});
        await channel.sendToQueue("ORDER",Buffer.from(JSON.stringify({
            products,
            user:req.user
        })));
        //WAITING FOR INVENTORY-SERVICE TO SEND THE NEWLY GENERATED PRODUCT
        await channel.consume("PRODUCT",data=>{
            console.log("Consuming PRODUCT queue");
            order = JSON.parse(data.content); 
            channel.ack(data);
        });
        return res.json(order);
    } catch (error) {
        console.log(error);
    }
});



app.listen(PORT,function(){
    console.log("Product Service listening at port " + PORT);
});


