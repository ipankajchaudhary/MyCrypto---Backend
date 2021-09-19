const mongoose = require('mongoose')
require('dotenv').config()
const mongoURI = "mongodb+srv://Pankaj:Pankaj2002@cluster0.uehfh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

const connectToMongo = () => {
    mongoose.connect(mongoURI, () => {
        console.log("Connected")
    })
}

module.exports = connectToMongo;