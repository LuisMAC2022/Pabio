# Manual de estilo para prototipo del sistema de control de reportes

Quiero desarrollar un primer prototipo funcional de un sistema sencillo de control de reportes para el Pabellón de la Biodiversidad.
La demo estará desplegada en GitHub Pages.

El objetivo principal no es crear un sistema complejo, sino una versión mínima, clara y operativa que permita validar el flujo básico:

**reporte → validación → inventario → contraste → solicitud de compra**

El sistema debe priorizar simplicidad, claridad, trazabilidad mínima y facilidad de uso. Las mejoras avanzadas se agregarán después, cuando el primer prototipo funcione.

---

## 1. Principio general

Desarrolla el sistema como un MVP operativo.

- Evita sobreingeniería. Mantén el mínimo funcional.
- Evita automatizaciones complejas. Debe existir una aprobación manual entre fases.
- Evita dashboards innecesarios. Preferible generar reportes intermedios descargables.
- Evita módulos secundarios. Si los consideras necesarios, eleva la solicitud durante el desarrollo para evaluación.

El sistema debe resolver tres preguntas básicas:

1. ¿Qué servicio se necesita?
2. ¿Qué materiales hay disponibles?
3. ¿Qué materiales faltan y deben comprarse?

---

## 2. Módulos principales

El sistema tendrá solo tres módulos principales.

### Módulo 1: Reportes / Órdenes de servicio

Permite que un empleado registre una orden de servicio. La cual será validada por el encargado del área de mantenimiento.

**Campos mínimos:**

| Campo | Tipo |
|---|---|
| Folio | Autogenerado |
| Fecha de creación | Autollenado |
| Identificador del solicitante | Ingresado por el usuario |
| Área o ubicación | Ingresado por el usuario |
| Tipo de servicio | Ingresado por el usuario |
| Descripción del problema | Ingresado por el usuario |
| **Prioridad** | **Ingresado por el usuario** |
| Estado de la orden | Autogenerado |
| Materiales requeridos | Ingresado por el usuario |

> ✏️ **Cambio:** Se agrega el campo **Prioridad** como campo ingresado por el usuario. Valores permitidos: `Alta`, `Media`, `Baja`. Este campo estaba presente en los datos de ejemplo (Sección 7) pero no estaba declarado en los campos del módulo.

**Estados mínimos:**

| Estado | Descripción semántica |
|---|---|
| `Nueva` | La orden fue creada por el empleado y aún no ha sido revisada. |
| `En revisión` | El encargado de mantenimiento tomó la orden y está evaluando los materiales requeridos. |
| `Contrastada — sin faltantes` | Se realizó el contraste con inventario y todos los materiales están disponibles. Pendiente de aprobación manual para proceder. |
| `Lista para realizar` | El encargado aprobó la orden tras verificar que no hay faltantes. Se puede ejecutar el servicio. |
| `En espera de materiales` | El contraste detectó faltantes. Se generó solicitud de compra. La orden espera que los materiales sean recibidos. |
| `Terminada` | El servicio fue ejecutado y cerrado. |
| `Cancelada` | La orden fue cancelada antes de completarse. |

> ✏️ **Cambio:** Se agrega la semántica explícita de cada estado para guiar las transiciones manuales del sistema. Se añade el estado transitorio `Contrastada — sin faltantes` para representar el momento entre el contraste y la aprobación final, cuando no hay faltantes.

**Diagrama de transición de estados:**

```
Nueva
  └─► En revisión          (aprobación manual: encargado toma la orden)
        └─► Contrastada — sin faltantes   (contraste ejecutado, sin faltantes)
        │         └─► Lista para realizar  (aprobación manual: encargado confirma)
        │                   └─► Terminada
        └─► En espera de materiales        (contraste ejecutado, hay faltantes)
                  └─► Lista para realizar  (materiales recibidos, aprobación manual)
                            └─► Terminada

Cancelada  (puede ocurrir desde cualquier estado salvo Terminada)
```

No agregar estados extra por ahora.

---

### Módulo 2: Inventario

Permite registrar materiales disponibles. Para la primera demo será un inventario simulado.

**Campos mínimos:**

| Campo | Descripción |
|---|---|
| ID de material | Identificador único |
| Nombre del material | Nombre claro y distinguible |
| Categoría | Ver lista de categorías |
| Cantidad disponible | Stock libre, no reservado |
| **Cantidad reservada** | **Unidades apartadas por órdenes en curso, pendientes de aprobación** |
| Unidad de medida | Ver lista de unidades |

> ✏️ **Cambio:** Se agrega el campo **`cantidadReservada`** al inventario. Representa las unidades apartadas por órdenes que ya realizaron el contraste pero aún no han sido aprobadas ni ejecutadas. Este campo **no descuenta el stock automáticamente**: se actualiza de forma manual por el encargado al aprobar una orden. El campo **no afecta el cálculo de faltantes** en el contraste — ese cálculo usa únicamente `cantidadDisponible` — pero es visible en la ficha del material para que el encargado tome decisiones informadas.

**Categorías sugeridas:**

- Eléctrico
- Plomería
- Limpieza
- Herramientas
- Consumibles
- Otro

**Unidades de medida (explícitas, sin mezclar sin conversión manual):**

- pieza
- metro
- litro
- kilogramo
- caja
- paquete

---

### Módulo 3: Contraste de materiales

Compara los materiales requeridos por una orden contra el inventario disponible.

Genera una tabla simple:

| Material | Requerido | Disponible | Faltante | Acción |
|---|---|---|---|---|
| Foco LED 12W | 12 pz | 10 pz | 2 pz | Solicitar compra |
| Cinta aislante | 2 pz | 3 pz | 0 pz | Disponible |

**Regla principal:**

```
faltante = max(0, requerido - disponible)
```

**Acciones posibles:**

- `Disponible`
- `Parcialmente disponible`
- `Solicitar compra`

Si hay faltantes, el sistema debe generar una solicitud única de compra para esa orden.

En el primer prototipo, no es necesario consolidar compras de muchas órdenes. Eso puede agregarse después.

---

## 3. Solicitud de compra

La solicitud de compra debe ser sencilla.

**Campos mínimos:**

| Campo | Tipo |
|---|---|
| Folio de solicitud | Autogenerado |
| Fecha de generación | Autollenado |
| Orden de servicio relacionada | Referencia al folio de la orden |
| **Solicitante** | **Heredado de la orden relacionada** |
| **Área o ubicación** | **Heredado de la orden relacionada** |
| **Tipo de servicio** | **Heredado de la orden relacionada** |
| Lista de materiales faltantes | Generada desde el contraste |
| Cantidad requerida | Por material |
| Unidad | Por material |
| Estado | Ver estados |

> ✏️ **Cambio:** Se especifica que los campos **Solicitante**, **Área o ubicación** y **Tipo de servicio** se heredan de la orden relacionada al momento de generar la solicitud. Esto garantiza trazabilidad sin duplicar captura manual de datos.

**Estados mínimos:**

| Estado | Descripción |
|---|---|
| `Pendiente` | La solicitud fue generada y está esperando gestión de compra. |
| `Comprado` | Los materiales fueron adquiridos. |
| `Recibido` | Los materiales fueron recibidos físicamente. El encargado debe actualizar el inventario. |
| `Cancelado` | La solicitud fue cancelada. |

No agregar flujo de aprobación avanzado en el primer prototipo.

---

## 4. Reglas del sistema

El sistema debe respetar estas reglas básicas:

- Toda orden debe tener un folio único.
- Todo material debe tener un nombre único o claramente distinguible.
- No se deben permitir cantidades negativas.
- Tras generar una orden ocurre una validación manual para realizar el contraste con inventario.
- No realizar contraste si la orden no tiene materiales requeridos.
- No generar solicitud de compra si no hay faltantes.
- Una orden sin faltantes queda en estado `Contrastada — sin faltantes`, y pasa a `Lista para realizar` tras aprobación manual.
- Tras realizar el contraste se espera una aprobación manual.
- Una orden con faltantes queda en estado `En espera de materiales`.
- Al registrar materiales recibidos, se debe aumentar el inventario manualmente.
- El sistema no debe descontar inventario automáticamente, pero sí registrar `cantidadReservada` de forma manual al aprobar una orden.
- Todas las operaciones deben ser entendibles para un usuario no técnico.

---

## 5. Estilo visual

Diseñar una interfaz sobria, limpia y funcional.

**Prioridades visuales:**

- Claridad sobre decoración
- Boxes con esquinas rectas, no curvas
- Formularios simples
- Tablas legibles
- Botones con nombres explícitos
- Colores usados con moderación
- Estados visibles mediante etiquetas

**Paleta de colores:**

| Uso | Color |
|---|---|
| Fondo general | Azul muy claro |
| Tarjetas / secciones de usuario | Blanco |
| Secciones autogeneradas | Gris claro |
| Acciones principales | Azul |
| Advertencias | Amarillo |
| Disponible / completo | Verde |
| Faltantes / cancelaciones | Rojo |

No usar efectos visuales complejos.  
No usar animaciones innecesarias.  
No usar interfaces saturadas.

---

## 6. Estilo de interacción

El sistema debe sentirse como una herramienta administrativa sencilla.

**Cada pantalla responde a una tarea concreta. El sistema navega entre páginas independientes:**

> ✏️ **Cambio:** Se especifica que el sistema **no es una sola página con scroll**. La navegación entre vistas es explícita mediante un menú de navegación. Cada vista es una pantalla independiente con una única función.

| Vista | Función |
|---|---|
| Crear orden | Registrar una nueva orden de servicio |
| Ver órdenes | Listar y filtrar órdenes existentes |
| Detalle de orden | Ver y editar materiales requeridos, cambiar estado |
| Ver inventario | Consultar stock disponible y reservado |
| Agregar material | Registrar un nuevo material en inventario |
| Contrastar orden | Ejecutar el contraste de materiales de una orden |
| Generar solicitud de compra | Crear solicitud tras detectar faltantes |
| Ver solicitudes | Listar y gestionar solicitudes de compra |

**Los botones deben decir exactamente qué hacen:**

- "Crear orden"
- "Agregar material"
- "Contrastar materiales"
- "Generar solicitud de compra"
- "Marcar como recibido"
- "Cancelar orden"
- "Aprobar y marcar lista para realizar"

**Evitar textos ambiguos:**

- ~~"Procesar"~~
- ~~"Aceptar"~~
- ~~"Continuar"~~
- ~~"Gestionar"~~

---

## 7. Datos mínimos recomendados para pruebas

**Materiales de inventario:**

| Nombre | Categoría | Unidad | Cantidad disponible | Cantidad reservada |
|---|---|---|---|---|
| Foco LED 12W | Eléctrico | pieza | 10 | 0 |
| Cable calibre 12 | Eléctrico | metro | 25 | 0 |
| Cinta aislante | Eléctrico | pieza | 3 | 0 |
| Llave mezcladora | Plomería | pieza | 1 | 0 |
| Detergente multiusos | Limpieza | litro | 5 | 0 |
| Guantes de látex | Consumibles | par | 20 | 0 |

**Órdenes de ejemplo:**

**Orden 1:**
- Ubicación: Área de acceso
- Tipo: Eléctrico
- Prioridad: Media
- Descripción: Cambio de luminarias dañadas
- Materiales requeridos:
  - Foco LED 12W: 12 piezas
  - Cinta aislante: 2 piezas

**Orden 2:**
- Ubicación: Sanitarios
- Tipo: Plomería
- Prioridad: Alta
- Descripción: Revisión de fuga en lavabo
- Materiales requeridos:
  - Llave mezcladora: 1 pieza
  - Guantes de látex: 2 pares

---

## 8. Alcance técnico del primer prototipo

El primer prototipo puede hacerse de forma local, sencilla y sin backend complejo.

**Opciones aceptables:**

- HTML, CSS y JavaScript puro
- Archivo JSON como base de datos simulada
- LocalStorage para guardar cambios temporalmente
- Múltiples páginas HTML con navegación explícita entre ellas
- Tablas editables simples

> ✏️ **Cambio:** Se reemplaza "Una sola página con secciones" por **"Múltiples páginas HTML con navegación explícita"**, en coherencia con la Sección 6.

**Evitar inicialmente:**

- Login avanzado
- Roles complejos
- Base de datos remota
- Integración con proveedores
- Carga de facturas
- Reportes PDF
- Estadísticas avanzadas
- Notificaciones
- Automatización de aprobaciones

---

## 9. Estructura sugerida de datos

```javascript
ordenes = [
  {
    id: "OS-001",
    fecha: "2026-05-20",
    solicitante: "Nombre del empleado",
    ubicacion: "Área de acceso",
    tipoServicio: "Eléctrico",
    descripcion: "Cambio de luminarias dañadas",
    prioridad: "Media",          // ← Campo agregado: "Alta" | "Media" | "Baja"
    estado: "Nueva",
    materiales: [
      {
        materialId: "MAT-001",
        nombre: "Foco LED 12W",
        cantidad: 12,
        unidad: "pieza"
      }
    ]
  }
]

inventario = [
  {
    id: "MAT-001",
    nombre: "Foco LED 12W",
    categoria: "Eléctrico",
    unidad: "pieza",
    cantidadDisponible: 10,
    cantidadReservada: 0,        // ← Campo agregado: unidades apartadas por órdenes en curso
    stockMinimo: 5,
    observaciones: ""
  }
]

solicitudesCompra = [
  {
    id: "SC-001",
    fecha: "2026-05-20",
    ordenId: "OS-001",
    // Campos heredados de la orden:
    solicitante: "Nombre del empleado",   // ← Heredado
    ubicacion: "Área de acceso",          // ← Heredado
    tipoServicio: "Eléctrico",            // ← Heredado
    estado: "Pendiente",
    materiales: [
      {
        materialId: "MAT-001",
        nombre: "Foco LED 12W",
        cantidadFaltante: 2,
        unidad: "pieza"
      }
    ]
  }
]
```

---

## 10. Criterio de éxito del prototipo

El prototipo se considera exitoso si permite hacer este flujo completo:

1. Crear una orden de servicio.
2. Registrar los materiales requeridos.
3. Consultar el inventario.
4. Comparar lo requerido contra lo disponible.
5. Detectar faltantes.
6. Generar una solicitud de compra.
7. Marcar materiales como recibidos.
8. Actualizar el inventario.
9. Cambiar el estado de la orden.

La base de datos todavía es simulada.  
No incluir usuarios o permisos avanzados para la demo.  
Lo importante es validar el flujo operativo.

---

## 11. Restricción principal

Cada vez que se proponga una mejora, evaluar si pertenece al primer prototipo o a una versión futura.

**Regla:**

> Si no ayuda directamente a crear órdenes, revisar inventario, contrastar materiales o generar solicitud de compra, dejarlo para después.

---

## 12. Resultado esperado

Genera un primer prototipo sencillo, funcional y entendible del sistema.

El sistema debe permitir demostrar la lógica de operación ante usuarios reales sin requerir infraestructura compleja.

**Prioriza:**

- Funcionalidad básica
- Claridad operativa
- Datos ordenados
- Flujo verificable
- Código fácil de modificar

**No priorices:**

- Estética avanzada
- Automatización excesiva
- Roles complejos
- Reportes sofisticados
- Integraciones externas
- Escalabilidad prematura

---

*Versión revisada — Mayo 2026*  
*Cambios marcados con ✏️ a lo largo del documento.*
