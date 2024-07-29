const express = require('express');
const router = express.Router();
const sendEmail = require('../utils/sendEmail');

router.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Please fill in all fields' });
  }

  const mailOptions = {
    email: process.env.SMPT_MAIL,
    subject: `New Contact Form Submission from ${name}`,
    message: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  try {
    await sendEmail(mailOptions);
    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Email could not be sent' });
  }
});

module.exports = router;
