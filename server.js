const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // To parse JSON bodies

// POST route to handle form submissions
app.post('/api/send-email', (req, res) => {
    const { name, email, message } = req.body;

    // --- Nodemailer Transport Configuration ---
    // This transporter uses your email service credentials to send the email.
    // You should use environment variables to keep your credentials secure.
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Or your email provider (e.g., 'hotmail', 'yahoo')
        auth: {
            user: process.env.EMAIL_USER, // Your email address from .env file
            pass: process.env.EMAIL_PASS, // Your email password or app password from .env file
        },
    });

    // --- Email Content ---
    // This is the email that you will receive.
    const mailOptions = {
        from: `"${name}" <${email}>`, // Sender's name and email
        to: process.env.EMAIL_USER,    // Your receiving email address
        subject: `New Message from Portfolio Contact Form from ${name}`,
        html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
        `,
    };

    // --- Send the Email ---
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
            return res.status(500).send({ success: false, message: 'Something went wrong. Please try again later.' });
        }
        console.log('Email sent: ' + info.response);
        res.status(200).send({ success: true, message: 'Message sent successfully!' });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
