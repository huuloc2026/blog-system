import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export interface ISendMail {
  toEmail:string,
  code:string
}
export async function sendEmail(body:ISendMail) {
  const {toEmail,code} = body
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
const htmlContent = `<!doctype html>
<html>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2>Welcome to My Website!</h2>
    <p>Hello,</p>
    <p>Your verification token is:</p>
    <p style="font-size: 1.2em; font-weight: bold; color: #007BFF;">${code}</p>
    <p>Please use the form below to verify your token:</p>
    <form action="https://your-backend-server.com/verify-token" method="POST" style="margin-top: 20px;">
      <input type="hidden" name="email" value="${toEmail}" />
      <input type="hidden" name="token" value="${code}" />
      <button type="submit" style="
        background-color: #007BFF; 
        color: white; s
        padding: 10px 20px; 
        border: none; 
        border-radius: 5px; 
        font-size: 1em; 
        cursor: pointer;
      ">
        Verify Token
      </button>
    </form>
    <p style="margin-top: 20px;">If you did not request this email, please ignore it.</p>
    <p>Best regards,</p>
    <p><strong>The Loc Backend Team</strong></p>
  </body>
</html>
`;
  try {
    await transporter.sendMail({
      from: '"From Loc Backend" <your-email@gmail.com>',
      to: toEmail,
      subject: "Notification",
      text: "Fallback plain text content if HTML is not supported",
      html: htmlContent, // Use the HTML content here
    });

    console.log(`Email successfully sent to ${toEmail}`);
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}


