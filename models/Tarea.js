const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Tarea = sequelize.define('Tarea', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pendiente',
    validate: {
      isIn: [['pendiente', 'en progreso', 'completada']]
    }
  },
  fecha_vencimiento: {
    type: DataTypes.DATE,
    allowNull: true
  },
  ProyectoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'proyectos',
      key: 'id'
    }
  }
}, {
  tableName: 'tareas',
  timestamps: false
});

module.exports = Tarea;

