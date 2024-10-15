import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

export const sendOtpToEmail = async (to, subject, otpCode) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; text-align: center; background-color: #f4f4f4; padding: 20px;">
      <div style="background-color: #fff; padding: 30px; border-radius: 10px; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #42b883;">Your Verification Code</h2>
        <p style="font-size: 16px; color: #333;">Use the code below to verify your account:</p>
        <h1 style="font-size: 48px; margin: 20px 0; color: #42b883;">${otpCode}</h1>
        <p style="font-size: 14px; color: #666;">This code is valid for 10 minutes. If you did not request this code, please ignore this email.</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;" />
        <p style="font-size: 12px; color: #aaa;">If you have any questions, feel free to contact our support team.</p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to,
    subject,
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
};
