import { Client } from "pg";
import dotenv from "dotenv";
import path from "path";

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function main() {
  const email = "kenzobresme@gmail.com";
  console.log(`Checking for user with email: ${email}`);

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL not found!");
    process.exit(1);
  }

  const client = new Client({
    connectionString,
    ssl: true, // Force SSL for Neon
  });

  try {
    await client.connect();
    console.log("Connected to DB successfully.");

    // Find User
    const userRes = await client.query("SELECT id, email FROM users WHERE email = $1", [email]);

    if (userRes.rows.length > 0) {
      const user = userRes.rows[0];
      console.log(`User found: ${user.id} (${user.email})`);

      // Check for accounts
      const accountsRes = await client.query("SELECT id FROM accounts WHERE user_id = $1", [
        user.id,
      ]);

      if (accountsRes.rows.length === 0) {
        console.log("No linked accounts found. This is an orphan user.");
        console.log("Deleting user...");
        await client.query("DELETE FROM users WHERE id = $1", [user.id]);
        console.log("User deleted successfully.");
      } else {
        console.log("User has linked accounts. No action taken.");
      }
    } else {
      console.log("User not found.");
    }
  } catch (err) {
    console.error("Database Error:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
