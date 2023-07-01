const authGuard =require('../auth/authGuard');
const order = require('../models/orderModel');
const Order = require('../models/orderModel');
const router=require("express").Router();


router.post("/create",async(req,res)=>{
    const {cart,totalAmount,shippingAddress}=req.body;
    if(!cart || !totalAmount || !shippingAddress){
        return res.status(400).json({msg:"please enter all fields"});
    }
    try{
        const order=new Order({
            cart:cart,
            totalAmount:totalAmount,
            shippingAddress:shippingAddress,
            user:'64683e79a0344c4a4be4343e'
        })
        await order.save();
        res.json("ordercreated successfully");

    }catch(error){
        console.log(error);
        res.status(500).json({msg:error});
    }

});

router.get("/get_Single",async(req,res)=>{
    try{
        const orders=await Order.find({user:"64683e79a0344c4a4be4343e"});
        res.json(orders);
    }catch(error){
        console.log(error);
        res.status(500).json({msg:error});
    }
});

router.get("/get_All",async(req,res)=>{
    try{
        const order =await Order.find({})
        res.json(order)

    }catch(error){
        res.json("order Fetch Failed")
    }
})


//change order status
router.put("/change_status/:id",async(req,res)=>{
    try{
        //find the order
        const order=await Order.findById(req.params.id);
        order.status=req.body.status;
        await order.save();
        res.json("order status changed succesfully")

    }catch(error){
        console.log(error);
        res.status(500).json({msg:error});
    }
})
module.exports=router;