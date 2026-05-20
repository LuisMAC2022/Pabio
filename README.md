# Pabio - Control de archivos

## Cómo abrir
Abrir `index.html` con un servidor estático (por ejemplo `python -m http.server`).

## Flujo rápido
1. Crear orden.
2. Revisar órdenes.
3. Ajustar inventario.
4. Contrastar y generar solicitud.

## Qué hace falta para ejecutar la demo MVP (20–25 min)

### 1) Preparación técnica (5 min antes)
- Levantar servidor local desde la raíz del proyecto:
  - `python -m http.server 8000`
- Abrir `http://localhost:8000`.
- Verificar que cargan las vistas de `Órdenes`, `Inventario` y `Solicitudes`.
- Confirmar que existe data base en `localStorage` (o limpiar y recargar para inicializar semillas).

### 2) Preparación de datos (inventario mínimo)
Asegurar estos materiales y cantidades para que los 3 casos salgan como se espera:

| Material | Disponible |
|---|---:|
| Llave mezcladora | 1 pieza |
| Guantes de látex | 20 pares |
| Foco LED 12W | 10 piezas |
| Cinta aislante | 3 piezas |
| Detergente multiusos | 5 litros |

### 3) Guion operativo sugerido
Orden recomendado en vivo: **Alta → Media → Baja**.

#### Caso 1 (Alta) — Sin faltantes
1. Crear orden (Plomería, fuga en sanitarios, prioridad Alta).
2. Pasar a `En revisión`.
3. Ejecutar `Contrastar materiales`.
4. Validar resultado: `Contrastada — sin faltantes`.
5. Aprobación manual a `Lista para realizar`.
6. Cerrar en `Terminada`.

#### Caso 2 (Media) — Faltante parcial con compra
1. Crear orden (Eléctrico, cambio de luminarias, prioridad Media).
2. Pasar a `En revisión`.
3. Contrastar materiales:
   - Foco LED 12W requerido 12, disponible 10, faltan 2.
4. Generar solicitud de compra (`Generar solicitud de compra`).
5. Orden queda en `En espera de materiales`.
6. En solicitudes: marcar `Comprado` y luego `Recibido`.
7. Actualizar inventario manualmente (sumar 2 focos).
8. Aprobar orden a `Lista para realizar` y cerrar en `Terminada`.

#### Caso 3 (Baja) — Trabajo rutinario
1. Crear orden de limpieza/mantenimiento menor (prioridad Baja).
2. Mantener visible en listado para mostrar priorización.
3. Contrastar sin faltantes.
4. Aprobar cuando haya capacidad.
5. Cerrar en `Terminada`.

### 4) Mensajes clave para la audiencia
- El sistema prioriza urgencias sin perder trazabilidad.
- El contraste detecta faltantes y dispara compra por orden.
- La aprobación y la actualización de inventario son **manuales por diseño** en el MVP.

### 5) Material de apoyo (slides)
1. Objetivo y alcance MVP.
2. Arquitectura simple (localStorage + CRUD + contraste).
3. Flujo de estados de orden.
4. Caso Alta (tabla Material/Requerido/Disponible/Faltante/Acción).
5. Caso Media (misma tabla).
6. Caso Baja (misma tabla).
7. Lecciones y siguientes pasos.
