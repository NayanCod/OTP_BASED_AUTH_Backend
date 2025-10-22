// import nodemailer from "nodemailer";
// import dotenv from "dotenv";
// dotenv.config();

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   port: parseInt(process.env.SMTP_PORT || "587"),
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// transporter.verify((error, success) => {
//   if (error) {
//     console.error("Email config error:", error);
//     console.log("EMAIL_USER:", process.env.EMAIL_USER ? "Set" : "Not set");
//     console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Set (length: " + process.env.EMAIL_PASS.length + ")" : "Not set");
//   } else {
//     console.log("✅ Email server is ready");
//   }
// });


// export const sendOtpEmail = async (email, otp) => {
//   await transporter.sendMail({
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: "Your OTP Code",
//     text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
//   });
// };

import { Resend } from 'resend';
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOtpEmail = async (email, otp) => {
  try {
    console.log(`📧 Sending OTP to ${email}`);
    
    const { data, error } = await resend.emails.send({
      from: 'OTP Service <onboarding@resend.dev>',
      to: email,
      subject: 'Your OTP Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed;">Your OTP Code</h2>
          <p>Your OTP code is:</p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; font-size: 32px; font-weight: bold; color: #7c3aed; letter-spacing: 8px;">
            ${otp}
          </div>
          <p style="color: #666; margin-top: 20px;">This code will expire in 5 minutes.</p>
          <p style="color: #999; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      console.error('❌ Resend error:', error);
      throw error;
    }

    console.log('✅ Email sent successfully');
    return data;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
};