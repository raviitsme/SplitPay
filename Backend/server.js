const express = require('express');
const { getConnection, initPool } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cors({
  origin : 'http://localhost:5500',
  methods : ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials : true
}))
app.use(cookieParser());
app.use(express.json());

app.get('/', async (req, res) => {
  res.send("Backend running...");
})

// app.get('/users', async (req, res) => {
//   let connection;

//   try {
//     connection = await getConnection();
//     const result = await connection.execute(
//       `Select * from app_users`
//     );

//     res.json(result.rows); 
//   } catch (err) {
//     res.status(500).json({
//       success : false,
//       error : err
//     });
//   } finally {
//     if(connection) {
//       (await connection).close();
//     }
//   }
// }); 

app.use('/authentication', authRoutes);

app.use('/dashboard', dashboardRoutes);

// Start server
initPool().then(() => {
  app.listen(3000, () => console.log("Listening the server at : http://localhost:3000"))
})