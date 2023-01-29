// This server only for authentication

require('dotenv').config();
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
app.use(express.json());


// we store refreshToken in databases

// lets store refreshToken in  array just for understanding
const refreshTokens =[];

app.post('/token',(req,res)=>{
    const refreshToken = req.body.token;
       if(refreshToken===null)return res.sendStatus(401)
    if(!refreshTokens.includes(refreshToken)) return res.sendStatus(401);

     jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,(err,user)=>{
        if(err) return res.sendStatus(403)
        const accessToken =  generateAccessToken({name:user.name})
          res.json({accessToken:accessToken})
     })
      


})
// app.post('/login',(req,res)=>{
//     //After Auntheticating the user. use jwt given below ....
  
//     const username = req.body.username;
//     const user = {name:username};
  


//     //use require('crypto').randomBytes(64).toString('hex') for creating secrete token
//   const accessToken=  jwt.sign(user,
//     process.env.ACCESS_TOKEN_SECRET)  // it will create access token which stores all the user related information.
//     res.json({accessToken:accessToken}) 
    
// })

app.delete('/logout',(req,res)=>{
    refreshTokens = refreshTokens.filter(token=>token!==req.body.token)
    res.sendStatus(204)
})

app.post('/login',(req,res)=>{
    
    const username = req.body.username;
    const user ={name:username};

    const accessToken =  generateAccessToken(user)
    const refreshToken = jwt.sign(user,process.env.REFRESH_TOKEN_SECRET)
    refreshTokens.push(refreshToken);
    res.json({accessToken:accessToken,refreshToken:refreshToken});
})





function generateAccessToken(user){
    return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1m'})  //Token expire after 1 minute 
}



app.listen(4000,()=>{
    console.log("Server listening on port 4000....");
})