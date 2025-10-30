const { connect } = require("mongoose");

async function connectDb() {
  try {
    await connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      tls: true,
    });
    console.log("MongoDB Connected!");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

module.exports = {
  connectDb,
};
