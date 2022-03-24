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

    if (acno in database) {
        if (pswd == database[acno]["password"]) {
            database[acno]["balance"] += amt
            database[acno]["transcation"].push({
                amt: amt,
                type: "CREDIT"
            })
            return {
                statusCode: 200,
                status: true,
                message: amount + " is Successfully deposited.. new balance is " + database[acno]["balance"]
            }

        } else {
            return {
                statusCode: 422,
                status: false,
                message: "Incorrect password"
            }
        }
    } else {
        return {
            statusCode: 422,
            status: false,
            message: "User does not exist"
        }

    }
}
//  withdraw definition
const withdraw = (req, acno, pswd, amount) => {

    let amt = parseInt(amount)
    var currentAcno = req.currentAcno
    if (acno in database) {
        if (pswd == database[acno]["password"]) {
            if (currentAcno == acno) {
                if (database[acno]["balance"] > amt) {
                    database[acno]["balance"] -= amount
                    database[acno]["transcation"].push({
                        amt: amount,
                        type: "DEBIT"
                    })
                    // console.log(database[acno]["transcation"]);
                    console.log(database);
                    return {
                        statusCode: 200,
                        status: true,
                        message: amount + " is Successfully debited.. new balance is " + database[acno]["balance"]
                    }
                } else {
                    return {
                        statusCode: 422,
                        status: false,
                        message: "Insufficent Balance.."
                    }
                }
            } else {
                return {
                    statusCode: 422,
                    status: false,
                    message: "Operation denied.."
                }

            }

        } else {
            return {
                statusCode: 422,
                status: false,
                message: "Incorrect password"
            }
        }
    } else {
        return {
            statusCode: 422,
            status: false,
            message: "User does not exist"
        }

    }
}

// Transcation definition
const getTranscation = (acno) => {
    if (acno in database) {
        return {
            statusCode: 200,
            status: true,
            transcation: database[acno]["transcation"]
        }
    } else {
        return {
            statusCode: 422,
            status: false,
            message: "User does not exist"
        }
    }
}

// In nodeJs we are not using class concept so we are exporting functions here 
module.exports = {
    register,
    login,
    deposit,
    withdraw,
    getTranscation
}