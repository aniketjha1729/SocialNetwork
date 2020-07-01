const express=require("express");
const router=express.Router();

router.get("/posts",(req,res)=>{
    res.json({
        msg:"This is post Routes"
    })
})

module.exports=router;