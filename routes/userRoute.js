const express = require('express')
const router = express.Router()
const {registerUser,verifyUser, loginUser} = require('../controllers/userController')

router.post('/user/register', registerUser)
router.get('/user/verify/:token', verifyUser)
router.get('/user/login', loginUser)


module.exports = router