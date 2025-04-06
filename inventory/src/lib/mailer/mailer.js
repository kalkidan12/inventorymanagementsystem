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

// Function to send reply email
export const sendReplyEmail = async (email, subject, reply) => {
  const emailContent = baseEmailTemplate(`
    <p>Hello,</p>
     <p>${reply}</p>
    <p>Thank you!</p>
  `);

  await transport.sendMail({
    from: process.env.APP_EMAIL,
    to: email,
    subject: subject || "Kaliget - Reply to Your Message",
    html: emailContent,
  });
};

// Function to send acknowledgment email
export const sendAcknowledgeEmail = async (email) => {
  const emailContent = baseEmailTemplate(`
    <p>Hello,</p>
    <p>Thank you for contacting us. We have received your message and will get back to you shortly.</p>
    <p>Best Regards,</p>
    <p>Kaliget</p>
  `);

  await transport.sendMail({
    from: process.env.APP_EMAIL,
    to: email,
    subject: "Kaliget - Message Received",
    html: emailContent,
  });
};

// Function to send notification email
export const sendMail = async ({ to, subject, html }) => {
  try {
    await transport.sendMail({
      from: process.env.APP_EMAIL,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email could not be sent.");
  }
};

// Function to generate notification email content
export const generateNotificationEmail = (content, recipientEmail) => {
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
            margin: 20px auto;
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
          .unsubscribe-link {
            color: #0073e6;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container" style="width: 100%;">
          <div class="header">
            <img src="https://drive.google.com/uc?export=view&id=1x68lRJVOTWqLcQjaJ7jy0CVG4f6AbqNK" alt="Kaliget Logo" />
          </div>
          <div class="content">
            ${content}
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} kaliget.com. All rights reserved.</p>
            <p>
              If you no longer wish to receive these emails, you can 
              <a class="unsubscribe-link" href="https://www.kaliget.com/api/subscribers/unsubscribe?email=${encodeURIComponent(
                recipientEmail
              )}">unsubscribe</a> here.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
};

// Base template for email with full device width and new logo
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
