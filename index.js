// import jwtweb token
const jwt = require('jsonwebtoken')

// Import express
const express = require('express')

const dataService = require('./Services/data.service')

// Import cors
const cors = require('cors')

// create an application using express
const app = express()

// Use cors to specify origin
app.use(cors({
    origin: 'http://localhost:4200'
}))

// To parse json
app.use(express.json())

// Resolve http req from client
// GET to read data
// app.get('/', (req, res) => {
//     res.send("IT'S A GET METHOD Hoiiiii Uricaa.....")
// })

// PUT to update/modify data
// app.put('/', (req, res) => {
//     res.send("IT'S A PUT METHOD Yoo..")
// })

// POST to create  data
// app.post('/', (req, res) => {
//     res.send("IT'S A POST METHOD Ha Ha...")
// })

// PATCH to update partially data
// app.patch('/', (req, res) => {
//     res.send("IT'S A PATCH METHOD Koii...")
// })

// DELETE to delete data
// app.delete('/', (req, res) => {
//     res.send("IT'S A DELETE METHOD lalala...")
// })

// Application specific Middleware
// const appMiddleware = (req, res, next) => {
//     console.log("Application specific middleware");
//     next();
// }
// app.use(appMiddleware)

// to verify token - middleware
const jwtMiddleware = (req, res, next) => {
    try {
        const token = req.headers["x-access-token"]
        // varify token
        const data = jwt.verify(token, 'scret123')
        req.currentAcno = data.currentAcno
        next()
    }
    catch {
        res.status(422).json({
            statusCode: 422,
            status: false,
            message: "please log in"
        })
    }
}

// Bank app - API  
// register - API
app.post('/register', (req, res) => {
    dataService.register(req.body.acno, req.body.pswd, req.body.uname).then(result => {
        // we need to convert the result to json format because frontend read json format only
        res.status(result.statusCode).json(result)
    })

})

// Login - API
app.post('/login', (req, res) => {
    dataService.login(req.body.acno, req.body.pswd).then(result => {
        // we need to convert the result to json format because frontend read json format only
        res.status(result.statusCode).json(result)
    })

})

// deposit - API
app.post('/deposit', jwtMiddleware, (req, res) => {
    // asynchronous
    dataService.deposit(req.body.acno, req.body.pswd, req.body.amount)
        .then(result => { res.status(result.statusCode).json(result) })

})
// Withdraw - API
app.post('/withdraw', jwtMiddleware, (req, res) => {
    dataService.withdraw(req, req.body.acno, req.body.pswd, req.body.amount)
        .then(result => {
            res.status(result.statusCode).json(result)
        })
})

// transcation - API
app.post('/transcation', jwtMiddleware, (req, res) => {
    dataService.getTranscation(req.body.acno)
        .then(result => {
            res.status(result.statusCode).json(result)
        })
})

// deleteAcc - API
app.delete('/deleteAcc/:acno', jwtMiddleware, (req, res) => {
    dataService.deleteAcc(req.params.acno)
        .then(result => {
            res.status(result.statusCode).json(result)
    })
})

// set up the port number
app.listen(3000, () => {
    console.log("Server start at port number: 3000");

})