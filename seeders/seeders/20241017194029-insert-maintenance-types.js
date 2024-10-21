module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('MaintenanceTypes', [
      {
        name: 'Oil Change',
        recommendedMileageInterval: 10000, // Every 10,000 miles
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Tire Rotation',
        recommendedMileageInterval: 7500, // Every 7,500 miles
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Engine Coolant',
        recommendedMileageInterval: 30000, // Every 30,000 miles
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('MaintenanceTypes', null, {});
  }
};
