# Documentación de Pruebas

Este documento explica las pruebas implementadas en el archivo `pruebas.js` y por qué fueron necesarias para validar el correcto funcionamiento del sistema de gestión de proyectos y tareas.

## Propósito de las Pruebas

Implementé un conjunto completo de pruebas automatizadas para asegurarme de que todas las funcionalidades del sistema funcionan correctamente. Las pruebas verifican tanto los casos exitosos como los casos de error, lo cual es fundamental para garantizar la robustez del sistema.

## Estructura de las Pruebas

Las pruebas están organizadas en un archivo único `pruebas.js` que ejecuta una suite completa de validaciones. Cada prueba verifica un aspecto específico del sistema y proporciona retroalimentación clara sobre si pasó o falló.

## Pruebas Implementadas

### Pruebas de Creación de Proyectos

Creé pruebas para verificar que los proyectos se pueden crear correctamente con todos los datos requeridos. También incluí una prueba que valida que el sistema rechaza correctamente la creación de proyectos sin datos obligatorios, como el nombre. Esto es importante porque asegura que la validación de datos funciona como se espera.

### Pruebas de Creación de Tareas

Las pruebas de tareas verifican que se pueden crear tareas asociadas a un proyecto existente. También validé que el sistema detecta correctamente cuando se intenta crear una tarea asociada a un proyecto que no existe. Esta validación es crucial porque previene errores de integridad referencial.

### Pruebas de Creación de Empleados

Implementé pruebas para crear empleados y verificar que el sistema rechaza la creación de empleados con emails duplicados, ya que el email debe ser único. Esta prueba asegura que la restricción de unicidad funciona correctamente en la base de datos.

### Pruebas de Asignación de Empleados a Tareas

Las pruebas de asignación verifican que se pueden asignar múltiples empleados a una tarea, lo cual es fundamental para la relación muchos a muchos. También validé que el sistema detecta correctamente cuando se intenta asignar empleados a una tarea que no existe.

### Pruebas de Lectura de Datos

Incluí pruebas para verificar que se pueden leer correctamente los proyectos junto con sus tareas asociadas. Esta prueba es importante porque valida que las relaciones entre modelos funcionan correctamente y que las consultas con includes devuelven los datos esperados.

### Pruebas de Actualización

Las pruebas de actualización verifican que se pueden modificar los datos de una tarea, como su estado o título. También validé que el sistema rechaza correctamente estados inválidos y que detecta cuando se intenta actualizar una tarea que no existe.

### Pruebas de Eliminación

Implementé pruebas para verificar que se pueden eliminar proyectos y que sus tareas asociadas se eliminan automáticamente debido a la relación CASCADE. También validé que el sistema detecta correctamente cuando se intenta eliminar un proyecto que no existe.

### Pruebas de Relaciones

Creé pruebas específicas para validar que las relaciones entre modelos funcionan correctamente:

- La relación uno a muchos entre Proyecto y Tarea, verificando que las tareas tienen el ProyectoId correcto.

- La relación muchos a muchos entre Tarea y Empleado, verificando que los empleados asignados a una tarea se pueden recuperar correctamente y que la asignación bidireccional funciona.

## Por Qué Estas Pruebas Son Importantes

Las pruebas me permiten tener confianza en que el código funciona correctamente antes de usarlo en un entorno de producción. Cada prueba valida un aspecto específico del sistema, y cuando todas pasan, puedo estar seguro de que:

1. Los modelos se definen correctamente con sus atributos y validaciones.

2. Las relaciones entre modelos funcionan como se espera, tanto para relaciones uno a muchos como para relaciones muchos a muchos.

3. Las operaciones CRUD manejan correctamente tanto los casos exitosos como los casos de error.

4. El sistema previene errores comunes como intentar crear registros con datos inválidos o referenciar registros que no existen.

5. La integridad referencial se mantiene, especialmente con la eliminación en cascada de tareas cuando se elimina un proyecto.

## Ejecución de las Pruebas

Las pruebas se ejecutan de forma independiente y reinician la base de datos antes de comenzar para asegurar un estado limpio. Esto garantiza que cada ejecución de las pruebas comience desde cero y no dependa de datos previos.

Al finalizar, las pruebas muestran un resumen con el número de pruebas exitosas y fallidas, lo que permite identificar rápidamente cualquier problema en el sistema.

## Conclusión

Implementar estas pruebas me ayudó a desarrollar un sistema más robusto y confiable. Cada prueba valida un aspecto específico del sistema, y juntas forman una suite completa que garantiza que todas las funcionalidades principales funcionan correctamente. Las pruebas también sirven como documentación viva del comportamiento esperado del sistema, lo cual es útil tanto para mí como para otros desarrolladores que puedan trabajar con este código en el futuro.

