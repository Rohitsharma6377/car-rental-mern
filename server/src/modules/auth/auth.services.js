// modules/auth/auth.services.js

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { pool } from "../../config/db.js";
import { ApiError } from "../../utils/ApiError.js";
import { sendEmail } from "../../utils/sendEmail.js";

export class authServices {

  // ✅ CREATE TABLE
  static async ensureTable() {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        reset_token VARCHAR(255),
        reset_token_expiry BIGINT,
        is_verified BOOLEAN DEFAULT FALSE,   -- ✅ verification status
        otp VARCHAR(10),                     -- ✅ store OTP
        otp_expiry BIGINT,                   -- ✅ expiry time
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
  
static async sendOtp(email) {
  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  // ✅ check user + existing OTP
  const [rows] = await pool.query(
    "SELECT id, otp_expiry FROM users WHERE email = ?",
    [email]
  );

  const user = rows[0];

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // 🚫 Prevent spam (cooldown)
  if (user.otp_expiry && Date.now() < user.otp_expiry - 2 * 60 * 1000) {
    throw new ApiError(429, "Please wait before requesting OTP again");
  }

  // 🔢 generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = Date.now() + 5 * 60 * 1000; // 5 min

  // ✅ store OTP
  await pool.query(
    "UPDATE users SET otp = ?, otp_expiry = ? WHERE email = ?",
    [otp, expiry, email]
  );

  // 📩 send email
  await sendEmail(
    email,
    "OTP Verification",
    `<h3>Your OTP is: ${otp}</h3>
     <p>This OTP is valid for 5 minutes</p>`
  );

  return { message: "OTP sent successfully" };
}
static async verifyOtp(email, otp) {
  const [rows] = await pool.query(
    "SELECT otp, otp_expiry FROM users WHERE email = ?",
    [email]
  );
  console.log("🔥 verifyOtp - user data:", rows[0]); // ✅ debug log

  const user = rows[0];
console.log("🔥 verifyOtp - extracted user:", user); // ✅ debug lo
console.log("🔥 verifyOtp - provided OTP:", otp); // ✅ debug log
if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (String(user.otp) != String(otp)) {
    throw new ApiError(400, "Invalid OTP");
  }

  if (Date.now() > user.otp_expiry) {
    throw new ApiError(400, "OTP expired");
  }

  // ✅ FIX: pass email
  await pool.query(
    `UPDATE users 
     SET is_verified = true, otp = NULL, otp_expiry = NULL 
     WHERE email = ?`,
    [email]
  );

  return { message: "Email verified successfully" };
}


 static async registerUser(data) {
  console.log("🔥 STEP 1 - data:", data);

  if (!data) {
    console.log("❌ data is undefined");
    throw new ApiError(400, "No data received");
  }

  const { name, email, password } = data;

  console.log("🔥 STEP 2 - email:", email);
  console.log("🔥 STEP 3 - password:", password);
  if (!email || !password) {
    console.log("❌ Missing email or password");
    throw new ApiError(400, "Email and password required");
  }

//   await this.ensureTable();
  console.log("✅ STEP 4 - table ensured");

  const [existingUser] = await pool.query(
    "SELECT id , email, password, role FROM users WHERE email = ?",
    [email]
  );

  console.log("🔥 STEP 5 - existingUser:", existingUser);

  if (existingUser.length > 0) {
    throw new ApiError(400, "Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("✅ STEP 6 - password hashed");

  let role = "user";
  if (data.role === "vendor") {
    role = "vendor";
  }

  const [result] = await pool.query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, hashedPassword, role]
  );

  console.log("✅ STEP 7 - user inserted:", result);

  return {
    id: result.insertId,
    email,
    role,
  };
}


  // ✅ LOGIN
  static async loginUser(data) {
    const [rows] = await pool.query(
      "SELECT id, email, password, role , is_verified FROM users WHERE email = ?",
      [data.email]
    );

    const user = rows[0];
    if (!user) throw new ApiError(404, "User not found");

    const isPasswordValid = await bcrypt.compare(
      data.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid credentials");
    }
    if(!user.is_verified){
        throw new ApiError(403, "Email not verified");
    }

    const token = this.generateToken(user);

    return { token };
  }

  // ✅ TOKEN
  static generateToken(user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  }

  // ✅ FORGOT PASSWORD
  static async forgotPassword(email) {
    const [rows] = await pool.query(
      "SELECT id, email, password , role FROM users WHERE email = ?",
      [email]
    );

    const user = rows[0];
    if (!user) throw new ApiError(404, "User not found");

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiry = Date.now() + 3600000; // 1 hour

    await pool.query(
      "UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?",
      [resetToken, expiry, user.id]
    );

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendEmail(
      user.email,
      "Password Reset",
      `<a href="${resetUrl}">Click here to reset password</a>`
    );

    return { message: "Password reset email sent" };
  }

  // ✅ RESET PASSWORD
  static async resetPassword(token, newPassword) {
    const [rows] = await pool.query(
      "SELECT id, email, password , role FROM users WHERE reset_token = ? AND reset_token_expiry > ?",
      [token, Date.now()]
    );

    const user = rows[0];

    if (!user) {
      throw new ApiError(400, "Invalid or expired token");
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await pool.query(
      `UPDATE users 
       SET password = ?, reset_token = NULL, reset_token_expiry = NULL 
       WHERE id = ?`,
      [hashed, user.id]
    );

    return { message: "Password reset successful" };
  }
}