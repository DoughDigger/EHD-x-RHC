// Load environment variables
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
// const path = require('path'); // Already imported at top
const XLSX = require('xlsx');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3001;

console.log('Server starting...');
console.log('Email User Configured:', process.env.EMAIL_USER ? 'Yes' : 'No');
console.log('Email Pass Configured:', process.env.EMAIL_PASS ? 'Yes' : 'No');
console.log('API Base URL:', process.env.API_BASE_URL);

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
    : ['http://localhost:3000'];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
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

// Admin credentials from environment variables
const ADMIN_CREDENTIALS = {
    username: process.env.ADMIN_USERNAME || 'EHDAdmin',
    password: process.env.ADMIN_PASSWORD || 'Toms2026!'
};

// Register endpoint
app.post('/api/register', (req, res) => {
    console.log('Incoming registration request from:', req.body.email);
    try {
        // Calculate player and guest counts
        let playerCount = 1;
        let guestCount = '';

        const packageName = req.body.packageName || '';
        if (packageName === '1 Player + 1 Parent') {
            guestCount = 1;
        } else if (packageName === '1 Player + 2 Guests') {
            guestCount = 2;
        } else if (packageName === '1 Player + 3 Guests') {
            guestCount = 3;
        }
        // If 'Other', guestCount remains '' (empty string) as requested

        const newRegistration = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            confirmationToken: crypto.randomBytes(32).toString('hex'),
            confirmed: false,
            playerCount,
            guestCount,
            ...req.body
        };

        const registrations = readDB(REG_DB_FILE);
        registrations.push(newRegistration);
        writeDB(REG_DB_FILE, registrations);

        console.log('New registration received:', newRegistration.playerName);

        // Send confirmation email (async, don't wait for it to respond to client)
        sendConfirmationEmail(newRegistration);

        res.status(201).json({ message: 'Registration successful', id: newRegistration.id });
    } catch (error) {
        console.error('Error saving registration:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Resend confirmation email endpoint
app.post('/api/resend-email/:id', (req, res) => {
    try {
        const { id } = req.params;
        const registrations = readDB(REG_DB_FILE);
        const registration = registrations.find(reg => reg.id === id);

        if (!registration) {
            return res.status(404).json({ message: 'Registration not found' });
        }

        // Send confirmation email
        sendConfirmationEmail(registration);
        console.log('Resent confirmation email to:', registration.email);

        res.status(200).json({ message: 'Email resent successfully' });
    } catch (error) {
        console.error('Error resending email:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update registration endpoint
app.put('/api/registrations/:id', (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const registrations = readDB(REG_DB_FILE);
        const index = registrations.findIndex(reg => reg.id === id);

        if (index === -1) {
            return res.status(404).json({ message: 'Registration not found' });
        }

        // Update fields
        registrations[index] = { ...registrations[index], ...updates };

        // Recalculate guest counts if package changed
        if (updates.packageName) {
            let playerCount = 1;
            let guestCount = '';
            if (updates.packageName === '1 Player + 1 Parent') {
                guestCount = 1;
            } else if (updates.packageName === '1 Player + 2 Guests') {
                guestCount = 2;
            } else if (updates.packageName === '1 Player + 3 Guests') {
                guestCount = 3;
            }
            registrations[index].playerCount = playerCount;
            registrations[index].guestCount = guestCount;
        }

        writeDB(REG_DB_FILE, registrations);
        console.log('Registration updated:', id);

        res.status(200).json(registrations[index]);
    } catch (error) {
        console.error('Error updating registration:', error);
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

// Confirm email endpoint
app.get('/api/confirm-email', (req, res) => {
    try {
        const { token } = req.query;
        if (!token) {
            return res.status(400).send('Invalid token');
        }

        let registrations = readDB(REG_DB_FILE);
        const registration = registrations.find(reg => reg.confirmationToken === token);

        if (!registration) {
            return res.status(404).send('Registration not found or invalid token');
        }

        if (registration.confirmed) {
            return res.send('<h1>Email already confirmed!</h1><p>You can close this window.</p>');
        }

        // Update registration
        registration.confirmed = true;
        // Persist changes
        writeDB(REG_DB_FILE, registrations);

        // Simple success page
        res.send(`
            <html>
                <body style="font-family: Arial, sans-serif; background-color: #0f1025; color: white; text-align: center; padding-top: 50px;">
                    <h1 style="color: #4fb7b3;">Email Confirmed!</h1>
                    <p>Thank you, ${registration.parentFirstName}. Your registration for ${registration.playerName} is now confirmed.</p>
                    <p>We will be in touch shortly.</p>
                </body>
            </html>
        `);
    } catch (error) {
        console.error('Error confirming email:', error);
        res.status(500).send('Internal server error');
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

// Email Transporter Setup
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    logger: true, // Log to console
    debug: true   // Include SMTP traffic in logs
});

// Email Template Function
const createEmailTemplate = (data) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: 'Arial', sans-serif; background-color: #0f1025; color: #ffffff; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background-color: #1a1b3b; }
            .header { background-color: #1a1b3b; padding: 20px; text-align: center; border-bottom: 2px solid #4fb7b3; }
            .content { padding: 30px; }
            .footer { background-color: #0f1025; padding: 20px; text-align: center; color: #8892b0; font-size: 12px; }
            h1 { color: #ffffff; margin: 0; text-transform: uppercase; letter-spacing: 2px; }
            h2 { color: #4fb7b3; margin-top: 0; }
            p { line-height: 1.6; color: #cbd5e1; }
            .details { background-color: rgba(79, 183, 179, 0.1); padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid rgba(79, 183, 179, 0.3); }
            .label { color: #4fb7b3; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
            .value { color: #ffffff; font-size: 16px; margin-bottom: 10px; display: block; }
            .button { display: inline-block; padding: 12px 24px; background-color: #4fb7b3; color: #000000; text-decoration: none; font-weight: bold; border-radius: 6px; text-transform: uppercase; margin-top: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>EHD Tour 2026</h1>
            </div>
            <div class="content">
                <h2>Registration Confirmed</h2>
                <p>Hi ${data.parentFirstName},</p>
                <p>Thank you for registering <strong>${data.playerName}</strong> for the EHD x RHC 2026 Spring Tour. We have successfully received your information.</p>
                
                <div class="details">
                    <span class="label">Parent Name</span>
                    <span class="value">${data.parentFirstName} ${data.parentLastName}</span>

                    <span class="label">Contact Email</span>
                    <span class="value">${data.email}</span>

                    <span class="label">Package</span>
                    <span class="value">${data.packageName || 'Standard Package'}</span>
                    ${data.packageName === 'Other' && data.packageOther ? `
                    <span class="label">Package Details</span>
                    <span class="value">${data.packageOther}</span>
                    ` : ''}
                    
                    <span class="label">Player Name</span>
                    <span class="value">${data.playerName}</span>

                    <span class="label">Level</span>
                    <span class="value">${data.level} ${data.level === 'Other' ? `(${data.levelOther})` : ''}</span>

                    <span class="label">Current League</span>
                    <span class="value">${data.playerCurrentLeague}</span>
                    
                    <span class="label">Team</span>
                    <span class="value">${data.team}</span>
                </div>

                <p>Please confirm your email address by clicking the button below:</p>
                
                <a href="${process.env.API_BASE_URL || `http://localhost:${PORT}`}/api/confirm-email?token=${data.confirmationToken}" class="button">Confirm Email</a>
            </div>
            <div class="footer">
                <p>&copy; 2026 EHD Tour. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

const sendConfirmationEmail = async (registrationData) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('Email credentials not set. Skipping email.');
        return;
    }

    try {
        const info = await transporter.sendMail({
            from: '"EHD Tour Registration" <' + process.env.EMAIL_USER + '>',
            to: registrationData.email,
            subject: "Registration Confirmed - EHD Tour 2026",
            html: createEmailTemplate(registrationData),
        });
        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};


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
