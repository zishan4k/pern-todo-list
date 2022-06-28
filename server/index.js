const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.APP_PORT;

//connect database using pool

const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const dbport = process.env.DB_PORT;
const database = process.env.DB_DATABASE;

const pool = new Pool({
  user: user,
  password: password,
  host: host,
  port: dbport,
  database: database,
});

// console.log(pool);

//middleware
app.use(cors());
app.use(express.json()); //req.body

//routes
//create todo
app.post('/todos', async (req, res) => {
  try {
    //console.log(req.body);
    const { description } = req.body;
    const newTodo = await pool.query(
      'INSERT INTO todo (description) VALUES ($1) RETURNING *',
      [description]
    );

    res.json(newTodo.rows[0]);
  } catch (err) {}
});

//get all todos
app.get('/todos', async (req, res) => {
  try {
    const allTodos = await pool.query('SELECT * FROM todo ORDER BY todo_id');
    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//get a todo
app.get('/todos/:id', async (req, res) => {
  try {
    // console.log(req.params);
    const { id } = req.params;
    const todo = await pool.query('SELECT * FROM todo WHERE todo_id = $1', [
      id,
    ]);
    res.json(todo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//update a todo
app.put('/todos/:id', async (req, res) => {
  try {
    // console.log(req.body);
    const { id } = req.params;
    const { description } = req.body;

    const updateTodo = pool.query(
      'UPDATE todo SET description = $1 WHERE todo_id = $2 RETURNING *',
      [description, id]
    );
    res.json('Todo was updated');
  } catch (err) {
    console.error(err.message);
  }
});

//delete a todo
app.delete('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await pool.query(
      'DELETE FROM todo WHERE todo_id = $1 RETURNING *',
      [id]
    );

    res.json('Todo was deleted!');
  } catch (error) {}
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
