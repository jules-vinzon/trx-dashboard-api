import { config } from 'dotenv';
import { MongoClient } from 'mongodb';

config();

let mongoClient;
let db;

export default async function connectDB() {
    try {
        mongoClient = new MongoClient(process.env.DB_URI);
        await mongoClient.connect();
        db = mongoClient.db('dashboard'); 
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB Connection Failed:', error);
        process.exit(1);
    }
}

export const ready = connectDB();

export const getDB = () => {
    if (!db) throw new Error('Database not initialized');
    return db;
};
