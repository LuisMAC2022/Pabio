# Plan de implementación por fases: flujo por pasos en `crear-orden.html`

## Objetivo
Implementar un flujo tipo wizard **mobile first** que muestre **un paso a la vez**, oculte el anterior al avanzar y permita navegar con botones **Atrás** y **Siguiente/Finalizar**, bloqueando el avance hasta cumplir los requisitos de cada paso.

## Fase 1 — Estructura semántica del flujo
- Identificar y ordenar los pasos actuales del formulario.
- Envolver cada paso en una sección semántica (`section`) con un identificador de paso (`data-step`).
- Dejar visible solo el primer paso al cargar.
- Añadir encabezado de contexto con título del paso y estado “Paso X de Y”.

### Criterio de salida
- Existe una estructura clara por pasos y solo el paso inicial está visible por defecto.

## Fase 2 — Navegación inferior mobile first
- Agregar una barra de navegación inferior con dos botones:
  - **Atrás**
  - **Siguiente** (cambia a **Finalizar** en el último paso)
- Configurar estados iniciales:
  - **Atrás** deshabilitado en el primer paso.
  - **Siguiente** deshabilitado hasta validar el paso actual.
- Diseñar la barra para uso táctil (botones amplios, separación suficiente, alto contraste).

### Criterio de salida
- El usuario puede navegar entre pasos desde controles inferiores sin depender del scroll largo.

## Fase 3 — Lógica de visibilidad (un solo paso activo)
- Implementar controlador de estado (`currentStep`).
- Al avanzar o retroceder:
  - Ocultar paso actual.
  - Mostrar únicamente el nuevo paso.
- Actualizar indicador “Paso X de Y” en cada transición.

### Criterio de salida
- Nunca hay más de un paso visible al mismo tiempo.

## Fase 4 — Validación por paso y control de avance
- Definir reglas de validación por cada paso.
- Reutilizar validación nativa HTML5 (`required`, `type`, `pattern`, `min`, `max`) para minimizar JS.
- Habilitar **Siguiente** solo cuando el paso actual sea válido.
- Mostrar mensajes de error concretos y cercanos al campo.

### Criterio de salida
- No se puede avanzar si el paso actual no cumple sus requisitos.

## Fase 5 — Accesibilidad (WCAG 2.1 AA)
- Garantizar asociación correcta `label`–campo en todos los inputs.
- Gestionar foco al cambiar de paso (enviar foco al encabezado del paso activo).
- Añadir anuncio de cambio de paso para lector de pantalla con región `aria-live="polite"`.
- Vincular mensajes de error mediante `aria-describedby` cuando aplique.
- Verificar navegación completa por teclado (Tab/Shift+Tab) y foco visible.

### Criterio de salida
- Flujo utilizable con teclado y comprensible para lectores de pantalla.

## Fase 6 — Ajuste visual y rendimiento mobile first
- Aplicar estilos base para pantallas pequeñas primero.
- Asegurar que la barra inferior no tape contenido (espaciado inferior del contenedor principal).
- Mantener DOM simple y evitar dependencias externas.
- Usar solo JS imprescindible para comportamiento del wizard.

### Criterio de salida
- Flujo fluido en móvil, con carga ligera y buena legibilidad.

## Fase 7 — Persistencia, revisión final y QA
- Confirmar que al volver atrás se conservan los datos ingresados.
- Ajustar botón final para envío seguro (deshabilitar durante envío y mostrar estado de proceso).
- Ejecutar pruebas manuales de regresión:
  - Avanzar/retroceder en todos los pasos.
  - Validaciones correctas por paso.
  - Comportamiento en viewport móvil.
  - Navegación por teclado y lector de pantalla.

### Criterio de salida
- Flujo estable, accesible y listo para integrarse en producción.

---

## Entregables
1. Estructura de pasos semántica en `crear-orden.html`.
2. Navegación inferior con botones Atrás/Siguiente/Finalizar.
3. Validación por paso con bloqueo de avance.
4. Mejoras de accesibilidad y foco.
5. Ajustes mobile first y checklist de QA completado.
