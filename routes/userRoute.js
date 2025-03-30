const express = require('express')
const router = express.Router()
const {registerUser,verifyUser, loginUser} = require('../controllers/userController')
const protect = require('../middlewares/protect')

// user api routes
router.post('/user/register', registerUser)
router.get('/user/verify/:token', verifyUser)
router.post('/user/login', loginUser)
router.get('/user/me', protect, (req, res) => {
    res.status(200).json(req.user)
})

module.exports = router