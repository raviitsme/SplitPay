const express = require('express');
const { getConnection, initPool } = require('./config/db');

const app = express();
app.use(express.json());

app.get('/', async (req, res) => {
  res.send("Backend running...");
})

app.get('/users', async (req, res) => {
  let connection;

  try {
    connection = await getConnection();
    const result = await connection.execute(
      `Select * from app_users`
    );

    res.json(result.rows); 
  } catch (err) {
    res.status(500).json({
      success : false,
      error : err
    });
  } finally {
    if(connection) {
      (await connection).close();
    }
  }
}); 

// Start server
initPool().then(() => {
  app.listen(3000, () => console.log("Listening the server at : http://localhost:3000/users"))
})