const nodemailer = require('nodemailer');
const config = require('../config');

/**
 * Create email transporter
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.secure,
    auth: {
      user: config.email.user,
      pass: config.email.password,
    },
  });
};

/**
 * Send email
 * @param {object} options - Email options
 * @returns {Promise} - Send result
 */
const sendEmail = async (options) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: config.email.from,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

/**
 * Send booking confirmation email
 * @param {object} booking - Booking details
 * @param {string} travelerEmail - Traveler email
 * @param {string} travelerPassword - Generated password for new traveler
 */
const sendBookingConfirmation = async (booking, travelerEmail, travelerPassword) => {
  const subject = `Booking Confirmed - ${booking.package_title}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #007bff; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .booking-details { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #007bff; }
        .credentials { background: #fff3cd; padding: 15px; margin: 15px 0; border: 1px solid #ffc107; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .button { display: inline-block; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 4px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Booking Confirmed!</h1>
        </div>
        
        <div class="content">
          <h2>Dear ${booking.traveler_name},</h2>
          <p>Your booking has been confirmed. We're excited to help you explore Sri Lanka!</p>
          
          <div class="booking-details">
            <h3>Booking Details</h3>
            <p><strong>Package:</strong> ${booking.package_title}</p>
            <p><strong>Duration:</strong> ${booking.package_days} days</p>
            <p><strong>Number of Travelers:</strong> ${booking.no_of_travelers}</p>
            ${booking.start_date ? `<p><strong>Start Date:</strong> ${new Date(booking.start_date).toLocaleDateString()}</p>` : ''}
            ${booking.total_amount ? `<p><strong>Total Amount:</strong> LKR ${booking.total_amount.toLocaleString()}</p>` : ''}
            <p><strong>Booking ID:</strong> ${booking.booking_id}</p>
          </div>
          
          ${
            travelerPassword
              ? `
          <div class="credentials">
            <h3>⚠️ Your Account Credentials</h3>
            <p>We've created an account for you to manage your bookings:</p>
            <p><strong>Email:</strong> ${travelerEmail}</p>
            <p><strong>Password:</strong> ${travelerPassword}</p>
            <p style="color: #d9534f;"><strong>Important:</strong> Please change your password after first login!</p>
            <a href="${config.frontend.url}/login" class="button">Login to Your Account</a>
          </div>
          `
              : ''
          }
          
          <p>If you have any questions, please don't hesitate to contact us.</p>
          
          <p>Best regards,<br>Trust You Go Team</p>
        </div>
        
        <div class="footer">
          <p>Trust You Go - Your Sri Lanka Travel Partner</p>
          <p>${config.email.from}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: travelerEmail,
    subject,
    html,
  });
};

/**
 * Send password change confirmation email
 * @param {string} email - User email
 * @param {string} name - User name
 */
const sendPasswordChangeConfirmation = async (email, name) => {
  const subject = 'Password Changed Successfully';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #28a745; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Password Changed</h1>
        </div>
        
        <div class="content">
          <h2>Dear ${name},</h2>
          <p>Your password has been changed successfully.</p>
          <p>If you did not make this change, please contact us immediately.</p>
          
          <p>Best regards,<br>Trust You Go Team</p>
        </div>
        
        <div class="footer">
          <p>Trust You Go - Your Sri Lanka Travel Partner</p>
          <p>${config.email.from}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject,
    html,
  });
};

/**
 * Send package request acknowledgment email
 * @param {object} request - Package request details
 * @param {string} travelerEmail - Traveler email
 */
const sendPackageRequestAcknowledgment = async (request, travelerEmail) => {
  const subject = 'Package Request Received';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #17a2b8; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📝 Request Received</h1>
        </div>
        
        <div class="content">
          <h2>Dear ${request.traveler_name},</h2>
          <p>Thank you for your custom package request. We have received your requirements and will review them shortly.</p>
          
          <div style="background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #17a2b8;">
            <h3>Your Request</h3>
            <p><strong>Title:</strong> ${request.title}</p>
            <p><strong>Duration:</strong> ${request.no_of_days} days</p>
            <p><strong>Travelers:</strong> ${request.no_of_travelers}</p>
            ${request.budget_range ? `<p><strong>Budget:</strong> ${request.budget_range}</p>` : ''}
          </div>
          
          <p>Our team will contact you within 24-48 hours with a customized package based on your requirements.</p>
          
          <p>Best regards,<br>Trust You Go Team</p>
        </div>
        
        <div class="footer">
          <p>Trust You Go - Your Sri Lanka Travel Partner</p>
          <p>${config.email.from}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: travelerEmail,
    subject,
    html,
  });
};

/**
 * Test email connection
 */
const testConnection = async () => {
  const transporter = createTransporter();
  try {
    await transporter.verify();
    console.log('✓ Email service is ready');
    return true;
  } catch (error) {
    console.error('✗ Email service error:', error.message);
    return false;
  }
};

module.exports = {
  sendEmail,
  sendBookingConfirmation,
  sendPasswordChangeConfirmation,
  sendPackageRequestAcknowledgment,
  testConnection,
};
