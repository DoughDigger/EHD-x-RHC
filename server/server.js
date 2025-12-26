const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

const DB_FILE = path.join(__dirname, 'registrations.json');

// Helper to read DB
const readDB = () => {
    if (!fs.existsSync(DB_FILE)) {
        return [];
    }
    const data = fs.readFileSync(DB_FILE);
    return JSON.parse(data);
};

// Helper to write DB
const writeDB = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// Admin credentials
const ADMIN_CREDENTIALS = {
    username: 'EHDAdmin',
    password: 'Toms2026!'
};

// Register endpoint
app.post('/api/register', (req, res) => {
    try {
        const newRegistration = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            ...req.body
        };

        const registrations = readDB();
        registrations.push(newRegistration);
        writeDB(registrations);

        console.log('New registration received:', newRegistration.playerName);
        res.status(201).json({ message: 'Registration successful', id: newRegistration.id });
    } catch (error) {
        console.error('Error saving registration:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Login endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        res.status(200).json({ message: 'Login successful', token: 'admin-token-123' });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Get registrations endpoint
app.get('/api/registrations', (req, res) => {
    // In a real app, verify token here. For this simple version, we'll skip token check middleware
    // but the frontend will only call this if logged in.
    try {
        const registrations = readDB();
        res.status(200).json(registrations);
    } catch (error) {
        res.status(500).json({ message: 'Error reading database' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
