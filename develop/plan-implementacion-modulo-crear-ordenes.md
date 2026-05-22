# Implementación por fases: Módulo "Crear Órdenes"

## Objetivo
Implementar un flujo guiado para crear órdenes de servicio con validación de ID, selección jerárquica de tipo/categoría, captura de descripción y descarga de PDF final.

## Alcance funcional del flujo
1. Validar ID de usuario contra `data/directorio` a partir del formato `IB-PA-XXXXX` (el usuario solo captura `XXXXX`).
2. Permitir selección de tipo de servicio:
   - Infraestructura
   - Equipos y Vehiculos
3. Mostrar categorías dependientes del tipo de servicio seleccionado.
4. Capturar descripción manual del problema.
5. Al finalizar, generar y descargar un PDF con resumen de la orden.

---

## Fase 0 — Preparación técnica
### Entregables
- Definir estructura mínima de archivos del módulo.
- Confirmar el formato del directorio de IDs (`JSON`, `CSV` o equivalente).
- Definir contrato de datos para la orden.

### Tareas
- Crear estructura base (ejemplo):
  - `src/modules/ordenes/` (vista/plantilla)
  - `src/modules/ordenes/logic/` (validaciones y flujo)
  - `src/modules/ordenes/services/` (lectura de directorio y exportación PDF)
- Documentar objeto de trabajo en memoria:
  ```txt
  {
    idNumero,
    idCompleto,
    tipoServicio,
    categoriaServicio,
    descripcion
  }
  ```

### Criterios de aceptación
- Se puede identificar con claridad dónde vive cada responsabilidad (UI, lógica, servicios).
- Existe definición única del modelo de datos de la orden.

---

## Fase 1 — UI semántica y accesible del formulario
### Entregables
- Formulario HTML5 semántico y navegable por teclado.
- Flujo visual por pasos con jerarquía clara.

### Tareas
- Usar estructura semántica: `header`, `main`, `section`, `form`, `fieldset`, `legend`, `footer`.
- Agregar `h1` único y encabezados por paso (`h2`).
- Incluir skip link (`Saltar al contenido`).
- Definir controles:
  - Paso 1: input para `XXXXX` con `label`, `required`, ayuda y validación base.
  - Paso 2: radios para tipo de servicio.
  - Paso 3: control de categoría dinámico (radios o select).
  - Paso 4: `textarea` para descripción.
  - Paso 5: botón `Finalizar`.
- Añadir región para mensajes de estado/errores (`aria-live="polite"`).

### Criterios de aceptación
- Todos los campos tienen `label` asociado.
- Se puede recorrer y operar el formulario completo solo con teclado.
- El DOM es simple, sin contenedores innecesarios.

---

## Fase 2 — Validación de ID y control de avance
### Entregables
- Validación funcional de ID contra `data/directorio`.
- Bloqueo/desbloqueo de pasos según estado de validación.

### Tareas
- Normalizar entrada del usuario (solo parte numérica).
- Construir ID completo como `IB-PA-${XXXXX}`.
- Consultar directorio y validar existencia.
- Si no existe, mostrar mensaje exacto:
  - `ID no localizado en la base de datos`
- Si existe, habilitar paso 2 y posteriores.
- Deshabilitar botón `Finalizar` mientras haya datos faltantes.

### Criterios de aceptación
- ID inválido nunca permite avanzar.
- ID válido habilita el flujo sin recargar página.
- El mensaje de error es claro y consistente con el requerimiento.

---

## Fase 3 — Lógica dependiente tipo/categoría
### Entregables
- Catálogo de categorías condicionado por tipo de servicio.

### Tareas
- Definir catálogo:
  - **Infraestructura** → Albañilería, Carpintería, Electricidad, Herrería, Pintura, Plomería, Otro.
  - **Equipos y Vehiculos** → Mecánica, Refrigeración, Aire Acondicionado, Equipo de Computo, Reparación de Equipo, Planta de Luz, Otro.
- Al seleccionar tipo:
  - Renderizar solo categorías correspondientes.
  - Limpiar cualquier categoría previa incompatible.
- Validar que solo pueda elegirse una categoría.

### Criterios de aceptación
- Nunca se muestran categorías incorrectas para el tipo elegido.
- Cambiar de tipo reinicia selección de categoría de forma segura.

---

## Fase 4 — Captura y validación de descripción
### Entregables
- Campo de descripción obligatorio con validación y mensajes accesibles.

### Tareas
- Implementar `textarea` con `required`.
- Agregar validaciones mínimas (por ejemplo, longitud mínima sugerida).
- Asociar mensajes de ayuda/error con `aria-describedby`.

### Criterios de aceptación
- No se permite finalizar sin descripción.
- Usuario recibe feedback claro si la descripción no cumple reglas.

---

## Fase 5 — Generación y descarga de PDF
### Entregables
- Descarga de PDF al hacer clic en `Finalizar`.

### Tareas
- Consolidar payload final de orden.
- Generar PDF con los campos:
  1. ID
  2. Tipo de servicio
  3. Categoría del servicio
  4. Descripción
- Forzar descarga automática con nombre de archivo descriptivo (sugerido):
  - `orden_IB-PA-XXXXX_YYYYMMDD_HHMM.pdf`

### Criterios de aceptación
- El PDF siempre refleja exactamente la selección actual del formulario.
- La descarga funciona en los navegadores objetivo del proyecto.

---

## Fase 6 — Pruebas funcionales, a11y y rendimiento
### Entregables
- Lista de pruebas ejecutadas y resultados.

### Tareas
- Pruebas funcionales por paso (happy path + errores).
- Pruebas de teclado: navegación, foco visible, activación de controles.
- Revisión básica de accesibilidad (labels, jerarquía de encabezados, mensajes).
- Verificar que el módulo use JS mínimo indispensable y sin dependencias pesadas.

### Criterios de aceptación
- Flujo completo estable de punta a punta.
- Accesibilidad base WCAG 2.1 AA razonablemente cubierta para este alcance.
- Sin regresiones de rendimiento evidentes (DOM compacto y lógica ligera).

---

## Riesgos y decisiones abiertas
- Formato real de `data/directorio` puede requerir adaptador específico.
- Estrategia de PDF (librería interna vs implementación existente) debe alinearse al stack del proyecto.
- Definir longitud/validaciones exactas de `XXXXX` según reglas de negocio finales.

## Resultado esperado
Al concluir estas fases, el módulo permitirá crear órdenes de forma guiada, accesible y eficiente, con validación de ID, selección contextual de servicio y exportación del resumen en PDF.
