module.exports = (sequelize, DataTypes) => {
  const Vehicle = sequelize.define('Vehicle', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    make: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  });

  Vehicle.associate = (models) => {
    Vehicle.belongsTo(models.User, { foreignKey: 'userId' });
    Vehicle.hasMany(models.Maintenance, { foreignKey: 'vehicleId' });
  };

  return Vehicle;
};