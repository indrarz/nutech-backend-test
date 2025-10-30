require("dotenv").config();
const app = require("./app");
const { connectDb } = require("./config/db");

function normalizePort(port) {
  if (typeof port === "string") {
    return parseInt(port);
  } else if (typeof port === "undefined") {
    return 4000;
  }
  return port;
}

const port = normalizePort(process.env.PORT);

async function startServer() {
  try {
    await connectDb();
    app.listen(port, () => {
      console.log(`Application running on port ${port}`);
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  }
}

startServer();
