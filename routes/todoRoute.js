const express = require("express")
const router = express.Router()
const {getAllTodo, getTodo, createTodo, deleteTodo} = require('../controllers/todoController')
const protect  = require('../middlewares/protect')

router.get('/todo/get_all', protect, getAllTodo)
router.get('/todo/get/:id', protect, getTodo)
router.post('/todo/create', protect, createTodo)
router.delete('/todo/delete/:id', protect, deleteTodo)
module.exports = router