require('dotenv').config();
const express = require('express');
const { authenticateUser } = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');
const proteinRoutes = require('./routes/proteins');
const { loadUsers, loadRoles } = require('./services/s3Service');

const app = express();

// Middleware for parsing request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());

// Authentication middleware
app.use('/api', authenticateUser);

// Protein routes
app.use('/api/proteins', proteinRoutes);

// 404 handler for unmatched routes
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// Error handling middleware
app.use(errorHandler);

async function loadConfigurationData() {
  try {
    await loadUsers();
    await loadRoles();
    console.log('Configuration data loaded successfully');
  } catch (error) {
    console.error('Error loading configuration data:', error);
    throw error;
  }
}

async function initializeServer() {
  try {
    await loadConfigurationData();
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to initialize server:', error);
    process.exit(1);
  }
}

initializeServer();