const { sequelize } = require('./models');
const {
  crearProyecto,
  crearTarea,
  asignarEmpleadosATarea,
  leerProyectosConTareas,
  actualizarTarea,
  eliminarProyecto,
  crearEmpleado
} = require('./operaciones');

async function main() {
  try {
    // Sincronizar modelos con la base de datos
    await sequelize.sync({ force: false });
    console.log('Base de datos sincronizada correctamente\n');

    // Ejemplo de uso de las operaciones CRUD
    console.log('=== Ejemplo de operaciones CRUD ===\n');

    // Crear empleados
    console.log('1. Creando empleados...');
    const empleado1 = await crearEmpleado('Juan Pérez', 'juan.perez@example.com');
    const empleado2 = await crearEmpleado('María García', 'maria.garcia@example.com');
    console.log('');

    // Crear un proyecto
    console.log('2. Creando un proyecto...');
    const proyecto = await crearProyecto(
      'Sistema de Gestión',
      'Desarrollo de un sistema de gestión empresarial',
      new Date('2024-01-01'),
      new Date('2024-12-31')
    );
    console.log('');

    // Crear tareas
    console.log('3. Creando tareas...');
    const tarea1 = await crearTarea(
      'Diseño de base de datos',
      'Crear el esquema de la base de datos',
      'pendiente',
      new Date('2024-02-15'),
      proyecto.id
    );
    const tarea2 = await crearTarea(
      'Implementación de API',
      'Desarrollar los endpoints de la API',
      'en progreso',
      new Date('2024-03-01'),
      proyecto.id
    );
    console.log('');

    // Asignar empleados a tareas
    console.log('4. Asignando empleados a tareas...');
    await asignarEmpleadosATarea(tarea1.id, [empleado1.id, empleado2.id]);
    await asignarEmpleadosATarea(tarea2.id, [empleado1.id]);
    console.log('');

    // Leer proyectos con tareas
    console.log('5. Leyendo proyectos con sus tareas...');
    await leerProyectosConTareas();
    console.log('');

    // Actualizar una tarea
    console.log('6. Actualizando tarea...');
    await actualizarTarea(tarea1.id, { estado: 'completada' });
    console.log('');

    // Leer proyectos nuevamente para ver los cambios
    console.log('7. Leyendo proyectos después de actualización...');
    await leerProyectosConTareas();
    console.log('');

    // Eliminar proyecto (comentado para no eliminar los datos en el ejemplo)
    // console.log('8. Eliminando proyecto...');
    // await eliminarProyecto(proyecto.id);
    // console.log('');

  } catch (error) {
    console.error('Error en la ejecución:', error);
  } finally {
    await sequelize.close();
  }
}

// Ejecutar solo si es el archivo principal
if (require.main === module) {
  main();
}

module.exports = main;

