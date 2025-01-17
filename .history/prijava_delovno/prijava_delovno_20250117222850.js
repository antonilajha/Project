const express = require('express');
const path = require('path');
const { ObjectId } = require('mongodb');
const connectToDB = require('./db');

const app = express();
const PORT = 5004;


const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json'); // Or use swagger-jsdoc if generating dynamically
const bcrypt = require('bcryptjs');


// Middleware to parse JSON body
app.use(express.json());


// 1. Read All: Get all Prijava entries
app.get('/prijava', async (req, res) => {
    try {
        const db = await connectToDB();
        const collection = db.collection('prijava_delovno');
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
        const collection = db.collection('prijava_delovno');
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
        const collection = db.collection('prijava_delovno');
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
        const collection = db.collection('prijava_delovno');
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
        const collection = db.collection('prijava_delovno');

        const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Prijava ni bila najdena.' });
        }

        res.json({ message: 'Prijava uspešno izbrisana.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});