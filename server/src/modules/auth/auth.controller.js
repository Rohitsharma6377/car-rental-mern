import { asyncHandler } from "../../utils/asyncHandler.js";
import { authServices } from "./auth.services.js";

export const registerUser = asyncHandler(async (req, res) => {
  const data = await authServices.registerUser(req.body);
  res.json({ success: true, data });
});

// ✅ FIXED
export const sendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const data = await authServices.sendOtp(email);

  res.json({ success: true, data });
});

export const verifyOtp = asyncHandler(async (req, res) => {
  console.log("REQ BODY:", req.body); // ✅ correct debug

  const { email, otp } = req.body;

  const data = await authServices.verifyOtp(email, otp);

  res.json({ success: true, data });
});

export const loginUser = asyncHandler(async (req, res) => {
  const data = await authServices.loginUser(req.body);
  res.json({ success: true, data });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  await authServices.forgotPassword(req.body.email);
  res.json({
    success: true,
    message: "Password reset link sent to your email",
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const data = await authServices.resetPassword(token, newPassword);

  res.json({ success: true, data });
});