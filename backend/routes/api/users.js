const express = require("express");
const router = express.Router();
const User = require("../../models/Users");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const keys=require("../../config/config").secretOrKey;
const passport = require('passport');

const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

router.post("/register",(req,res)=>{
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({email:req.body.email}).then(user=>{
    if(user){
      return res.status(400).json({
        email:"Email already Exists"
      })
    }else{
      const avatar = gravatar.url(req.body.email, {
        s: "200", // Size
        r: "pg", // Rating
        d: "mm", // Default
      });
      const newUser=new User({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        avatar
      })
      bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(newUser.password,salt,(err,hash)=>{
          if(err) throw err;
          newUser.password=hash;
          newUser.save().then(user=>
            res.status(200).json(user)).catch(err=>console.log(err))
        })
      })
    }
  })
})


router.post("/login",(req,res)=>{
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const {email,password}=req.body
  User.findOne({email}).then(user=>{
    if(!user){
      errors.email="User Not Found"
      return res.status(400).json(errors)
    }
    bcrypt.compare(password,user.password).then(isMatch=>{
      if(isMatch){
        const payload = { id: user.id, name: user.name, avatar: user.avatar }; // Create JWT Payload
        // Sign Token
        jwt.sign(payload,keys,{ expiresIn: 3600 },(err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token
            });
          }
        );
      }else{
        errors.password="Password does not match"
        return res.status(400).json(errors )
      }
    })
  })
})

module.exports = router;
