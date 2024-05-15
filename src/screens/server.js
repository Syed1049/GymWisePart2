const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const config = {
  server: 'gymwiseserver.database.windows.net',
  database: 'GymWise',
  user: 'Gymwisedevs',
  password: 'Fypdevs.1',
  options: {
    encrypt: true,
  },
};

app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    await sql.connect(config);

    // Check if the user already exists
    const existingUser = await sql.query`SELECT * FROM Users WHERE Email = ${email}`;
    if (existingUser.recordset.length > 0) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Insert the new user
    const result = await sql.query`INSERT INTO Users (Email, Password) VALUES (${email}, ${password})`;

    res.json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).json({ success: false, message: 'Error registering user' });
  } finally {
    await sql.close();
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
