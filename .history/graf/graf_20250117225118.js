const express = require('express');
const path = require('path');
const { ObjectId } = require('mongodb');
const connectToDB = require('./db');

const app = express();
const PORT = 5005;



const bcrypt = require('bcryptjs');




// Middleware to parse JSON body
app.use(express.json());


app.get('/TojeGraf', async (req, res) => {
    try {
        const db = await connectToDB();
        const collection = db.collection('graf');

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