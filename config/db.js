const mongoose = require("mongoose");

async function connectDb() {
  try {
    const uri = process.env.DB_URI;
    if (!uri) {
      console.error(
        "❌ MongoDB URI tidak ditemukan di environment variable (.env)"
      );
      process.exit(1);
    }

    console.log("🟡 Menghubungkan ke MongoDB...");
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      tls: true, // gunakan TLS karena MongoDB Atlas biasanya pakai SSL
      serverSelectionTimeoutMS: 10000, // timeout 10 detik untuk mencegah buffering hang
    });

    console.log("✅ MongoDB Connected Successfully!");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  }
}

module.exports = {
  connectDb,
};
