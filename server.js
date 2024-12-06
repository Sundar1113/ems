const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Replace with your MySQL username
  password: '', // Replace with your MySQL password
  database: 'employee',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Create employees Table
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(10) NOT NULL,
    department VARCHAR(50) NOT NULL,
    date_of_joining DATE NOT NULL,
    role VARCHAR(50) NOT NULL
  )
`;

db.query(createTableQuery, (err) => {
  if (err) throw err;
  console.log('Employees table created or already exists.');
});

// API Endpoints
// Add Employee
app.post('/api/employees', (req, res) => {
  const { employee_id, name, email, phone, department, date_of_joining, role } = req.body;

  // Check for duplicate Employee ID or Email
  const checkQuery = SELECT * FROM employees WHERE employee_id = ? OR email = ?;
  db.query(checkQuery, [employee_id, email], (err, results) => {
    if (err) return res.status(500).send('Database error');
    if (results.length > 0) {
      return res.status(400).send('Employee ID or Email already exists');
    }

    // Insert new employee
    const insertQuery = `INSERT INTO employees (employee_id, name, email, phone, department, date_of_joining, role)
                         VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.query(insertQuery, [employee_id, name, email, phone, department, date_of_joining, role], (err) => {
      if (err) return res.status(500).send('Failed to add employee');
      res.status(201).send('Employee added successfully');
    });
  });
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(Server running on http://localhost:${PORT});
});
  server.js
