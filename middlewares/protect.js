
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const pool = require('../configs/db')

const protect = asyncHandler( async (req, res, next) => {
    const token = req.cookies.token
    if (!token)
    {
        return res.status(400).json({message: 'Not auth, no token'})
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const userQuery = await pool.query('SELECT * FROM users WHERE user_id = $1', [decoded.id])
        if (userQuery.rows.length < 1)
        {
            return res.status(404).json({message: 'user not found!'})
        }

        
        req.user = userQuery.rows[0]
        next()

        
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
    
})

module.exports = protect