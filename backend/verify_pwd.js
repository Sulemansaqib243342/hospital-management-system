const bcrypt = require('bcryptjs');

const password = 'admin123';
const hash = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.';

async function verify() {
  const match = await bcrypt.compare(password, hash);
  console.log(`Password: ${password}`);
  console.log(`Hash: ${hash}`);
  console.log(`Match: ${match}`);
}

verify();
