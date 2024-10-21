// models/maintenance.js
module.exports = (sequelize, DataTypes) => {
    const Maintenance = sequelize.define('Maintenance', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      vehicleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Vehicles',
          key: 'id',
        },
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mileage: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      nextMileage: {
        type: DataTypes.INTEGER,
        allowNull: true, // The mileage when the next maintenance is due
      },
      nextDate: {
        type: DataTypes.DATE,
        allowNull: true, // The date when the next maintenance is due
      },
    });
  
    Maintenance.associate = (models) => {
      Maintenance.belongsTo(models.Vehicle, {
        foreignKey: 'vehicleId',
        as: 'vehicle',
      });
    };
  
    return Maintenance;
  };
  