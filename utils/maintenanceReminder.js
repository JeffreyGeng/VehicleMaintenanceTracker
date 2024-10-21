const cron = require('node-cron');
const { Vehicle, Maintenance } = require('../models');

// Function to run maintenance reminders
const runMaintenanceReminders = async () => {
  try {
    console.log('Running maintenance reminder check...');
    const maintenances = await Maintenance.findAll({
      include: {
        model: Vehicle,
        as: 'vehicle',
      },
    });

    for (const maintenance of maintenances) {
      const { nextMileage, nextDate, vehicle } = maintenance;

      // Reminder based on mileage
      if (nextMileage && vehicle.mileage >= nextMileage) {
        console.log(`Reminder: Vehicle ID ${vehicle.id} needs ${maintenance.type} based on mileage.`);
        // Here you can trigger a reminder, such as sending an email or creating a notification
      }

      // Reminder based on date
      if (nextDate && new Date() >= new Date(nextDate)) {
        console.log(`Reminder: Vehicle ID ${vehicle.id} needs ${maintenance.type} based on date.`);
        // Here you can trigger a reminder, such as sending an email or creating a notification
      }
    }
  } catch (err) {
    console.error('Error running maintenance reminder cron:', err);
  }
};

// Schedule the reminder to run every day at midnight
cron.schedule('0 0 * * *', runMaintenanceReminders);

module.exports = { runMaintenanceReminders };
