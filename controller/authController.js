import jwt from "jsonwebtoken";
import Otp from "../models/otp.js";
import User from "../models/user.js";
import { sendOtpEmail } from "../lib/email.js";

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const signupRequestOtp = async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  try {
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    await Otp.deleteMany({ email }); // remove old OTPs
    await Otp.create({ email, otp, expiresAt });

    await sendOtpEmail(email, otp);

    res.json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP", error });
  }
};

export const signupVerifyOtp = async (req, res) => {
  const { name, email, otp } = req.body;

  if (!name || !email || !otp) {
    return res
      .status(400)
      .json({ message: "Name, email and OTP are required" });
  }

  try {
    const otpRecord = await Otp.findOne({ email, otp });

    if (!otpRecord) return res.status(400).json({ message: "Invalid OTP" });
    if (otpRecord.expiresAt < Date.now())
      return res.status(400).json({ message: "OTP expired" });

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email });
    }

    await Otp.deleteMany({ email });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Signup successful", token, user });
  } catch (error) {
    res.status(500).json({ message: "Error verifying OTP", error });
  }
};

export const loginRequestOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not registered" });

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await Otp.deleteMany({ email });
    await Otp.create({ email, otp, expiresAt });

    await sendOtpEmail(email, otp);

    res.json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP", error });
  }
};

export const loginVerifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  try {
    const otpRecord = await Otp.findOne({ email, otp });
    if (!otpRecord) return res.status(400).json({ message: "Invalid OTP" });
    if (otpRecord.expiresAt < Date.now())
      return res.status(400).json({ message: "OTP expired" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    await Otp.deleteMany({ email });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Login successful", token, user });
  } catch (error) {
    res.status(500).json({ message: "Error verifying OTP", error });
  }
};
