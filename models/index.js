const Proyecto = require('./Proyecto');
const Tarea = require('./Tarea');
const Empleado = require('./Empleado');
const sequelize = require('../config/database');

// Relación uno a muchos: Proyecto -> Tarea
Proyecto.hasMany(Tarea, {
  foreignKey: 'ProyectoId',
  as: 'tareas',
  onDelete: 'CASCADE'
});

Tarea.belongsTo(Proyecto, {
  foreignKey: 'ProyectoId',
  as: 'proyecto'
});

// Relación muchos a muchos: Tarea <-> Empleado
const TareasEmpleados = sequelize.define('TareasEmpleados', {
  id: {
    type: require('sequelize').DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }
}, {
  tableName: 'tareas_empleados',
  timestamps: false
});

Tarea.belongsToMany(Empleado, {
  through: TareasEmpleados,
  foreignKey: 'TareaId',
  otherKey: 'EmpleadoId',
  as: 'empleados'
});

Empleado.belongsToMany(Tarea, {
  through: TareasEmpleados,
  foreignKey: 'EmpleadoId',
  otherKey: 'TareaId',
  as: 'tareas'
});

module.exports = {
  Proyecto,
  Tarea,
  Empleado,
  TareasEmpleados,
  sequelize
};

