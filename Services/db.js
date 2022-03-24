// To give Mongo db connection details

// Mongoose import
const mongoose = require('mongoose')

// state connecting string
mongoose.connect('mongodb://localhost:27017/Bank', {
    useNewUrlParser: true
})

// Model(Collection in mongodb) creation
const User = mongoose.model('User', {
    acno: Number,
    uname: String,
    password: String,
    balance: Number,
    transcation: []
})

// Export model user
module.exports = {
    User
}