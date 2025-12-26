const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

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

// Delete registration endpoint
app.delete('/api/registrations/:id', (req, res) => {
    try {
        const { id } = req.params;
        let registrations = readDB(REG_DB_FILE);
        const initialLength = registrations.length;
        registrations = registrations.filter(reg => reg.id !== id);

        if (registrations.length === initialLength) {
            return res.status(404).json({ message: 'Registration not found' });
        }

        writeDB(REG_DB_FILE, registrations);
        console.log('Registration deleted:', id);
        res.status(200).json({ message: 'Registration deleted successfully' });
    } catch (error) {
        console.error('Error deleting registration:', error);
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

// Delete question endpoint
app.delete('/api/questions/:id', (req, res) => {
    try {
        const { id } = req.params;
        let questions = readDB(Q_DB_FILE);
        const initialLength = questions.length;
        questions = questions.filter(q => q.id !== id);

        if (questions.length === initialLength) {
            return res.status(404).json({ message: 'Question not found' });
        }

        writeDB(Q_DB_FILE, questions);
        console.log('Question deleted:', id);
        res.status(200).json({ message: 'Question deleted successfully' });
    } catch (error) {
        console.error('Error deleting question:', error);
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

// Export endpoints
app.get('/api/export/registrations', (req, res) => {
    try {
        const registrations = readDB(REG_DB_FILE);
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(registrations);
        XLSX.utils.book_append_sheet(wb, ws, "Registrations");

        const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Disposition', 'attachment; filename=registrations.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);
    } catch (error) {
        console.error('Error exporting registrations:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/api/export/questions', (req, res) => {
    try {
        const questions = readDB(Q_DB_FILE);
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(questions);
        XLSX.utils.book_append_sheet(wb, ws, "Questions");

        const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Disposition', 'attachment; filename=questions.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);
    } catch (error) {
        console.error('Error exporting questions:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
