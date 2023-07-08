const express = require('express');
const jwt = require("jsonwebtoken")
const PORT = process.env.PORT_ONE||7070;
const User = require("./User");

const app = express();
app.use(express.json());

//DB connection
require('./mongoose.js');


//Register Route 
app.post("/auth/register",async function(req,res){
    const {email,password,name} = req.body;
    try {
        const userAlreadyExists = await User.findOne({email});
        if(userAlreadyExists){
            return res.json({message:"User Already Exists"});
        } else {
            const newUser = new User({email,password,name});
            await newUser.save();
            return res.json(newUser);
        } 
    } catch (error) {
        console.log(error);
    }
});

app.post("/auth/login",async function(req,res){
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if(!user){
        return res.json({message:"No Such User exist"});
    } else {
        if(password!=user.password){
            return res.json({message:"Email or password incorrect"});
        }
        const payload = {
            email,
            name:user.name
        }
        const token = jwt.sign(payload,"secret",function(err,token){
            if(err){
                console.log(err);
            } else {
                return res.json({token})
            }
        });
    } 
});


app.listen(PORT,function(){
    console.log("Auth Service listening at port" + PORT);
});


