import pkg from 'pg';

import dotenv from 'dotenv';
dotenv.config();

const {Pool} = pkg;

// export const pool = new Pool({

//     // create a single pool of connections to the database, which can be shared across the application. This allows for efficient management of database connections and can improve performance by reusing existing connections instead of creating new ones for each request.
//     connectionString: process.env.DATABASE_URL,

//     ssl:{
//         require: true,
//         rejectUnauthorized: false,
//     },
//     max: 20, // maximum number of clients in the pool
//     idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
//     connectionTimeoutMillis: 2000, // how long to wait for a connection to be established before timing out
// })
import mysql from "mysql2/promise";
//

export const  pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export const connectDB = async () => {
  try {
    const [rows] = await pool.query("SELECT 1");
    console.log("✅ MySQL DB Connected");
  } catch (err) {
    console.error("❌ DB connection failed:", err.message);
    process.exit(1);
  }
};

export default { pool, connectDB };
