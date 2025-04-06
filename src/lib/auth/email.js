import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.APP_EMAIL,
    pass: process.env.APP_EMAIL_PASS,
  },
});

// Function to send password reset email
export const sendResetEmail = async (email, token) => {
  const resetUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/auth/reset-password?token=${token}`;
  const emailContent = baseEmailTemplate(`
      <p>You requested to reset your password. Click <a href="${resetUrl}">here</a> to reset it. 
      This link will expire in 1 hour.</p>
    `);
  await transport.sendMail({
    from: process.env.APP_EMAIL, // Make sure to use APP_EMAIL from environment variables
    to: email,
    subject: "Password Reset",
    html: emailContent,
  });
};

// Function to send email verification email
export const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/auth/verification-successful?token=${token}`;

  const emailContent = baseEmailTemplate(`
    <p>Please click <a href="${verificationUrl}">here</a> to verify your email. 
    This link will expire in 1 hour.</p>
  `);

  await transport.sendMail({
    from: process.env.APP_EMAIL, // Make sure to use APP_EMAIL from environment variables
    to: email,
    subject: "Email Verification",
    html: emailContent,
  });
};

// Base template for email
const baseEmailTemplate = (content) => {
  return `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f7f7f7;
            color: #333;
            width: 100%;
          }
          .container {
            width: 100%;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 3px rgba(0,0,0,0.1);
            box-sizing: border-box;
          }
          .header {
            background-color: #0073e6;
            padding: 20px;
            text-align: left;
            color: #ffffff;
            font-size: 24px;
            font-weight: bold;
            width: 100%;
          }
          .header img {
            height: 40px;
            vertical-align: middle;
          }
          .content {
            padding: 20px;
            line-height: 1.6;
            width: 100%;
          }
          .footer {
            background-color: #f7f7f7;
            padding: 10px;
            text-align: center;
            font-size: 12px;
            color: #888;
            width: 100%;
          }
          @media only screen and (max-width: 600px) {
            .container {
              padding: 0;
              width: 100%;
            }
            .content {
              padding: 15px;
            }
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; width: 100%; background-color: #f7f7f7;">
        <div style="width: 100%; background-color: #f7f7f7; padding: 0;">
          <div class="container" style="width: 100%;">
            <div class="header">
              <img src="https://drive.google.com/uc?export=view&id=1x68lRJVOTWqLcQjaJ7jy0CVG4f6AbqNK" alt="Kaliget Logo" />
            </div>
            <div class="content">
              ${content}
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} kaliget.com. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
};
