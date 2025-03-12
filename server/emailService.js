// Email Service for eBuzzzMedia form submissions
const nodemailer = require('nodemailer');
require('dotenv').config();

// IMPORTANT: You need to replace 'your-actual-password-here' with your real Hostinger password
// This approach bypasses environment variable issues
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || 'oneplus11Tplus@';

// Set up explicit configuration for Hostinger SMTP
const smtpConfig = {
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: 'tushar@ebuzzzmedia.com',
    pass: EMAIL_PASSWORD
  }
};

// Check for empty password and log warning
if (!EMAIL_PASSWORD || EMAIL_PASSWORD === 'your-actual-password-here') {
  console.error('⚠️ WARNING: Email password is missing or using placeholder! Please set a real password.');
}

// Log the SMTP configuration (excluding password for security)
console.log('SMTP Configuration:');
console.log('- Host:', smtpConfig.host);
console.log('- Port:', smtpConfig.port);
console.log('- Secure:', smtpConfig.secure);
console.log('- User:', smtpConfig.auth.user);
console.log('- Password:', EMAIL_PASSWORD ? 'Password is set (not shown for security)' : 'No password set ⚠️');

// Create transporter object with explicit credentials
const transporter = nodemailer.createTransport(smtpConfig);

// Company information - Updated to use tushar@ebuzzzmedia.com directly
const companyInfo = {
  name: 'eBuzzzMedia',
  email: 'tushar@ebuzzzmedia.com',
  adminEmail: 'tushar@ebuzzzmedia.com', // Hardcoded to ensure this email is used
  phone: process.env.COMPANY_PHONE || '+1 (555) 123-4567',
  address: '123 Creative Street, Digital City',
  website: process.env.WEBSITE_URL || 'https://ebuzzzmedia.com'
};

// Send notification to admin
const sendAdminNotification = async (subject, formData) => {
  try {
    // Format message based on form type
    let messageBody = '';
    let tableRows = '';
    
    // Basic info for all form types
    tableRows += `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Name</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${formData.name}</td>
      </tr>
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <a href="mailto:${formData.email}">${formData.email}</a>
        </td>
      </tr>
    `;
    
    if (formData.type === 'contact') {
      // Additional fields for contact form
      tableRows += `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Message</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${formData.message}</td>
        </tr>
      `;
      
      messageBody = `New contact form submission from ${formData.name} (${formData.email}).\n\nMessage: ${formData.message}`;
    } 
    else if (formData.type === 'consultation') {
      // Additional fields for consultation form
      tableRows += `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Date</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${formData.date}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Time</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${formData.time}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Message</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${formData.message || 'No message provided'}</td>
        </tr>
      `;
      
      messageBody = `New consultation booking from ${formData.name} (${formData.email}).\n\nDate: ${formData.date}\nTime: ${formData.time}\nMessage: ${formData.message || 'No message provided'}`;
    } 
    else if (formData.type === 'custom-package') {
      // Format services information
      const serviceList = formData.services ? 
        Object.entries(formData.services)
          .flatMap(([category, services]) => 
            Object.entries(services)
              .filter(([_, selected]) => selected)
              .map(([name, _]) => `- ${name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}`)
          )
          .join('\n') : 'No specific services selected';
      
      tableRows += `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Selected Services</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${serviceList.replace(/\n/g, '<br>')}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Message</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${formData.message || 'No message provided'}</td>
        </tr>
      `;
      
      messageBody = `New custom package request from ${formData.name} (${formData.email}).\n\nSelected Services:\n${serviceList}\n\nMessage: ${formData.message || 'No message provided'}`;
    }
    
    // Create HTML email with professional design
    const htmlEmail = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(90deg, #6a5acd, #8a75ed); color: white; padding: 20px; border-radius: 5px 5px 0 0; }
          .content { background: #fff; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .footer { margin-top: 20px; font-size: 12px; color: #666; text-align: center; }
          table { width: 100%; border-collapse: collapse; }
          .button { display: inline-block; padding: 10px 20px; background-color: #6a5acd; color: white; text-decoration: none; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">${subject}</h1>
          </div>
          <div class="content">
            <p>You have received a new submission from your website. Details are below:</p>
            
            <table>
              <tbody>
                ${tableRows}
              </tbody>
            </table>
            
            <div style="margin-top: 30px;">
              <p>This submission was received on ${new Date().toLocaleString()}</p>
            </div>
          </div>
          <div class="footer">
            <p>This is an automated message from your eBuzzzMedia website.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    // Add detailed logging to help with troubleshooting
    console.log('Attempting to send admin notification email to:', companyInfo.adminEmail);
    
    // Send email
    const mailOptions = {
      from: `"${companyInfo.name}" <${companyInfo.email}>`,
      to: companyInfo.adminEmail,
      subject: `[eBuzzzMedia] ${subject}`,
      text: messageBody,
      html: htmlEmail
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Admin notification sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending admin notification:', error.message);
    console.error('Error details:', error);
    throw error;
  }
};

// Send confirmation to user
const sendUserConfirmation = async (formData) => {
  try {
    let subject = '';
    let message = '';
    let customHtml = '';
    
    if (formData.type === 'contact') {
      subject = 'Thank you for your message';
      message = `
        Dear ${formData.name},
        
        Thank you for reaching out to eBuzzzMedia! We've received your message and will get back to you shortly.
        
        Your message has been recorded and our team will respond to you within 1-2 business days.
        
        Best regards,
        The eBuzzzMedia Team
      `;
      
      customHtml = `
        <p>Thank you for reaching out to eBuzzzMedia! We've received your message and will get back to you shortly.</p>
        
        <p>Your message has been recorded and our team will respond to you within 1-2 business days.</p>
        
        <div style="margin: 30px 0; padding: 20px; background-color: #f9f9f9; border-radius: 5px;">
          <p><strong>Your message:</strong></p>
          <p style="font-style: italic;">${formData.message}</p>
        </div>
        
        <p>If you have any urgent inquiries, please don't hesitate to call us at ${companyInfo.phone}.</p>
      `;
    } 
    else if (formData.type === 'consultation') {
      subject = 'Your Consultation Booking Confirmation';
      message = `
        Dear ${formData.name},
        
        Thank you for booking a consultation with eBuzzzMedia!
        
        Your consultation is scheduled for:
        Date: ${formData.date}
        Time: ${formData.time}
        
        We're looking forward to discussing how we can help your business grow.
        
        If you need to reschedule or have any questions, please reply to this email or call us at ${companyInfo.phone}.
        
        Best regards,
        The eBuzzzMedia Team
      `;
      
      customHtml = `
        <p>Thank you for booking a consultation with eBuzzzMedia!</p>
        
        <div style="margin: 30px 0; padding: 20px; background-color: #f9f9f9; border-radius: 5px;">
          <h3 style="margin-top: 0; color: #6a5acd;">Your Consultation Details</h3>
          <p><strong>Date:</strong> ${formData.date}</p>
          <p><strong>Time:</strong> ${formData.time}</p>
          ${formData.message ? `<p><strong>Your message:</strong> ${formData.message}</p>` : ''}
        </div>
        
        <p>We're looking forward to discussing how we can help your business grow.</p>
        
        <p>If you need to reschedule or have any questions, please reply to this email or call us at ${companyInfo.phone}.</p>
        
        <div style="margin: 30px 0;">
          <p><strong>Tips for a productive consultation:</strong></p>
          <ul>
            <li>Prepare any questions you have about our services</li>
            <li>Consider your business goals and challenges</li>
            <li>Have examples of styles or content you like</li>
            <li>Check your internet connection before the call if it's a virtual meeting</li>
          </ul>
        </div>
      `;
    } 
    else if (formData.type === 'custom-package') {
      subject = 'Your Custom Package Request';
      message = `
        Dear ${formData.name},
        
        Thank you for your interest in our custom package! We've received your request and our team will create a tailored solution based on your needs.
        
        We'll get back to you within 1-2 business days with more information.
        
        Best regards,
        The eBuzzzMedia Team
      `;
      
      customHtml = `
        <p>Thank you for your interest in our custom package! We've received your request and our team will create a tailored solution based on your needs.</p>
        
        <div style="margin: 30px 0; padding: 20px; background-color: #f9f9f9; border-radius: 5px;">
          <h3 style="margin-top: 0; color: #6a5acd;">Your Custom Package Request</h3>
          ${formData.message ? `<p><strong>Your message:</strong> ${formData.message}</p>` : ''}
        </div>
        
        <p>We'll get back to you within 1-2 business days with a personalized proposal.</p>
        
        <p>In the meantime, feel free to explore more of our services on our <a href="${companyInfo.website}" style="color: #6a5acd; text-decoration: none;">website</a>.</p>
      `;
    }
    
    const htmlEmail = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(90deg, #6a5acd, #8a75ed); color: white; padding: 20px; border-radius: 5px 5px 0 0; text-align: center; }
          .content { background: #fff; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; text-align: center; }
          .social-links { margin-top: 15px; }
          .social-links a { display: inline-block; margin: 0 5px; color: #6a5acd; }
          .button { display: inline-block; padding: 10px 20px; background-color: #6a5acd; color: white; text-decoration: none; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">${companyInfo.name}</h1>
            <p style="margin: 5px 0 0 0;">Where Creativity Meets Technology</p>
          </div>
          <div class="content">
            <p>Dear <strong>${formData.name}</strong>,</p>
            
            ${customHtml}
            
            <p>Best regards,<br>The eBuzzzMedia Team</p>
          </div>
          <div class="footer">
            <p>${companyInfo.name} | ${companyInfo.address} | ${companyInfo.phone}</p>
            <div class="social-links">
              <a href="#">Facebook</a> | <a href="#">Twitter</a> | <a href="#">LinkedIn</a> | <a href="#">Instagram</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
    
    // Add detailed logging to help with troubleshooting
    console.log('Attempting to send confirmation email to user:', formData.email);
    
    const mailOptions = {
      from: `"${companyInfo.name}" <${companyInfo.email}>`,
      to: formData.email,
      subject: subject,
      text: message,
      html: htmlEmail
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('User confirmation sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending user confirmation:', error.message);
    console.error('Error details:', error);
    throw error;
  }
};

// Test email connections on startup
const testEmailConnection = async () => {
  try {
    console.log("Testing email connection with Hostinger SMTP...");
    await transporter.verify();
    console.log('✅ Email service is ready to send messages');
    return true;
  } catch (error) {
    console.error('❌ Email verification failed:', error);
    console.error('Please check your SMTP credentials and server configuration');
    
    // More detailed troubleshooting help
    if (error.code === 'EAUTH') {
      console.error('Authentication Error: Your username or password is incorrect');
      console.error('- Check that your EMAIL_PASSWORD is correct');
      console.error('- Verify that your Hostinger email account is active');
      console.error('- Try logging in to webmail to confirm credentials work');
    }
    
    return false;
  }
};

// Call this function when the server starts
testEmailConnection();

// Export functions
module.exports = {
  sendAdminNotification,
  sendUserConfirmation,
  testEmailConnection
};