const express = require('express');
const path = require('path');
const { ObjectId } = require('mongodb');
const connectToDB = require('./db');
const bcrypt = require('bcryptjs');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

// Import the auth middleware as a function
const { authenticateToken } = require('./auth');

const app = express();
const PORT = 5002;

// Middleware
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

console.log('Swagger docs available at http://localhost:5002/api-docs');

// Frontend routes
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

// Protected routes
app.get('/protactedPage', authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../protactedPage.html'));
});

app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'You have access to this protected route', user: req.user });
});

// 404 handler
app.use((req, res) => {
    res.status(404).send('File not found');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});