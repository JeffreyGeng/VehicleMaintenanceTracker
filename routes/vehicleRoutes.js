const express = require('express');
const router = express.Router();
const { Vehicle } = require('../models');
const { verifyToken } = require('../utils/authUtils');

/**
 * @swagger
 * components:
 *   schemas:
 *     Vehicle:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated ID of the vehicle
 *         make:
 *           type: string
 *           description: The make of the vehicle
 *         model:
 *           type: string
 *           description: The model of the vehicle
 *         year:
 *           type: integer
 *           description: The year of the vehicle
 *         userId:
 *           type: integer
 *           description: The ID of the user who owns the vehicle
 *       example:
 *         id: 1
 *         make: Toyota
 *         model: Camry
 *         year: 2021
 *         userId: 1
 */



// Create a Vehicle
/**
 * @swagger
 * /api/vehicles/add:
 *   post:
 *     summary: Add a new vehicle
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               make:
 *                 type: string
 *                 description: The make of the vehicle
 *               model:
 *                 type: string
 *                 description: The model of the vehicle
 *               year:
 *                 type: integer
 *                 description: The year of the vehicle
 *             required:
 *               - make
 *               - model
 *               - year
 *           example:
 *             make: Toyota
 *             model: Camry
 *             year: 2021
 *     responses:
 *       201:
 *         description: Vehicle added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehicle'
 *       401:
 *         description: No token, authorization denied
 */
router.post('/add', verifyToken, async (req, res) => {
  const { make, model, year } = req.body;
  try {
    const vehicle = await Vehicle.create({
      make,
      model,
      year,
      userId: req.user.id,
    });

    res.status(201).json({ msg: 'Vehicle added successfully', vehicle });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get All Vehicles for a User
/**
 * @swagger
 * /api/vehicles:
 *   get:
 *     summary: Get all vehicles for the authenticated user
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of vehicles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vehicle'
 *       401:
 *         description: No token, authorization denied
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll({ where: { userId: req.user.id } });
    res.status(200).json({ vehicles });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get a Single Vehicle by ID
/**
 * @swagger
 * /api/vehicles/{id}:
 *   get:
 *     summary: Get a specific vehicle by ID for the authenticated user
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the vehicle
 *     responses:
 *       200:
 *         description: Vehicle data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehicle'
 *       401:
 *         description: No token, authorization denied
 *       404:
 *         description: Vehicle not found
 */
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!vehicle) {
      return res.status(404).json({ msg: 'Vehicle not found' });
    }

    res.status(200).json({ vehicle });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update a Vehicle by ID
/**
 * @swagger
 * /api/vehicles/{id}:
 *   put:
 *     summary: Update a specific vehicle by ID for the authenticated user
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the vehicle
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               make:
 *                 type: string
 *                 description: The make of the vehicle
 *               model:
 *                 type: string
 *                 description: The model of the vehicle
 *               year:
 *                 type: integer
 *                 description: The year of the vehicle
 *           example:
 *             make: Honda
 *             model: Accord
 *             year: 2022
 *     responses:
 *       200:
 *         description: Vehicle updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehicle'
 *       401:
 *         description: No token, authorization denied
 *       404:
 *         description: Vehicle not found
 */
router.put('/:id', verifyToken, async (req, res) => {
  const { make, model, year } = req.body;

  try {
    const vehicle = await Vehicle.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!vehicle) {
      return res.status(404).json({ msg: 'Vehicle not found' });
    }

    vehicle.make = make || vehicle.make;
    vehicle.model = model || vehicle.model;
    vehicle.year = year || vehicle.year;

    await vehicle.save();

    res.status(200).json({ msg: 'Vehicle updated successfully', vehicle });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete a Vehicle by ID
/**
 * @swagger
 * /api/vehicles/{id}:
 *   delete:
 *     summary: Delete a specific vehicle by ID for the authenticated user
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the vehicle
 *     responses:
 *       200:
 *         description: Vehicle deleted successfully
 *       401:
 *         description: No token, authorization denied
 *       404:
 *         description: Vehicle not found
 */
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!vehicle) {
      return res.status(404).json({ msg: 'Vehicle not found' });
    }

    await vehicle.destroy();

    res.status(200).json({ msg: 'Vehicle deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;