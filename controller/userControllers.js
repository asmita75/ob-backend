const router = require('express').Router();
const User = require('../models/userModel');
const jwt = require ('jsonwebtoken');
const nodemailer =require('nodemailer');
//bcrypt
const bcrypt=require("bcrypt");

// create a test route
router.get('/hello', (reg, res) => {
    res.send('welcome to API ');
});


router.post('/register',async(req, res) => {
    console.log(req.body);
    // res.send('user registration');

    const { fname, lname, password, email } = req.body;

    if (!fname || !lname || !password || !email) {
        return res.status(400).json({ msg: "please enter all feilds" });
    }

    try {

        const existingUser = await User.findOne({ email });
        //checking existing user
        if (existingUser) {
            return res.status(400).json({ msg: "user already exist" });
        }

        //hash the password
        const salt = await bcrypt.genSaltSync(10);
        const passwordHash = await bcrypt.hashSync(password, salt);


        const newUser = new User({
            fname:fname,
            lname:lname,
            password:passwordHash,
            email:email
        });

        newUser.save();
        res.json("user registration success");

    } catch (error) {
        res.status(500).json("user registration failed");
    }


    // console.log{fname};
});

router.post('/login',async(req, res) => {
    console.log(req.body);

    //destructing
    const { email, password} = req.body;

    if ( !password || !email) {
        return res.status(400).json({ msg: "please enter all feilds" });
    }
    try{
        const user = await User.findOne({email});

        //check if user exists 
        if(!user){
            return res.status(400).json({msg:"user doesn't exit"});
        }

        //check if password is correct
        const isCorrectPassword = await bcrypt.compare(password,user.password)
        if(!isCorrectPassword){
            await res.status(400).json({msg: "invalid password"});
        }

        //creating a taken and signing it with jwt 
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            expire: new Date(Date.now() + 24*60*60*1000)
        });

        //Send user data
        res.json({
            token,
            user,
            msg: "user login success"
        });

    }catch(error){
        console.log(error);
    }
});

  
    // forgot password
router.post("/forgot_password", async (req, res) => {

    // destructuring
    const { email } = req.body;
  
    // validation
    if (!email) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }
  
    try {
      //  check existing user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "User does not exists" });
      }
  
      // create a token
      const secret = process.env.JWT_SECRET + user.password;
      const token = jwt.sign({ email: user.email, id: user._id }, secret, { expiresIn: "10m" });
  
      // create a link
      const link = `http://localhost:5000/api/user/reset-password/${user._id}/${token}`;
    //   console.log(link);
    const transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:'testas2080@gmail.com',
            pass:'ngcfdeyhyyrdfocz'
        }
    });

    var mailOptions ={
        from:'testas2080@gmail.com',
        to:email,
        subject:'Reset Password',
        text:`please cick on the link to reset your password:${link}`
    }
    //send email
    transporter.sendMail(mailOptions,(error,info)=>{
        if(error){
            console.log(error);
            res.status(500).json("Email not sent");
        }else{
            console.log("email sent"+info.response);
        }
    })

      res.json("Verification email sent")
  
    } catch (error) {
      res.status(500).json("Verification email not sent");
    }
  })
  
  
  // update password
  router.get("/reset-password/:id/:token", async (req, res) => {
    // get id and token from params
    const { id, token } = req.params;
  
    // if id or token is not provided
    const oldUser = await User.findOne({ _id: id });
    if (!oldUser) {
      return res.status(400).json({ msg: "User does not exists" });
    }
  
    // verify token
    const secret = process.env.JWT_SECRET + oldUser.password;
    try {
      // verify token
      const verifyToken = jwt.verify(token, secret);
      // if token is verified
      if (verifyToken) {
        res.render('index', { email: verifyToken.email })
      }
  
    } catch (error) {
      console.log(error);
      res.status(500).json("Password reset link not verified");
    }
  })

  //update password
  router.post("/reset-password/:id/:token",async(req,res)=>{
    const {id,token}=req.params;
    const {password}=req.body;

    //if id or token is not provided
    const oldUser = await User.findOne({_id:id});
    if(!oldUser)
    {
        return res.status(400).json({msg: "user doesn't exist"});
    }

    //create a token verify
    const secret = process.env.JWT_SECRET + oldUser.password;
    try{
        const verifyToken = jwt.verify(token, secret);

        //if token is verified
        const hashedPassword = await bcrypt.hashSync(password,10);
        await User.updateOne({_id:id}, {$set:{password:hashedPassword}})
        res.json("password reset successfully");
    }
    catch(error){
        res.status(500).jsnon("password reset failed");
    }

  });

module.exports = router;