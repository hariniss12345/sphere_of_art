// Import the Nodemailer module to handle email functionality
import nodemailer from 'nodemailer';

import dotenv from 'dotenv'
dotenv.config()

// Create a transporter (Gmail example)
// This transporter is configured to use Gmail as the email service
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Email service provider
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address (environment variable)
    pass: process.env.EMAIL_PASSWORD, // Your Gmail password or app password (environment variable)
  },
});

// Utility function to send an email
// This function takes in recipient email, subject, text body, and optional HTML body
const sendEmail = async (to, subject, text, html) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender's email address
    to, // Recipient's email address
    subject, // Subject of the email
    text, // Plain text content
    html, // HTML content (optional)
  };

  try {
    // Attempt to send the email using the transporter
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
  } catch (error) {
    // Log the error and throw a custom error message if email sending fails
    console.error('Error sending email:', error.message);
    throw new Error('Failed to send email');
  }
};

// Export the sendEmail function so it can be used in other parts of the application
export default sendEmail;
