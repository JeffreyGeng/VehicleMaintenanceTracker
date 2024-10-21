const express = require('express');
const router = express.Router();
const { Maintenance, Vehicle } = require('../models');
const { verifyToken } = require('../utils/authUtils');

/**
 * @swagger
 * /api/maintenance/add:
 *   post:
 *     summary: Add a maintenance record to a vehicle
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vehicleId:
 *                 type: integer
 *                 description: The ID of the vehicle
 *               type:
 *                 type: string
 *                 description: The type of maintenance
 *               mileage:
 *                 type: integer
 *                 description: The mileage at which maintenance was performed
 *               date:
 *                 type: string
 *                 format: date
 *                 description: The date of the maintenance
 *               nextMileage:
 *                 type: integer
 *                 description: The mileage at which the next maintenance is due
 *               nextDate:
 *                 type: string
 *                 format: date
 *                 description: The date when the next maintenance is due
 *           example:
 *             vehicleId: 1
 *             type: "Oil Change"
 *             mileage: 12000
 *             date: "2024-10-01"
 *             nextMileage: 17000
 *             nextDate: "2025-04-01"
 *     responses:
 *       201:
 *         description: Maintenance record added successfully
 *       401:
 *         description: No token, authorization denied
 */
router.post('/add', verifyToken, async (req, res) => {
  const { vehicleId, type, mileage, date, nextMileage, nextDate } = req.body;

  try {
    const userId = req.user.id;

    // Ensure vehicle belongs to the authenticated user
    const vehicle = await Vehicle.findOne({ where: { id: vehicleId, userId } });
    if (!vehicle) {
      return res.status(404).json({ msg: 'Vehicle not found or unauthorized' });
    }

    const maintenance = await Maintenance.create({
      vehicleId,
      type,
      mileage,
      date,
      nextMileage,
      nextDate,
    });

    res.status(201).json({ msg: 'Maintenance record added successfully', maintenance });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @swagger
 * /api/maintenance/upcoming/{vehicleId}:
 *   get:
 *     summary: Get upcoming maintenance tasks for a specific vehicle
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the vehicle
 *     responses:
 *       200:
 *         description: List of upcoming maintenance tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                   dueMileage:
 *                     type: integer
 *                   dueDate:
 *                     type: string
 *                     format: date
 *       401:
 *         description: No token, authorization denied
 */
router.get('/upcoming/:vehicleId', verifyToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const { vehicleId } = req.params;
  
      // Ensure vehicle belongs to the authenticated user
      const vehicle = await Vehicle.findOne({ where: { id: vehicleId, userId } });
      if (!vehicle) {
        return res.status(404).json({ msg: 'Vehicle not found or unauthorized' });
      }
  
      const maintenances = await Maintenance.findAll({ where: { vehicleId } });
      const upcomingMaintenances = [];
  
      for (const maintenance of maintenances) {
        if (maintenance.nextMileage && vehicle.mileage >= maintenance.nextMileage) {
          upcomingMaintenances.push({
            type: maintenance.type,
            dueMileage: maintenance.nextMileage,
            dueDate: maintenance.nextDate ? maintenance.nextDate.toISOString().split('T')[0] : null,
          });
        } else if (maintenance.nextDate && new Date() >= new Date(maintenance.nextDate)) {
          upcomingMaintenances.push({
            type: maintenance.type,
            dueMileage: maintenance.nextMileage,
            dueDate: maintenance.nextDate.toISOString().split('T')[0],
          });
        }
      }
  
      res.status(200).json(upcomingMaintenances);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });

module.exports = router;