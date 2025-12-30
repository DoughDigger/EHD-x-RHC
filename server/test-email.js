const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const nodemailer = require('nodemailer');

console.log('--- LOCAL EMAIL TEST ---');
console.log('User:', process.env.EMAIL_USER);
console.log('Pass Length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    logger: true,
    debug: true
});

const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // Send to self
    subject: "Test Email from Local Computer",
    text: "If you receive this, your credentials work and the code is correct. The issue is Railway blocking the connection."
};

(async () => {
    try {
        console.log('Attempting to send email...');
        const info = await transporter.sendMail(mailOptions);
        console.log('SUCCESS! Email sent:', info.messageId);
    } catch (error) {
        console.error('FAILURE! Error sending email:', error);
    }
})();
