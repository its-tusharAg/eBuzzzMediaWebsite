# eBuzzzMedia

A full-stack website for a creative agency that offers marketing, development, and writing services.

## Features

- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark/Light Mode**: Toggle between dark and light themes
- **Interactive UI**: Custom cursors, smooth animations, and parallax effects
- **Services Section**: Showcase of agency services (Marketing, Development, Writing)
- **Package Selection**: Pre-made packages with pricing
- **Custom Package Builder**: Allow clients to select specific services
- **Consultation Booking**: Form for scheduling consultations
- **Contact Form**: Easy way for clients to reach out
- **Backend Integration**: Full Node.js backend with MongoDB database
- **Email Notifications**: Automated emails for form submissions and consultations

## Tech Stack

### Frontend
- HTML5, CSS3, JavaScript
- GSAP (GreenSock Animation Platform)
- Particles.js
- Font Awesome
- Google Fonts

### Backend
- Node.js with Express
- MongoDB with Mongoose
- Nodemailer for email notifications

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- MongoDB (local or Atlas)
- SMTP service for emails (configured in .env)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd ebuzzzmedia
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on the following example and fill in your values:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/ebuzzzmedia
   EMAIL_HOST=smtp.example.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your-email@example.com
   EMAIL_PASSWORD=your-password
   COMPANY_EMAIL=hello@ebuzzzmedia.com
   ADMIN_EMAIL=admin@ebuzzzmedia.com
   COMPANY_PHONE=+1 (555) 123-4567
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open http://localhost:3000 in your browser.

## Project Structure

```
ebuzzzmedia/
├── public/                     # Frontend static files
│   ├── index.html              # Main HTML file
│   ├── styles.css              # Main stylesheet
│   ├── script.js               # Main JavaScript file
│   ├── api-client.js           # API client for form submissions
│   ├── simplified-form-handler.js # Form handling logic
│   ├── name-updater.js         # Script to update site name references
│   ├── cursor animation/       # Custom cursor files
│   │   ├── cursor.css          # Cursor styles
│   │   └── cursor.js           # Cursor functionality
├── server/                     # Backend files
│   ├── server.js               # Main server file
│   ├── emailService.js         # Email notification service
├── package.json                # Project configuration
└── package-lock.json           # Dependency lock file
```

## Features Implementation

### Custom Cursor
The website features a custom cursor with animated trails and hover effects, enhancing the user experience.

### Interactive Animations
Using GSAP, the site includes scroll-triggered animations, magnetic buttons, and smooth transitions.

### Dark/Light Mode
Users can toggle between dark and light themes with a smooth transition animation.

### Form Submissions
All forms are handled with AJAX and provide visual feedback. In development mode, submissions are stored in memory, while production uses MongoDB.

### Email Notifications
When a form is submitted, notifications are sent to administrators and confirmation emails to users.

## License

This project is licensed under the MIT License - see the LICENSE file for details.