// Simple Express server for eBuzzzMedia
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const emailService = require('./emailService'); // Import the email service
require('dotenv').config({ path: path.resolve(__dirname, './.env') });

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// UPDATED: Serve static files - first check the public directory, then root
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '..')));

// Define MongoDB connection options
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 15000, // Timeout after 15 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
};

// Create schema for submissions
const submissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: String,
  date: String,
  time: String,
  type: { type: String, enum: ['contact', 'consultation', 'custom-package'] },
  services: Object,
  createdAt: { type: Date, default: Date.now }
});

// Create model outside of the connection logic to avoid recreation
const Submission = mongoose.model('Submission', submissionSchema);

// Simple in-memory storage for fallback mode
const submissions = [];

// Connect to MongoDB
let isConnectedToMongo = false;

// Print important server configuration details without sensitive information
console.log('Server configuration:');
console.log('- PORT:', PORT);
console.log('- MongoDB Connection:', process.env.MONGODB_URI ? 'Configured' : 'Not configured');
console.log('- Email Service:', process.env.EMAIL_HOST ? 'Configured' : 'Not configured');

if (process.env.MONGODB_URI) {
  // Connect to MongoDB with improved options
  mongoose.connect(process.env.MONGODB_URI, mongoOptions)
    .then(() => {
      console.log('Connected to MongoDB successfully');
      isConnectedToMongo = true;
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
      console.log('Running in fallback mode due to MongoDB connection issues');
    });
  
  // Add connection event listeners for better error handling
  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
    isConnectedToMongo = false;
  });
  
  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected. Attempting to reconnect...');
    isConnectedToMongo = false;
  });
  
  mongoose.connection.on('reconnected', () => {
    console.log('MongoDB reconnected successfully');
    isConnectedToMongo = true;
  });
} else {
  // Fallback if no MongoDB URI is provided
  console.log('No MongoDB URI found. Running in demo mode.');
}

// Route for form submissions - Updated with better email error handling
app.post('/api/submit', async (req, res) => {
  try {
    const formData = req.body;
    let submissionId = null;
    
    console.log('Received form submission:', {
      type: formData.type,
      name: formData.name,
      email: formData.email,
      timestamp: new Date().toISOString()
    });
    
    // Save submission to database or in-memory storage
    if (isConnectedToMongo) {
      try {
        // Save submission to MongoDB
        const submission = new Submission(formData);
        await submission.save();
        submissionId = submission._id;
        console.log('Submission saved to MongoDB with ID:', submissionId);
      } catch (mongoError) {
        console.error('MongoDB save error:', mongoError);
        // Fall back to in-memory storage if MongoDB save fails
        const fallbackSubmission = fallbackSave(req);
        submissionId = fallbackSubmission.id;
        console.log('Fallback to in-memory storage with ID:', submissionId);
      }
    } else {
      // Use fallback mode if not connected to MongoDB
      const fallbackSubmission = fallbackSave(req);
      submissionId = fallbackSubmission.id;
      console.log('Using in-memory storage with ID:', submissionId);
    }
    
    // Send emails with improved error handling
    let emailSuccess = false;
    let emailError = null;
    
    try {
      // Determine what type of form was submitted and set subject accordingly
      let adminSubject = 'New Form Submission';
      
      switch(formData.type) {
        case 'contact':
          adminSubject = 'New Contact Form Submission';
          break;
        case 'consultation':
          adminSubject = 'New Consultation Booking';
          break;
        case 'custom-package':
          adminSubject = 'New Custom Package Request';
          break;
      }
      
      console.log('Attempting to send emails for submission...');
      
      // Send notification email to admin
      const adminEmailResult = await emailService.sendAdminNotification(adminSubject, formData);
      console.log('Admin notification email sent with ID:', adminEmailResult.messageId);
      
      // Send confirmation email to user
      const userEmailResult = await emailService.sendUserConfirmation(formData);
      console.log('User confirmation email sent with ID:', userEmailResult.messageId);
      
      console.log('All emails sent successfully for submission ID:', submissionId);
      emailSuccess = true;
    } catch (error) {
      emailError = error;
      console.error('Error sending emails:', error);
      console.error('Email error details:', error.message);
      // We'll still return success to the client even if emails fail
      // This way the form submission is still recorded
    }
    
    // Return success response with details about email status
    res.status(201).json({ 
      success: true,
      message: emailSuccess 
        ? 'Form submitted and notifications sent successfully' 
        : 'Form submitted but email notifications failed. We will contact you shortly.',
      emailSuccess: emailSuccess,
      id: submissionId,
      emailError: emailError ? emailError.message : null
    });
  } catch (error) {
    console.error('Form submission error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error submitting form',
      error: error.message
    });
  }
});

// Fallback save function for in-memory storage
function fallbackSave(req) {
  // Add timestamp and ID
  const submission = {
    ...req.body,
    id: Date.now().toString(),
    createdAt: new Date()
  };
  
  // Save to in-memory array
  submissions.push(submission);
  console.log('New submission saved to in-memory storage:', submission);
  
  return submission;
}

// Route to view all submissions (demo only)
app.get('/api/submissions', (req, res) => {
  if (isConnectedToMongo) {
    Submission.find({})
      .sort({ createdAt: -1 })
      .then(docs => res.json(docs))
      .catch(err => {
        console.error('Error fetching submissions:', err);
        res.json(submissions); // Fallback to in-memory if MongoDB query fails
      });
  } else {
    res.json(submissions);
  }
});

// Add a health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'up',
    timestamp: new Date().toISOString(),
    mongodb: isConnectedToMongo ? 'connected' : 'disconnected',
    emailService: emailService.testEmailConnection() ? 'configured' : 'not configured'
  });
});

// UPDATED: Serve the main index.html file from the root directory for all client-side routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser`);
  
  // Test email connection at startup
  emailService.testEmailConnection()
    .then(success => {
      if (success) {
        console.log('Email service configured correctly');
      } else {
        console.error('Email service configuration has issues');
      }
    });
});

module.exports = app;