// import jsonwebtoken
const jwt = require('jsonwebtoken')

// Import Model

const db = require('./db')

// database = {
//     1000: { acno: 1000, uname: "Akash", password: 2000, balance: 5000, transcation: [] },
//     1001: { acno: 1001, uname: "Najad", password: 1001, balance: 1000, transcation: [] },
//     1002: { acno: 1002, uname: "favas", password: 1002, balance: 2000, transcation: [] }
// }

// Register defination

const register = (acno, pswd, uname) => {
    // Asynchronous
    return db.User.findOne({ acno })
        .then(user => {
            if (user) {
                return {
                    statusCode: 422,
                    status: false,
                    message: "User already exist!!... Please login "
                }
            } else {
                const newUser = new db.User({
                    acno,
                    uname,
                    password: pswd,
                    balance: 0,
                    transcation: []
                })
                newUser.save()
                return {
                    statusCode: 200,
                    status: true,
                    message: "Successfully Registered"
                }
            }
        })
}

// Login defination
const login = (acno, password) => {
    return db.User.findOne({ acno, password })
        .then(user => {
            if (user) {
                currentAcno = acno
                currentUserName = user.uname
                // token generation
                const token = jwt.sign({
                    currentAcno: acno
                }, 'scret123')
                console.log(token);
                return {
                    statusCode: 200,
                    status: true,
                    message: "Successfully Log In",
                    currentAcno,
                    currentUserName,
                    token
                }
            } else {
                return {
                    statusCode: 422,
                    status: false,
                    message: "Incorrect Password/Account Number"
                }
            }
        })


}

// Deposit definition
const deposit = (acno, pswd, amount) => {
    let amt = parseInt(amount)
    // asynchronous
    return db.User.findOne({ acno, password: pswd })
        .then(user => {
            if (user) {
                user.balance += amt
                user.transcation.push({
                    amt: amt,
                    type: "CREDIT"
                })
                user.save()
                return {
                    statusCode: 200,
                    status: true,
                    message: amount + " is Successfully deposited.. new balance is " + user.balance
                }
            } else {
                return {
                    statusCode: 422,
                    status: false,
                    message: "Incorrect Password/Account Number"
                }
            }
        })
}
//  withdraw definition
const withdraw = (req, acno, pswd, amount) => {

    let amt = parseInt(amount)
    var currentAcno = req.currentAcno
    return db.User.findOne({ acno, password: pswd })
        .then(user => {
            if (user) {
                if (currentAcno != acno) {
                    return {
                        statusCode: 422,
                        status: false,
                        message: "Operation denied.."
                    }
                }
                if (user.balance > amt) {
                    user.balance -= amt
                    user.transcation.push({
                        amt: amount,
                        type: "DEBIT"
                    })
                    user.save()
                    return {
                        statusCode: 200,
                        status: true,
                        message: amt + " is Successfully debited.. new balance is " + user.balance
                    }
                } else {
                    return {
                        statusCode: 422,
                        status: false,
                        message: "Insufficent balance"
                    }
                }
            }
            else {
                return {
                    statusCode: 422,
                    status: false,
                    message: "Incorrect Password/Account Number"
                }
            }
        })
}


// Transcation definition
const getTranscation = (acno) => {

    // Asynchronous
    return db.User.findOne({ acno })
        .then(user => {
            if (user) {
                return {
                    statusCode: 200,
                    status: true,
                    transcation: user.transcation
                }
            } else {
                return {
                    statusCode: 422,
                    status: false,
                    message: "User does not exist"
                }
            }
        })

}

// In nodeJs we are not using class concept so we are exporting functions here 
module.exports = {
    register,
    login,
    deposit,
    withdraw,
    getTranscation
}