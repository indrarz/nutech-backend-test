const Sequelize = require('sequelize');

const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
    timezone: '+07:00',
  },
);

async function connectDb() {
  try {
    await db.authenticate();
    console.log('MariaDB Connected!');
  } catch (err) {
    console.error('Unable to connect to the database:', err.message);
    process.exit(1);
  }
}

module.exports = {
  connectDb,
  db,
};
