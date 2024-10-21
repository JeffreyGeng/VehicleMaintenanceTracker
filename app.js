// app.js
//CONSTS
require('dotenv').config();
const express = require('express');
const { sequelize } = require('./models');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Initialize Express app
const app = express();

//swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Vehicle Maintenance Tracker API',
      version: '1.0.0',
      description: 'API documentation for the Vehicle Maintenance Tracker',
      contact: {
        name: 'Your Name',
      },
      servers: [
        {
          url: 'http://localhost:5000',
        },
      ],
    },
  },
  apis: ['./routes/*.js'], // Adjust path to match your route files (e.g., './routes/userRoutes.js')
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware to parse JSON requests
app.use(express.json());

// Define Routes
const userRoutes = require('./routes/userRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
app.use('/api/users', userRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/maintenance', maintenanceRoutes);

app.get('/', (req, res) => res.send('Vehicle Tracker API Running'));

// Import and run the reminder logic
require('./utils/maintenanceReminder');

// Sync database and start server
const PORT = process.env.PORT || 5000;
sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((err) => {
  console.error('Unable to connect to the database:', err);
});

module.exports = { app };
