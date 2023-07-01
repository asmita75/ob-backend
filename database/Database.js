const mongoose= require('mongoose');

//mongoose connection
const connectDB = () => {
//connect to database
    mongoose.connect(process.env.DB_URL).then(()=>{
        console.log('DB connected'+ process.env.DB_URL);
    });
};

module.exports = connectDB;


//create a route