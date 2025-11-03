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

let pruebasExitosas = 0;
let pruebasFallidas = 0;
const errores = [];

async function ejecutarPrueba(nombre, funcion) {
  try {
    await funcion();
    console.log(`✓ ${nombre}`);
    pruebasExitosas++;
    return true;
  } catch (error) {
    console.error(`✗ ${nombre}: ${error.message}`);
    errores.push({ nombre, error: error.message });
    pruebasFallidas++;
    return false;
  }
}

async function ejecutarPruebas() {
  console.log('=== Iniciando pruebas ===\n');

  // Limpiar base de datos antes de las pruebas
  await sequelize.sync({ force: true });
  console.log('Base de datos inicializada para pruebas\n');

  // Prueba 1: Crear proyecto
  let proyectoTest;
  await ejecutarPrueba('Crear proyecto', async () => {
    proyectoTest = await crearProyecto(
      'Proyecto Test',
      'Descripción del proyecto de prueba',
      new Date('2024-01-01'),
      new Date('2024-12-31')
    );
    if (!proyectoTest || !proyectoTest.id) {
      throw new Error('El proyecto no se creó correctamente');
    }
  });

  // Prueba 2: Crear proyecto sin nombre (debe fallar)
  await ejecutarPrueba('Crear proyecto sin nombre (debe fallar)', async () => {
    try {
      await crearProyecto(null, 'Descripción', new Date(), null);
      throw new Error('Debería haber fallado al crear proyecto sin nombre');
    } catch (error) {
      if (error.message.includes('obligatorios')) {
        return; // Error esperado
      }
      throw error;
    }
  });

  // Prueba 3: Crear tarea
  let tareaTest;
  await ejecutarPrueba('Crear tarea', async () => {
    if (!proyectoTest) throw new Error('No hay proyecto para crear tarea');
    tareaTest = await crearTarea(
      'Tarea Test',
      'Descripción de la tarea de prueba',
      'pendiente',
      new Date('2024-02-01'),
      proyectoTest.id
    );
    if (!tareaTest || !tareaTest.id) {
      throw new Error('La tarea no se creó correctamente');
    }
  });

  // Prueba 4: Crear tarea sin proyecto (debe fallar)
  await ejecutarPrueba('Crear tarea sin proyecto (debe fallar)', async () => {
    try {
      await crearTarea('Tarea', 'Desc', 'pendiente', new Date(), 99999);
      throw new Error('Debería haber fallado al crear tarea con proyecto inexistente');
    } catch (error) {
      if (error.message.includes('No se encontró')) {
        return; // Error esperado
      }
      throw error;
    }
  });

  // Prueba 5: Crear empleados
  let empleado1, empleado2;
  await ejecutarPrueba('Crear empleados', async () => {
    empleado1 = await crearEmpleado('Empleado Test 1', 'empleado1@test.com');
    empleado2 = await crearEmpleado('Empleado Test 2', 'empleado2@test.com');
    if (!empleado1 || !empleado2) {
      throw new Error('Los empleados no se crearon correctamente');
    }
  });

  // Prueba 6: Crear empleado con email duplicado (debe fallar)
  await ejecutarPrueba('Crear empleado con email duplicado (debe fallar)', async () => {
    try {
      await crearEmpleado('Otro Empleado', 'empleado1@test.com');
      throw new Error('Debería haber fallado al crear empleado con email duplicado');
    } catch (error) {
      if (error.message.includes('email ya existe') ||
          error.message.includes('UNIQUE') ||
          error.message.includes('duplicado') ||
          error.message.includes('Validation error')) {
        return; // Error esperado
      }
      throw error;
    }
  });

  // Prueba 7: Asignar empleados a tarea
  await ejecutarPrueba('Asignar empleados a tarea', async () => {
    if (!tareaTest || !empleado1 || !empleado2) {
      throw new Error('Faltan datos para asignar empleados');
    }
    const resultado = await asignarEmpleadosATarea(tareaTest.id, [empleado1.id, empleado2.id]);
    if (!resultado || !resultado.empleados || resultado.empleados.length !== 2) {
      throw new Error('Los empleados no se asignaron correctamente');
    }
  });

  // Prueba 8: Asignar empleados a tarea inexistente (debe fallar)
  await ejecutarPrueba('Asignar empleados a tarea inexistente (debe fallar)', async () => {
    try {
      await asignarEmpleadosATarea(99999, [empleado1.id]);
      throw new Error('Debería haber fallado al asignar empleados a tarea inexistente');
    } catch (error) {
      if (error.message.includes('No se encontró')) {
        return; // Error esperado
      }
      throw error;
    }
  });

  // Prueba 9: Leer proyectos con tareas
  await ejecutarPrueba('Leer proyectos con tareas', async () => {
    const proyectos = await leerProyectosConTareas();
    if (!Array.isArray(proyectos) || proyectos.length === 0) {
      throw new Error('No se encontraron proyectos');
    }
    const proyecto = proyectos.find(p => p.id === proyectoTest.id);
    if (!proyecto || !proyecto.tareas || proyecto.tareas.length === 0) {
      throw new Error('No se encontraron las tareas del proyecto');
    }
  });

  // Prueba 10: Actualizar tarea
  await ejecutarPrueba('Actualizar tarea', async () => {
    if (!tareaTest) throw new Error('No hay tarea para actualizar');
    const tareaActualizada = await actualizarTarea(tareaTest.id, {
      estado: 'en progreso',
      titulo: 'Tarea Actualizada'
    });
    if (tareaActualizada.estado !== 'en progreso' || tareaActualizada.titulo !== 'Tarea Actualizada') {
      throw new Error('La tarea no se actualizó correctamente');
    }
  });

  // Prueba 11: Actualizar tarea con estado inválido (debe fallar)
  await ejecutarPrueba('Actualizar tarea con estado inválido (debe fallar)', async () => {
    if (!tareaTest) throw new Error('No hay tarea para actualizar');
    try {
      await actualizarTarea(tareaTest.id, { estado: 'estado_invalido' });
      throw new Error('Debería haber fallado con estado inválido');
    } catch (error) {
      if (error.message.includes('estado debe ser')) {
        return; // Error esperado
      }
      throw error;
    }
  });

  // Prueba 12: Actualizar tarea inexistente (debe fallar)
  await ejecutarPrueba('Actualizar tarea inexistente (debe fallar)', async () => {
    try {
      await actualizarTarea(99999, { estado: 'completada' });
      throw new Error('Debería haber fallado al actualizar tarea inexistente');
    } catch (error) {
      if (error.message.includes('No se encontró')) {
        return; // Error esperado
      }
      throw error;
    }
  });

  // Prueba 13: Eliminar proyecto
  let proyectoParaEliminar;
  await ejecutarPrueba('Crear proyecto para eliminar', async () => {
    proyectoParaEliminar = await crearProyecto(
      'Proyecto a Eliminar',
      'Este proyecto será eliminado',
      new Date(),
      null
    );
    await crearTarea('Tarea del proyecto', 'Desc', 'pendiente', null, proyectoParaEliminar.id);
  });

  await ejecutarPrueba('Eliminar proyecto y sus tareas', async () => {
    if (!proyectoParaEliminar) throw new Error('No hay proyecto para eliminar');
    const resultado = await eliminarProyecto(proyectoParaEliminar.id);
    if (!resultado || resultado.proyectoId !== proyectoParaEliminar.id) {
      throw new Error('El proyecto no se eliminó correctamente');
    }
  });

  // Prueba 14: Eliminar proyecto inexistente (debe fallar)
  await ejecutarPrueba('Eliminar proyecto inexistente (debe fallar)', async () => {
    try {
      await eliminarProyecto(99999);
      throw new Error('Debería haber fallado al eliminar proyecto inexistente');
    } catch (error) {
      if (error.message.includes('No se encontró')) {
        return; // Error esperado
      }
      throw error;
    }
  });

  // Prueba 15: Verificar relación uno a muchos
  await ejecutarPrueba('Verificar relación uno a muchos (Proyecto -> Tarea)', async () => {
    if (!proyectoTest) throw new Error('No hay proyecto para verificar');
    const proyectos = await leerProyectosConTareas();
    const proyecto = proyectos.find(p => p.id === proyectoTest.id);
    if (!proyecto || !proyecto.tareas) {
      throw new Error('La relación uno a muchos no funciona correctamente');
    }
    // Verificar que las tareas tienen el proyectoId correcto
    const tareasIncorrectas = proyecto.tareas.filter(t => t.ProyectoId !== proyecto.id);
    if (tareasIncorrectas.length > 0) {
      throw new Error('Algunas tareas tienen un ProyectoId incorrecto');
    }
  });

  // Prueba 16: Verificar relación muchos a muchos
  await ejecutarPrueba('Verificar relación muchos a muchos (Tarea <-> Empleado)', async () => {
    if (!tareaTest || !empleado1 || !empleado2) {
      throw new Error('Faltan datos para verificar relación muchos a muchos');
    }
    const { Tarea } = require('./models');
    const tareaConEmpleados = await Tarea.findByPk(tareaTest.id, {
      include: [{
        model: require('./models').Empleado,
        as: 'empleados'
      }]
    });
    if (!tareaConEmpleados || !tareaConEmpleados.empleados || tareaConEmpleados.empleados.length < 2) {
      throw new Error('La relación muchos a muchos no funciona correctamente');
    }
    const empleadoIds = tareaConEmpleados.empleados.map(e => e.id);
    if (!empleadoIds.includes(empleado1.id) || !empleadoIds.includes(empleado2.id)) {
      throw new Error('Los empleados no están correctamente asignados a la tarea');
    }
  });

  // Resumen de pruebas
  console.log('\n=== Resumen de pruebas ===');
  console.log(`Pruebas exitosas: ${pruebasExitosas}`);
  console.log(`Pruebas fallidas: ${pruebasFallidas}`);
  console.log(`Total: ${pruebasExitosas + pruebasFallidas}`);

  if (errores.length > 0) {
    console.log('\nErrores encontrados:');
    errores.forEach(({ nombre, error }) => {
      console.log(`  - ${nombre}: ${error}`);
    });
  }

  await sequelize.close();
}

ejecutarPruebas().catch(console.error);

