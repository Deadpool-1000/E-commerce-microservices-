const express = require('express');
const amqp = require('amqplib');
const Order =require("./Order.js");
const PORT = process.env.PORT_ONE||4000;
const Product = require('./Product.js');

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
        await channel.assertQueue("ORDER",{ durable: true });
        await channel.assertQueue("ALL",{ durable: true });
    } catch (error) {
        console.log(error);
    }   
}

//INVOICE GENERATOR
async function createOrder(products,user){
    let total=0;
    total=products.reduce((total,prod)=>total+=prod.price,0);
    // console.log("Products \n",products);
    const newOrder = new Order({
        products,
        user:user.id,
        total_price:total
    });
    await newOrder.save();
    return newOrder;
}

//START CONSUMING ORDER QUEUE AS SOON AS CONNECTION IS ESTABLISHED
connect().then(async ()=>{
    const Products = await Product.find({});
    for (const product of Products){
        channel.sendToQueue("ALL",Buffer.from(JSON.stringify({product}),{ persistent: true }))
        console.log("Product send:" , product);
    }
   (await channel).consume("ORDER",async (data)=>{
       console.log("Consuming Order Queue");
        // console.log(JSON.parse(data.content));
        const {products,user} = JSON.parse(data.content);
        const newOrder = await createOrder(products,user);
        (channel).ack(data);
        (channel).sendToQueue("PRODUCT",Buffer.from(JSON.stringify({newOrder})))
        // console.log(newOrder);
    });
    await channel.consume("NEW",async (data)=>{
        console.log("Consuming NEW queue");
        const {product} = JSON.parse(data.content);
        const newProduct = new Product(product);
        await newProduct.save();
        (channel).sendToQueue("NEWPRODUCT",Buffer.from(JSON.stringify({newProduct})));
        (channel).sendToQueue("ALL",Buffer.from(JSON.stringify({newProduct})));
    });
}).catch(err=>console.log(err));


//ONLY ROUTE MADE TO FETCH ALL PRODUCTS (TEMPORARY SOLUTION)
app.get('/allProducts',async function(req,res){
    try {
        const Products = await Product.find({});
        res.json(Products);        
    } catch (error) {
        console.log(error);
    }
});

app.listen(PORT,function(){
    console.log("order Service listening at port " + PORT);
});


