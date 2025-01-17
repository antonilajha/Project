const express = require('express');
const path = require('path');
const { ObjectId } = require('mongodb');
const connectToDB = require('./db');
const authenticateToken = require('./auth');

const app = express();
const PORT = 5002;

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const bcrypt = require('bcryptjs');

// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

console.log('Swagger docs available at http://localhost:5002/api-docs');

// Middleware to parse JSON body
app.use(express.json());

// Serve the frontend files
app.get('/DealvnoMesto', (req, res) => {
    res.sendFile(path.join(__dirname, '../DelavnoMesto.html'));
});

app.get('/Uporabnik', (req, res) => {
    res.sendFile(path.join(__dirname, '../Uporabnik.html'));
});

app.get('/graf', (req, res) => {
    res.sendFile(path.join(__dirname, '../graf.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../regester.html'));
});

app.get('/protactedPage', authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../protactedPage.html'));
});

// Example protected route
app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'You have access to this protected route', user: req.user });
});

// Handle 404 errors - this should be the last route
app.use((req, res) => {
    res.status(404).send('File not found');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});