import { config } from "dotenv";
config({ path: "./config/config.env" });

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
}));
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
const dbUri = process.env.MONGO_URI;
mongoose.connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Successfully connected to MongoDB Atlas');
}).catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
});

const dataSchema = new mongoose.Schema({
    end_year: String,
    intensity: Number,
    sector: String,
    topic: String,
    insight: String,
    url: String,
    region: String,
    start_year: String,
    impact: String,
    added: String,
    published: String,
    country: String,
    relevance: Number,
    pestle: String,
    source: String,
    title: String,
    likelihood: Number,
}, { collection: 'Dashboard' });

const Data = mongoose.model('Data', dataSchema);

// Endpoint to fetch data with optional filters
app.get('/data', async (req, res) => {
    const filters = req.query;
    const query = {};

    // Apply filters to the query
    for (const key in filters) {
        if (filters[key]) {
            query[key] = filters[key];
        }
    }

   

    try {
        const data = await Data.find(query);
        console.log("Data fetched from MongoDB:", data);
        res.json(data);
    } catch (err) {
        console.error("Error fetching data:", err);
        res.status(500).json({ message: err.message });
    }
});

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server listening at port ${process.env.PORT}`);
});
