const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://Rudra:Rudra1234@cluster0.veauz5t.mongodb.net/test"
const connectToMongo = () => {
    mongoose.connect(mongoURI, (error)=>{
        if (error) {
            console.log(error);
        }
        console.log("connected to mongo successfully");
    })
}

module.exports = connectToMongo;