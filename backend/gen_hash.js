const bcrypt = require('bcryptjs');

async function gen() {
  const hash = await bcrypt.hash('admin123', 10);
  console.log(`Hash for 'admin123': ${hash}`);
}

gen();
