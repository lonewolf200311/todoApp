const express = require('express')
require('dotenv').config()


const app = express()

// port
const port = process.env.PORT || 3000

// middlewares
app.use(express.json())

// add routes
app.use('/api/', require('./routes/userRoute'))
 

// listen to server
app.listen(port, () => console.log(`The port is running at ${port}`))
