import express from "express";
import { authorize } from "../../middleware/auth.middleware.js";
import { protect } from "../../middleware/auth.middleware.js";
import { authRateLimiter } from "../../middleware/rateLimiter.js";
import {
    forgotPassword,
    loginUser,
    registerUser,
    resetPassword,
    verifyOtp,
    sendOtp
} from "./auth.controller.js";

import { validateRequest } from "../../middleware/validation.middleware.js";
import { registerSchema, loginSchema, forgetSchema, resetSchema, otpSchema, emailOnlySchema } from "./auth.validator.js";

const router = express.Router();
 // we use router of express to define our routes and then we will export this router and use it in our main app.js file to register these routes in our application. router jo h wo express ka ek method h jisse hum apne routes ko define karte h. router.post() method jo h wo post request ke liye route define karta h jese ki /register route ke liye hum router.post("/register", validateRequest(registerSchema), registerUSer) call kar rahe h jisme validateRequest(registerSchema) ek middleware function h jo ki request body ko validate karega registerSchema ke against aur agar validation successful hota h to registerUSer controller function call hoga jisme user registration ka logic likha hoga. is tarah se hum apne authentication related routes ko define kar sakte h.
router.post("/register",authRateLimiter, validateRequest(registerSchema), registerUser);
router.post("/send-otp", authRateLimiter, validateRequest(emailOnlySchema), sendOtp);
router.post("/verify-otp", authRateLimiter, validateRequest(otpSchema), verifyOtp);
router.post("/login", authRateLimiter, validateRequest(loginSchema), loginUser);

router.post("/forgot-password", validateRequest(forgetSchema), forgotPassword);
router.post("/reset-password/:token", validateRequest(resetSchema), resetPassword);


//protectded routes

router.get("/user/profile", protect, authorize("user", "vendor"), (req,res)=>{
    res.json({success: true, data: req.user});
})

router.get("/me", protect , (req,res)=>{
    res.json({
        success: true,
        messgage: "This is a current user route",
    })
})


export default router;