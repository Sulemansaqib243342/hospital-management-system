const oracledb = require('oracledb');

const dbConfig = {
  user: process.env.DB_USER || 'hms_user',
  password: process.env.DB_PASSWORD || 'hms_password',
  connectString: process.env.DB_CONNECT || 'localhost:1521/ORCL',
};

async function getConnection() {
  return await oracledb.getConnection(dbConfig);
}

async function initPool() {
  await oracledb.createPool({
    ...dbConfig,
    poolMin: 2,
    poolMax: 10,
    poolIncrement: 1,
  });
  console.log('Oracle DB connection pool created');
}

module.exports = { getConnection, initPool };
