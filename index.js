const express = require('express');
const connectDB = require('./database/Database');
const cors=require("cors")
const cloudinary=require('cloudinary');
const multipart=require('connect-multiparty');

// Dotenv Config
require('dotenv').config();
const app= express();

// express json
app.use(express.json());
app.use(multipart());



// cors config
const corsOptions={
    origin:true,
    credentials:true,
    optionSuccessStatus:200
};

cloudinary.config({
    cloud_name: "dtkygxhio",
    api_key: "288281391282448",
    api_secret: "O7B8xIGxuQ_ZWMpNcfCpgJShVJE"
  });

app.use(cors(corsOptions))

//set view engine
app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));

/*create route */
app.get('/', (req,res)=> {
    res.send('Hello');
});

//route
app.use('/api/user', require('./controller/userControllers'));
app.use('/api/product', require('./controller/productController'));
// middleware for oredr controller
app.use('/api/orders',require('./controller/orderController'));

//connect to database 
connectDB();

/*listen to the server, all codes must be written above listen*/
app.listen(process.env.PORT,()=>{
    console.log (`Server is running on port ${process.env.PORT}`);
});
