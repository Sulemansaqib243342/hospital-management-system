require('dotenv').config();
const oracledb = require('oracledb');

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECT,
};

async function checkUser() {
  let conn;
  try {
    conn = await oracledb.getConnection(dbConfig);
    const result = await conn.execute(
      `SELECT email, password FROM staff WHERE email = 'admin@hospital.com'`
    );
    console.log('User status:', result.rows);
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    if (conn) await conn.close();
  }
}
checkUser();
