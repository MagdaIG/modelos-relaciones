# Sistema de Gestión de Proyectos y Tareas con Sequelize

Este proyecto implementa un sistema de gestión de proyectos y tareas utilizando Sequelize ORM, demostrando las relaciones entre modelos (uno a muchos y muchos a muchos) y operaciones CRUD completas.

## Autor

Magdalena Inalaf

- GitHub: https://github.com/MagdaIG
- LinkedIn: https://www.linkedin.com/in/minalaf/
- Página web: https://inalaf.ca/
- Email: magda.inalaf@gmail.com

## Descripción

El sistema permite gestionar proyectos y sus tareas asociadas, así como asignar empleados a las tareas. Implementa las siguientes funcionalidades:

- Modelos: Proyecto, Tarea y Empleado
- Relaciones: Uno a muchos (Proyecto -> Tarea) y muchos a muchos (Tarea <-> Empleado)
- Operaciones CRUD completas con manejo de errores

## Estructura del Proyecto

```
modelos-relaciones/
├── config/
│   └── database.js          # Configuración de Sequelize
├── models/
│   ├── Proyecto.js          # Modelo de Proyecto
│   ├── Tarea.js             # Modelo de Tarea
│   ├── Empleado.js          # Modelo de Empleado
│   └── index.js             # Definición de relaciones
├── operaciones.js            # Funciones CRUD
├── index.js                  # Archivo principal con ejemplo de uso
├── pruebas.js                # Suite de pruebas
├── package.json              # Dependencias del proyecto
└── README.md                 # Este archivo
```

## Requisitos Previos

- Node.js (versión 14 o superior)
- npm (Node Package Manager)

## Instalación

1. Clonar o descargar el proyecto
2. Instalar las dependencias:

```bash
npm install
```

## Configuración

El proyecto utiliza SQLite como base de datos por defecto. La base de datos se creará automáticamente en el archivo `database.sqlite` en la raíz del proyecto al ejecutar la aplicación por primera vez.

## Uso

### Ejecutar el ejemplo principal

Para ejecutar el archivo principal con ejemplos de uso de las operaciones CRUD:

```bash
npm start
```

Este comando ejecutará `index.js`, que muestra ejemplos de cómo crear proyectos, tareas, asignar empleados y realizar operaciones CRUD.

### Ejecutar las pruebas

Para ejecutar la suite de pruebas que verifica todas las funcionalidades:

```bash
npm test
```

Este comando ejecutará `pruebas.js`, que contiene pruebas automatizadas para todas las operaciones CRUD y relaciones.

## Modelos

### Proyecto

Atributos:
- `id`: Identificador único (auto-incrementable)
- `nombre`: Nombre del proyecto (STRING, obligatorio)
- `descripcion`: Descripción del proyecto (TEXT, opcional)
- `fecha_inicio`: Fecha de inicio del proyecto (DATE, obligatorio)
- `fecha_fin`: Fecha de fin del proyecto (DATE, opcional)

### Tarea

Atributos:
- `id`: Identificador único (auto-incrementable)
- `titulo`: Título de la tarea (STRING, obligatorio)
- `descripcion`: Descripción de la tarea (TEXT, opcional)
- `estado`: Estado de la tarea (STRING, valores: "pendiente", "en progreso", "completada")
- `fecha_vencimiento`: Fecha de vencimiento (DATE, opcional)
- `ProyectoId`: Referencia al proyecto al que pertenece (INTEGER, obligatorio)

### Empleado

Atributos:
- `id`: Identificador único (auto-incrementable)
- `nombre`: Nombre del empleado (STRING, obligatorio)
- `email`: Email del empleado (STRING, único, obligatorio)

## Relaciones

### Relación Uno a Muchos: Proyecto -> Tarea

Un proyecto puede tener muchas tareas. Una tarea pertenece a un único proyecto.

- Implementada usando `Proyecto.hasMany(Tarea)` y `Tarea.belongsTo(Proyecto)`
- Cuando se elimina un proyecto, sus tareas se eliminan automáticamente (CASCADE)

### Relación Muchos a Muchos: Tarea <-> Empleado

Un empleado puede estar asignado a muchas tareas. Una tarea puede tener muchos empleados asignados.

- Implementada usando `Tarea.belongsToMany(Empleado)` y `Empleado.belongsToMany(Tarea)`
- Utiliza una tabla intermedia `TareasEmpleados` para gestionar la relación

## Operaciones CRUD

Todas las operaciones están implementadas en `operaciones.js` con manejo de errores:

### Crear Proyecto

```javascript
const proyecto = await crearProyecto(
  'Nombre del Proyecto',
  'Descripción del proyecto',
  new Date('2024-01-01'),
  new Date('2024-12-31')
);
```

### Crear Tarea

```javascript
const tarea = await crearTarea(
  'Título de la tarea',
  'Descripción de la tarea',
  'pendiente',
  new Date('2024-02-15'),
  proyectoId
);
```

### Crear Empleado

```javascript
const empleado = await crearEmpleado(
  'Nombre del Empleado',
  'email@example.com'
);
```

### Asignar Empleados a Tarea

```javascript
await asignarEmpleadosATarea(tareaId, [empleadoId1, empleadoId2]);
```

### Leer Proyectos con Tareas

```javascript
const proyectos = await leerProyectosConTareas();
```

### Actualizar Tarea

```javascript
await actualizarTarea(tareaId, {
  estado: 'en progreso',
  titulo: 'Nuevo título'
});
```

### Eliminar Proyecto

```javascript
await eliminarProyecto(proyectoId);
```

Nota: Al eliminar un proyecto, todas sus tareas asociadas se eliminan automáticamente debido a la relación CASCADE.

## Manejo de Errores

Todas las operaciones incluyen validación y manejo de errores:

- Validación de datos obligatorios
- Verificación de existencia de registros antes de operaciones
- Validación de estados permitidos para tareas
- Validación de emails únicos para empleados
- Manejo de relaciones (proyectos, tareas, empleados inexistentes)

## Base de Datos

El proyecto utiliza SQLite como base de datos. El archivo `database.sqlite` se crea automáticamente al ejecutar la aplicación por primera vez.

Para cambiar la base de datos, modifique el archivo `config/database.js` y ajuste la configuración de Sequelize según sea necesario.

## Dependencias

- `sequelize`: ORM para Node.js
- `sqlite3`: Driver para SQLite

## Licencia

ISC

## Notas Adicionales

- Las pruebas reinician la base de datos cada vez que se ejecutan (force: true)
- El ejemplo principal (index.js) no elimina la base de datos, solo crea y muestra datos
- Todas las operaciones son asíncronas y utilizan async/await
- Los modelos no incluyen timestamps (createdAt, updatedAt) por defecto

