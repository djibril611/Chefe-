const nodemailer = require('nodemailer');

// Create a reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'Gmail', // You can also use other services like Outlook, Yahoo, etc.
  auth: {
    user: 'berendatech@gmail.com', // Your email address
    pass: 'your-email-password' // Your email password (use an app-specific password for security reasons)
  }
});

// Function to send email
const sendEmail = async (to, subject, text) => {
  try {
    let info = await transporter.sendMail({
      from: '"Your Name" <your-email@gmail.com>', // sender address
      to, // list of receivers
      subject, // Subject line
      text // Plain text body (you can also send HTML if needed)
    });

    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;
