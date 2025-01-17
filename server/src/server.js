const express = require('express');
const path = require('path');
const { ObjectId } = require('mongodb');
const connectToDB = require('./db');

const app = express();
const PORT = 5002;


const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json'); // Or use swagger-jsdoc if generating dynamically
const bcrypt = require('bcryptjs');


// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

console.log('Swagger docs available at http://localhost:5002/api-docs');

// Middleware to parse JSON body
app.use(express.json());


// Serve the frontend file
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

app.get('/protactedPage', (req, res) => {
    res.sendFile(path.join(__dirname, '../protactedPage.html'));
});


// CRUD Routes

// 1. Read: Get all users
app.get('/users', async (req, res) => {
    try {
        const db = await connectToDB();
        const collection = db.collection('Users');
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
        const collection = db.collection('Users');
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
        const collection = db.collection('Users');
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
        const collection = db.collection('Users');
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
        const collection = db.collection('Users');

        const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 1. Read All: Get all Prijava entries
app.get('/prijava', async (req, res) => {
    try {
        const db = await connectToDB();
        const collection = db.collection('Prijava');
        const prijava = await collection.find({}).toArray();
        res.json(prijava);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Read One: Get a single Prijava entry by ID
app.get('/prijava/:id', async (req, res) => {
    try {
        const db = await connectToDB();
        const collection = db.collection('Prijava');
        const entry = await collection.findOne({ _id: new ObjectId(req.params.id) });

        if (!entry) {
            return res.status(404).json({ error: 'Prijava ni bila najdena.' });
        }

        res.json(entry);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Create: Add a new Prijava entry
app.post('/ADDprijava', async (req, res) => {
    try {
        const db = await connectToDB();
        const collection = db.collection('Prijava');
        const newEntry = req.body;

        // Validate required fields
        if (!newEntry.ime || !newEntry.priimek || !newEntry.datum_rojstva || !newEntry.spol || !newEntry.namen) {
            return res.status(400).json({ error: 'Vsa polja so obvezna.' });
        }

        const result = await collection.insertOne(newEntry);
        res.status(201).json(result.ops[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Update: Modify a Prijava entry by ID
app.put('/UPDprijava/:id', async (req, res) => {
    try {
        const db = await connectToDB();
        const collection = db.collection('Prijava');
        const updatedEntry = req.body;

        // Validate required fields
        if (!updatedEntry.ime || !updatedEntry.priimek || !updatedEntry.datum_rojstva || !updatedEntry.spol || !updatedEntry.namen) {
            return res.status(400).json({ error: 'Vsa polja so obvezna.' });
        }

        const result = await collection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: updatedEntry }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Prijava ni bila najdena.' });
        }

        res.json({ message: 'Prijava uspešno posodobljena.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. Delete: Remove a Prijava entry by ID
app.delete('/DELprijava/:id', async (req, res) => {
    try {
        const db = await connectToDB();
        const collection = db.collection('Prijava');

        const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Prijava ni bila najdena.' });
        }

        res.json({ message: 'Prijava uspešno izbrisana.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/TojeGraf', async (req, res) => {
    try {
        const db = await connectToDB();
        const collection = db.collection('Prijava');

        // Fetch all documents from the collection
        const documents = await collection.find({}).toArray();

        // Log fetched documents for debugging
        console.log("Fetched documents from 'Prijava':", documents);

        // Process the data
        const groupedStats = documents.reduce((acc, doc) => {
            if (
                doc.datum_rojstva &&
                !isNaN(new Date(doc.datum_rojstva)) && // Ensure datum_rojstva is a valid date
                doc.spol &&
                ["moški", "ženska"].includes(doc.spol)
            ) {
                const date = new Date(doc.datum_rojstva).toISOString().split('T')[0];
                const gender = doc.spol;

                // Initialize date in accumulator if not present
                if (!acc[date]) {
                    acc[date] = { moški: 0, ženska: 0 };
                }

                // Increment gender count only if it doesn't exceed the actual count
                acc[date][gender] += 1;
            }
            return acc;
        }, {});

        // Remove potential duplicates in the accumulated data
        const stats = Object.entries(groupedStats).flatMap(([date, counts]) => {
            return [
                { date, gender: "moški", count: counts.moški },
                { date, gender: "ženska", count: counts.ženska }
            ];
        });

        res.json(stats); // Send processed stats
    } catch (err) {
        console.error("Error in /TojeGraf endpoint:", err.message);
        res.status(500).json({ error: err.message });
    }
});



app.post('/registerUser', async (req, res) => {
    try {
        const db = await connectToDB();
        const collection = db.collection('Users');
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
        const collection = db.collection('Users');
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



// Example protected route
app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'You have access to this protected route', user: req.user });
});

// Handle 404 errors
app.use((req, res) => {
    res.status(404).send('File not found');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
