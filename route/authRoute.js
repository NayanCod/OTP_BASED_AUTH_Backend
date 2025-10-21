import express from "express";
import {
  signupRequestOtp,
  signupVerifyOtp,
  loginRequestOtp,
  loginVerifyOtp,
} from "../controller/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import User from "../models/user.js";

const router = express.Router();

router.post("/signup/request-otp", signupRequestOtp);
router.post("/signup/verify-otp", signupVerifyOtp);

router.post("/login/request-otp", loginRequestOtp);
router.post("/login/verify-otp", loginVerifyOtp);

router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email }).select('-__v -createdAt -updatedAt -_id');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "success", user });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
