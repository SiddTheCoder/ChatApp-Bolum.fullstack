import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,       // your Gmail address
    pass: process.env.EMAIL_PASS        // your Gmail app password
  }
});

const sendVerificationEmail = async (to, subject, html) => {
  const mailOptions = {
    from: `"Bolum" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendVerificationEmail;
