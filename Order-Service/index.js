const express = require('express');
// const jwt = require("jsonwebtoken");
const amqp = require('amqplib');
const Order =require("./Order.js");
const PORT = process.env.PORT_ONE||4000;
const isAuthenticated = require("../isAuthenticated.js")

var connection,channel;

const app = express();
app.use(express.json());

//DB connection
require('./mongoose.js');


//RabbitMQ
async function connect(){
    const ampqpServer = "amqp://localhost:5672";
    try {
        connection = await amqp.connect(ampqpServer);
        channel = await connection.createChannel();
        await channel.assertQueue("ORDER");
    } catch (error) {
        console.log(error);
    }   
}

async function createOrder(products,userEmail){
    let total=0;
    total=products.reduce((total,prod)=>total+=prod.price,0);
    const newOrder = new Order({
        products,
        user:userEmail,
        total_price:total
    });
    await newOrder.save();
    return newOrder;
}


connect().then(async ()=>{
   (await channel).consume("ORDER",async (data)=>{
        // console.log(JSON.parse(data.content));
        const {products,userEmail} = JSON.parse(data.content);
        const newOrder = await createOrder(products,userEmail);
        (channel).ack(data);
        (channel).sendToQueue("PRODUCT",Buffer.from(JSON.stringify({newOrder})))
        console.log("Consuming Order Queue");
        // console.log(newOrder);
    })
}).catch(err=>console.log(err));


app.listen(PORT,function(){
    console.log("order Service listening at port " + PORT);
});


