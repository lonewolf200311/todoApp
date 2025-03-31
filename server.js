const express = require('express')
require('dotenv').config()
const cookiePhrser = require('cookie-parser')
const cors = require('cors')
const app = express()

// port
const port = process.env.PORT || 3000

// middlewares
app.use(express.json())
app.use(cookiePhrser())
app.use(cors({credentials: true}))
// add routes
app.use('/api/', require('./routes/userRoute'))
app.use('/api/', require('./routes/todoRoute'))

// listen to server
app.listen(port, () => console.log(`The port is running at ${port}`))
