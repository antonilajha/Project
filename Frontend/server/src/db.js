const { MongoClient } = require('mongodb');

const url = process.env.MONGO_URL || 'mongodb://localhost:27017';
const dbName = 'Project';

let db;

async function connectToDB() {
    if (db) return db;
    const client = new MongoClient(url);
    await client.connect();
    console.log('Connected to MongoDB');
    db = client.db(dbName);
    return db;
}

module.exports = connectToDB;