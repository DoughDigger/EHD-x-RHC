const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

const REG_DB_FILE = path.join(__dirname, 'registrations.json');
const Q_DB_FILE = path.join(__dirname, 'questions.json');

// Helper to read DB
const readDB = (file) => {
    if (!fs.existsSync(file)) {
        return [];
    }
    const data = fs.readFileSync(file);
    return JSON.parse(data);
};

// Helper to write DB
const writeDB = (file, data) => {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
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

        const registrations = readDB(REG_DB_FILE);
        registrations.push(newRegistration);
        writeDB(REG_DB_FILE, registrations);

        console.log('New registration received:', newRegistration.playerName);
        res.status(201).json({ message: 'Registration successful', id: newRegistration.id });
    } catch (error) {
        console.error('Error saving registration:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Question endpoint
app.post('/api/question', (req, res) => {
    try {
        const newQuestion = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            ...req.body
        };

        const questions = readDB(Q_DB_FILE);
        questions.push(newQuestion);
        writeDB(Q_DB_FILE, questions);

        console.log('New question received from:', newQuestion.email);
        res.status(201).json({ message: 'Question submitted successfully', id: newQuestion.id });
    } catch (error) {
        console.error('Error saving question:', error);
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
    try {
        const registrations = readDB(REG_DB_FILE);
        res.status(200).json(registrations);
    } catch (error) {
        res.status(500).json({ message: 'Error reading database' });
    }
});

// Get questions endpoint
app.get('/api/questions', (req, res) => {
    try {
        const questions = readDB(Q_DB_FILE);
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ message: 'Error reading database' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
