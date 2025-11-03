const { Proyecto, Tarea, Empleado } = require('./models');

// Crear un proyecto
async function crearProyecto(nombre, descripcion, fecha_inicio, fecha_fin = null) {
  try {
    if (!nombre || !fecha_inicio) {
      throw new Error('El nombre y la fecha de inicio son obligatorios');
    }

    const proyecto = await Proyecto.create({
      nombre,
      descripcion,
      fecha_inicio,
      fecha_fin
    });

    console.log('Proyecto creado exitosamente:', proyecto.toJSON());
    return proyecto;
  } catch (error) {
    console.error('Error al crear proyecto:', error.message);
    throw error;
  }
}

// Crear una tarea
async function crearTarea(titulo, descripcion, estado, fecha_vencimiento, proyectoId) {
  try {
    if (!titulo || !proyectoId) {
      throw new Error('El título y el ID del proyecto son obligatorios');
    }

    // Verificar que el proyecto existe
    const proyecto = await Proyecto.findByPk(proyectoId);
    if (!proyecto) {
      throw new Error(`No se encontró el proyecto con ID ${proyectoId}`);
    }

    if (estado && !['pendiente', 'en progreso', 'completada'].includes(estado)) {
      throw new Error('El estado debe ser: pendiente, en progreso o completada');
    }

    const tarea = await Tarea.create({
      titulo,
      descripcion,
      estado: estado || 'pendiente',
      fecha_vencimiento,
      ProyectoId: proyectoId
    });

    console.log('Tarea creada exitosamente:', tarea.toJSON());
    return tarea;
  } catch (error) {
    console.error('Error al crear tarea:', error.message);
    throw error;
  }
}

// Asignar empleados a una tarea
async function asignarEmpleadosATarea(tareaId, empleadoIds) {
  try {
    if (!tareaId || !empleadoIds || !Array.isArray(empleadoIds)) {
      throw new Error('El ID de la tarea y un array de IDs de empleados son obligatorios');
    }

    // Verificar que la tarea existe
    const tarea = await Tarea.findByPk(tareaId);
    if (!tarea) {
      throw new Error(`No se encontró la tarea con ID ${tareaId}`);
    }

    // Verificar que los empleados existen
    const empleados = await Empleado.findAll({
      where: {
        id: empleadoIds
      }
    });

    if (empleados.length !== empleadoIds.length) {
      const encontrados = empleados.map(e => e.id);
      const noEncontrados = empleadoIds.filter(id => !encontrados.includes(id));
      throw new Error(`No se encontraron los empleados con IDs: ${noEncontrados.join(', ')}`);
    }

    await tarea.setEmpleados(empleadoIds);
    const tareaConEmpleados = await Tarea.findByPk(tareaId, {
      include: [{
        model: Empleado,
        as: 'empleados'
      }]
    });

    console.log('Empleados asignados exitosamente a la tarea');
    return tareaConEmpleados;
  } catch (error) {
    console.error('Error al asignar empleados a tarea:', error.message);
    throw error;
  }
}

// Leer proyectos y sus tareas
async function leerProyectosConTareas() {
  try {
    const proyectos = await Proyecto.findAll({
      include: [{
        model: Tarea,
        as: 'tareas',
        include: [{
          model: Empleado,
          as: 'empleados'
        }]
      }]
    });

    console.log(`Se encontraron ${proyectos.length} proyecto(s)`);
    proyectos.forEach(proyecto => {
      console.log(`\nProyecto: ${proyecto.nombre}`);
      console.log(`  Descripción: ${proyecto.descripcion || 'N/A'}`);
      console.log(`  Tareas: ${proyecto.tareas.length}`);
      proyecto.tareas.forEach(tarea => {
        console.log(`    - ${tarea.titulo} (${tarea.estado})`);
        if (tarea.empleados && tarea.empleados.length > 0) {
          console.log(`      Empleados: ${tarea.empleados.map(e => e.nombre).join(', ')}`);
        }
      });
    });

    return proyectos;
  } catch (error) {
    console.error('Error al leer proyectos:', error.message);
    throw error;
  }
}

// Actualizar una tarea
async function actualizarTarea(tareaId, datosActualizados) {
  try {
    if (!tareaId) {
      throw new Error('El ID de la tarea es obligatorio');
    }

    // Verificar que la tarea existe
    const tarea = await Tarea.findByPk(tareaId);
    if (!tarea) {
      throw new Error(`No se encontró la tarea con ID ${tareaId}`);
    }

    // Validar estado si se proporciona
    if (datosActualizados.estado &&
        !['pendiente', 'en progreso', 'completada'].includes(datosActualizados.estado)) {
      throw new Error('El estado debe ser: pendiente, en progreso o completada');
    }

    await tarea.update(datosActualizados);
    const tareaActualizada = await Tarea.findByPk(tareaId);

    console.log('Tarea actualizada exitosamente:', tareaActualizada.toJSON());
    return tareaActualizada;
  } catch (error) {
    console.error('Error al actualizar tarea:', error.message);
    throw error;
  }
}

// Eliminar un proyecto y sus tareas
async function eliminarProyecto(proyectoId) {
  try {
    if (!proyectoId) {
      throw new Error('El ID del proyecto es obligatorio');
    }

    // Verificar que el proyecto existe
    const proyecto = await Proyecto.findByPk(proyectoId, {
      include: [{
        model: Tarea,
        as: 'tareas'
      }]
    });

    if (!proyecto) {
      throw new Error(`No se encontró el proyecto con ID ${proyectoId}`);
    }

    const numTareas = proyecto.tareas.length;
    await proyecto.destroy();

    console.log(`Proyecto eliminado exitosamente. Se eliminaron ${numTareas} tarea(s) asociada(s)`);
    return { proyectoId, tareasEliminadas: numTareas };
  } catch (error) {
    console.error('Error al eliminar proyecto:', error.message);
    throw error;
  }
}

// Crear empleado (función auxiliar)
async function crearEmpleado(nombre, email) {
  try {
    if (!nombre || !email) {
      throw new Error('El nombre y el email son obligatorios');
    }

    const empleado = await Empleado.create({
      nombre,
      email
    });

    console.log('Empleado creado exitosamente:', empleado.toJSON());
    return empleado;
  } catch (error) {
    console.error('Error al crear empleado:', error.message);
    // Si es un error de validación de Sequelize (email duplicado, etc.)
    if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError') {
      throw new Error('El email ya existe o es inválido');
    }
    throw error;
  }
}

module.exports = {
  crearProyecto,
  crearTarea,
  asignarEmpleadosATarea,
  leerProyectosConTareas,
  actualizarTarea,
  eliminarProyecto,
  crearEmpleado
};

