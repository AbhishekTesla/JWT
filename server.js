// This server only for api related task like GET ,DELETE, UPDATE  posts.... not for authentication

require('dotenv').config();
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
app.use(express.json());

const posts = [
    {
        username:'Abhishek',
        post:1
    },
    {
        username:'Abhay',
        post:2
    }
]



app.get('/posts',authenticateToken,(req,res)=>{
    res.json(posts.filter(post=>post.username===req.user.name))
    
})






//middleware 
function authenticateToken(req,res,next){

const authHeader = req.headers['authorization'] //this function takes the token from header

const token =authHeader &&  authHeader.split(' ')[1]; // this is actual token

if(token===null)return res.sendStatus(401);

jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{

    if(err)return res.sendStatus(403)

    req.user = user;
    next();

})



} 

app.listen(3000,()=>{
    console.log("Server listening on port 3000....");
})