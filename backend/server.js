// Backend server for HMS
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initPool } = require('./db/connection');

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/staff', require('./routes/staffRoutes'));
app.use('/api/pharmacy', require('./routes/pharmacyRoutes'));
app.use('/api/billing', require('./routes/billingRoutes'));

app.get('/', (req, res) => res.json({ message: 'HMS API is running' }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

initPool()
  .then(() => {
    app.listen(PORT, () => console.log(`HMS Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('Failed to connect to Oracle DB:', err);
    process.exit(1);
  });
