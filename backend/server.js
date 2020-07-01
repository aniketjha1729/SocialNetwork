require('dotenv').config();
const express =require("express");
const app=express();
const mongoose=require("mongoose");
const bodyParser = require("body-parser");
const passport=require("passport")

const PORT=process.env.PORT||3000;

const users=require("./routes/api/users");
const profile=require("./routes/api/profile");
const posts=require("./routes/api/posts");

//online
// mongoose.connect(process.env.mongoURI,{ useUnifiedTopology: true, useNewUrlParser: true },() => {
//     console.log("Database Connected");
//   }
// );
//offline
mongoose.connect(process.env.mongoDb, { useUnifiedTopology: true, useNewUrlParser: true }, () => {
    console.log('Connected');
})

// Passport middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api",users);
app.use("/api",profile);
app.use("/api",posts);




app.get("/",(req,res)=>{
    res.json({
        msg:"Success"
    })
})

app.listen(PORT,()=>{
    console.log(`app is running on ${PORT}`)
})

