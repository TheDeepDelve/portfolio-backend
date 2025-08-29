// const express = require('express');
// const nodemailer = require('nodemailer');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// const port = process.env.PORT || 8080;

// // Middleware
// // Configure CORS to allow requests only from your portfolio website
// const corsOptions = {
//   origin: 'https://TheDeepDelve.github.io', // <-- Your live frontend URL here
//   optionsSuccessStatus: 200 
// };

// app.use(cors(corsOptions)); // Enable Cross-Origin Resource Sharing
// app.use(express.json()); // To parse JSON bodies

// // POST route to handle form submissions
// app.post('/api/send-email', (req, res) => {
//     const { name, email, message } = req.body;

//     // --- Nodemailer Transport Configuration ---
//     // This transporter uses your email service credentials to send the email.
//     // You should use environment variables to keep your credentials secure.
//     const transporter = nodemailer.createTransport({
//         service: 'gmail', // Or your email provider (e.g., 'hotmail', 'yahoo')
//         auth: {
//             user: process.env.EMAIL_USER, // Your email address from .env file
//             pass: process.env.EMAIL_PASS, // Your email password or app password from .env file
//         },
//     });

//     // --- Email Content ---
//     // This is the email that you will receive.
//     const mailOptions = {
//         from: `"${name}" <${email}>`, // Sender's name and email
//         to: process.env.EMAIL_USER,    // Your receiving email address
//         subject: `New Message from Portfolio Contact Form from ${name}`,
//         html: `
//             <h2>New Contact Form Submission</h2>
//             <p><strong>Name:</strong> ${name}</p>
//             <p><strong>Email:</strong> ${email}</p>
//             <p><strong>Message:</strong></p>
//             <p>${message}</p>
//         `,
//     };

//     // --- Send the Email ---
//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             console.error("Error sending email:", error);
//             return res.status(500).send({ success: false, message: 'Something went wrong. Please try again later.' });
//         }
//         console.log('Email sent: ' + info.response);
//         res.status(200).send({ success: true, message: 'Message sent successfully!' });
//     });
// });

// app.listen(port, () => {
//     console.log(`Server is running on port: ${port}`);
// });

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- More Robust CORS Configuration ---
const allowedOrigins = [
  'http://localhost:5173', // Your local dev URL
  'https://thedeepdelve.github.io' // Your live portfolio URL
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));
app.use(express.json());

// --- Test Route ---
// You can visit your backend URL directly in a browser to see if the server is running.
app.get('/', (req, res) => {
  res.send('Backend server is running correctly!');
});

// Create a transporter object using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Use the App Password here
  },
});

// Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log('Error with email transporter configuration:', error);
  } else {
    console.log('Email transporter is ready to send messages');
  }
});

// Define the API endpoint
app.post('/api/send-email', (req, res) => {
  // --- Improved Logging ---
  console.log('Received a new contact form submission'); 

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    console.log('Submission failed: Missing fields');
    return res.status(400).json({ message: 'All fields are required' });
  }

  const mailOptions = {
    from: name,
    to: process.env.EMAIL_USER,
    subject: `New Contact Form Message from ${name}`,
    text: `You have a new message from your portfolio contact form.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ message: 'Failed to send email.', error: error.message });
    }
    console.log('Email sent:', info.response);
    res.status(200).json({ message: 'Email sent successfully!' });
  });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

