const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const pool = require('../configs/db')
const transporter = require('../mails/sendVerification')

const registerUser = asyncHandler( async (req, res) => {
    const {name, email, password} = req.body
    
    if (!name || !email || !password)
    {
        return res.status(400).json({message: 'provide all feilds'})
    }

    // check if email is already taken 
    const existedUser = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    if (existedUser.rows.length > 0)
        {
            if (existedUser.rows[0].isverified)
            {
                return res.status(400).json({message: "Email is already taken!"})
            }

        // if not verified yet send otp
        const token = jwt.sign({id: existedUser.rows[0].id}, process.env.JWT_SECRET_KEY, {expiresIn: '5min'})
            
        // update password 
        const hashPassword = await bcrypt.hash(password, 10) 
        await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashPassword, existedUser.rows[0].id])

        const info = await transporter.sendMail({
            from: process.env.EMAIL, // sender address
            to: email, // list of receivers
            subject: "Verification", // Subject line
            html: `<a href='http://localhost:3000/api/user/verify/${token}'>Click here </a>`, // html body
            });

        console.log(`send verification code : ${info.messageId}`)
        return res.status(200).json({message: "Verify email is send please check it!"})
            
        }     


    // create a new user
    const hashPassword = await bcrypt.hash(password, 10) // create hash password 
    
    const newUser = await pool.query("INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *", [name, email, hashPassword])
    console.log('create a new account')
    // jwt 
    const token = jwt.sign({id: newUser.rows[0].id}, process.env.JWT_SECRET_KEY, {expiresIn: '5min'})
    const info = await transporter.sendMail({
        from: process.env.EMAIL, // sender address
        to: email, // list of receivers
        subject: "Verification", // Subject line
        html: `<a href='http://localhost:3000/api/user/verify/${token}'>Click here </a>`, // html body
        });

    console.log(`send verification code : ${info.messageId}`)
    return res.status(200).json({message: "Verify email is send please check it!"})   
})

// verify 

const verifyUser = asyncHandler( async (req, res) => {
    // check if token exist
    const {token} = req.params
    if (!token)
    {
        return res.status(400).json({message: 'token not found!'})
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
    const user = await pool.query('UPDATE users SET isverified = true WHERE id = $1 RETURNING *', [decoded.id])
    res.status(200).json(user.rows[0])
})

const loginUser = asyncHandler( async (req, res) => {
    return res.status(200).json({message: 'get user'})
})



module.exports = {registerUser, verifyUser, loginUser}