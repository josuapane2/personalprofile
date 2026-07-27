/**
 * One-time script to create admin user in Supabase.
 * Usage: node scripts/create-admin.mjs
 * Optional env: ADMIN_EMAIL, ADMIN_PASSWORD
 */

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function loadEnv() {
  const envPath = resolve(root, ".env.local");
  if (!existsSync(envPath)) {
    console.error("❌ .env.local tidak ditemukan");
    process.exit(1);
  }
  const env = {};
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [key, ...rest] = trimmed.split("=");
    env[key] = rest.join("=");
  }
  return env;
}

const env = loadEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!url || !key) {
  console.error("❌ NEXT_PUBLIC_SUPABASE_URL atau ANON_KEY kosong di .env.local");
  process.exit(1);
}

if (!email || !password) {
  console.error("ADMIN_EMAIL dan ADMIN_PASSWORD wajib diisi sebagai environment variable.");
  process.exit(1);
}

const headers = {
  apikey: key,
  Authorization: `Bearer ${key}`,
  "Content-Type": "application/json",
};

console.log("Membuat akun admin...");
console.log("Email:", email);

const signupRes = await fetch(`${url}/auth/v1/signup`, {
  method: "POST",
  headers,
  body: JSON.stringify({ email, password }),
});

const signupData = await signupRes.json();
const user = signupData.user || (signupData.id && signupData.email ? signupData : null);

if (signupRes.ok && user) {
  console.log("\n✅ Akun admin berhasil dibuat!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Email   :", email);
  console.log("Password:", password);
  console.log("Login   :", "http://localhost:3000/admin/login");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  const confirmed = user.email_confirmed_at || user.email_verified;
  if (!confirmed) {
    console.log("\n⚠️  Email belum confirmed. Lakukan ini dulu:");
    console.log("   Supabase → Authentication → Users");
    console.log("   Klik user → Confirm user / Auto Confirm");
    console.log("   ATAU: Authentication → Providers → Email → matikan Confirm email");
  }
  process.exit(0);
}

const msg = String(signupData.msg || signupData.error_description || signupData.error || signupData.message || "");

if (msg.toLowerCase().includes("already") || msg.toLowerCase().includes("registered")) {
  console.log("\nℹ️  Email sudah terdaftar. Coba login dengan:");
  console.log("Email   :", email);
  console.log("Password: (password yang Anda buat sebelumnya)");
  console.log("Login   : http://localhost:3000/admin/login");
  console.log("\nKalau lupa password, reset di Supabase → Authentication → Users");
  process.exit(0);
}

console.error("\n❌ Gagal membuat akun:", msg);
console.log("\nBuat manual di Supabase Dashboard:");
console.log("1. Authentication → Users → Add user");
console.log("2. Email:", email);
console.log("3. Centang Auto Confirm User");
process.exit(1);
