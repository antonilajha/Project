const express = require('express');
const path = require('path');
const { ObjectId } = require('mongodb');
const connectToDB = require('./db');

const app = express();
const PORT = 5003; //user 


const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json'); // Or use swagger-jsdoc if generating dynamically
const bcrypt = require('bcryptjs');

// Middleware to parse JSON body
app.use(express.json());

// 1. Read: Get all users
app.get('/users', async (req, res) => {
    try {
        const db = await connectToDB();
        const collection = db.collection('prijava');
        const users = await collection.find({}).toArray();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Read: Get a single user by ID
app.get('/users/:id', async (req, res) => {
    try {
        const db = await connectToDB();
        const collection = db.collection('prijava');
        const user = await collection.findOne({ _id: new ObjectId(req.params.id) });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Create: Add a new user
app.post('/ADDusers', async (req, res) => {
    try {
        const db = await connectToDB();
        const collection = db.collection('prijava');
        const { Username, Password, ISAdmin } = req.body;

        // Validate input
        if (!Username || !Password) {
            return res.status(400).json({ error: 'Username and Password are required' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(Password, 10);

        // Create a new user object
        const newUser = {
            Username,
            Password, 
            PasswordHash: hashedPassword, 
            ISAdmin
        };

        // Insert the user into the database
        const result = await collection.insertOne(newUser);
        res.status(201).json({ message: 'User added successfully', user: result.ops[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Update: Modify a user by ID
app.put('/UPDusers/:id', async (req, res) => {
    try {
        const db = await connectToDB();
        const collection = db.collection('prijava');
        const updatedUser = req.body;

        const result = await collection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: updatedUser }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. Delete: Remove a user by ID
app.delete('/DELusers/:id', async (req, res) => {
    try {
        const db = await connectToDB();
        const collection = db.collection('prijava');

        const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



app.post('/registerUser', async (req, res) => {
    try {
        const db = await connectToDB();
        const collection = db.collection('prijava');
        const { Username, Password } = req.body;

        // Check if the username already exists
        const existingUser = await collection.findOne({ Username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(Password, 10);

        // Create a new user
        const newUser = { Username, Password: hashedPassword };
        const result = await collection.insertOne(newUser);

        res.status(201).json({ message: 'User registered successfully', user: result.ops[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const { authenticateToken } = require('./auth');
const { generateToken } = require('./auth');


app.post('/loginUser', async (req, res) => {
    try {
        const db = await connectToDB();
        const collection = db.collection('prijava');
        const { Username, Password } = req.body;

        // Find the user by username
        const user = await collection.findOne({ Username });
        if (!user) {
            return res.status(404).json({ error: 'Invalid username or password' });
        }

        // Verify the password
        const isPasswordValid = await bcrypt.compare(Password, user.Password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Generate a JWT
        const token = generateToken(user);

        res.json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
