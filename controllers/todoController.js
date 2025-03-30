const asyncHandler = require('express-async-handler')
const pool = require('../configs/db')


const getAllTodo = asyncHandler(async (req, res) => {
    const todoList = await pool.query('SELECT * FROM todos WHERE user_id = $1', [req.user.user_id])
    res.status(200).json(todoList.rows)

})

const getTodo = asyncHandler(async (req, res) => {
    const {id} = req.params
    if (!id)
    {
        return res.status(400).json({message: 'Provide todo id'})
    }
    const todo = await pool.query('SELECT * FROM todos WHERE todo_id = $1', [id])
    return res.status(200).json(todo.rows)
})

const createTodo = asyncHandler( async (req, res) => {
    const {todo_name} = req.body
    if (!todo_name)
    {
        return res.status(400).json({message: 'Provide todo name'})
    }
    const todo = await pool.query('INSERT INTO todos (todo_name, user_id) VALUES ($1, $2) RETURNING *', [todo_name, req.user.user_id])
    console.log(todo.rows)
    return res.status(200).json(todo.rows[0])
})


const deleteTodo = asyncHandler(async (req, res) => {
    const {id} = req.params
    if (!id)
    {
        return res.status(400).json({message: 'Provide todo id'})
    }

    const todo = await pool.query('DELETE FROM todos WHERE todo_id = $1 RETURNING *', [id])
    return res.status(200).json(todo.rows)
})

module.exports = { getAllTodo, getTodo, createTodo, deleteTodo}