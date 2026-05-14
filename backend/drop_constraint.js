require('dotenv').config();
const { getConnection } = require('./db/connection');

async function run() {
  let conn;
  try {
    conn = await getConnection();
    console.log("Connected to DB");
    
    // Find constraint name for billing.payment_mode
    const result = await conn.execute(
      `SELECT constraint_name, search_condition 
       FROM user_constraints 
       WHERE table_name = 'BILLING' AND constraint_type = 'C'`
    );
    
    for (let row of result.rows) {
      const condition = row[1]; // SEARCH_CONDITION is usually the second column
      // search_condition might be a LONG type, so it might not be a direct string, but let's try.
      console.log('Constraint found:', row[0]);
      
      // Let's just drop any constraint on BILLING that has 'payment_mode' in its name if it was auto-generated,
      // Or we can just try to execute the drop if we can read the condition.
      // Wait, let's just query user_cons_columns to find the exact constraint for payment_mode
    }
    
    const colResult = await conn.execute(
      `SELECT constraint_name FROM user_cons_columns WHERE table_name = 'BILLING' AND column_name = 'PAYMENT_MODE'`
    );
    
    for (let row of colResult.rows) {
      const cname = row[0];
      console.log("Dropping constraint:", cname);
      await conn.execute(`ALTER TABLE billing DROP CONSTRAINT ${cname}`);
      console.log("Constraint dropped!");
    }
    
  } catch (err) {
    console.error(err);
  } finally {
    if (conn) await conn.close();
  }
}

run();
