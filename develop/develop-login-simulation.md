Estas son las instrucciones para desarrollar una pantalla de identificacion la cual en la demo la cual simulara el login en la aplicacion real.

1. Guardar el contenido actual de `index.html` en un nuevo archivo de destino (`pages/index.html`). refactorizar las direcciones en dicho archivo para no perder la UI/flujo existente.

2. En ese archivo (`pages/index`)agregar una zona superior derecha semántica para el saludo:

* En el `header` sustituir el texto del elemento <h1> por el contenido dinámico: `Bienvenido {nombre}`. Donde {nombre} corresponde al campo nombre de ´data/directorio.json´ correspondiente al ID ingresado en la pagina index del directorio raiz.
* Asegurar contraste y legibilidad.
* Evitar depender de posición absoluta compleja; preferir layout simple (flex).
pyt
3. Leer `nombre` al cargar:

* Si falta `nombre`, redirigir al ´index.html´ localizado en la raiz.

4. Sanitizar/escapar inserción del nombre:

* Insertar como `textContent` (no `innerHTML`) para evitar XSS.

5. Verificar consistencia de navegación:

* Acceso directo a página destino sin validación debe manejarse ( retorno a raíz).

6. Crear una nueva versión de `index.html` (raíz) que contenga únicamente:

* Un `main` con un `h1`  ("Simulacion de validacion de ID"”).
* Un `form` con:

  * `label` asociado a un `input` (id del campo).
  * `input` tipo `text` con `inputmode="numeric"` y `autocomplete="off"`.
  * `button` de envío.
* Un contenedor de error accesible (`role="alert"` o `aria-live="polite"`) para informar “ID no encontrado” u otros errores.

2. Implementar lógica JS mínima en la misma página para:

* Leer el valor ingresado.
* Normalizar el ID eliminando ceros a la izquierda:

  * Regla recomendada: `normalized = raw.replace(/^0+/, '') || '0'`.
  * Esto valida que `"00001"`, `"01"` y `"1"` resulten en `"1"`.
* Validar formato numérico antes de consultar (`/^\d+$/`).

3. Cargar `data/directorio.json` con `fetch` al enviar el formulario.

* Buscar coincidencia del ID normalizado contra el campo "id_fuente" en el JSON 
4. Si existe el ID:

* Construir redirección al “index actual” (previo al cambio).
* Pasar contexto mínimo del usuario para saludo:

  * Opción recomendada: query params (`?id=...&nombre=...`) codificando con `encodeURIComponent`.
  * Alternativa más limpia: `sessionStorage` con `{id, nombre}` y redirigir sin exponer nombre en URL.

5. Si no existe:

* Mostrar mensaje accesible de error en la misma página sin recargar.
* Mover foco al mensaje o al campo con ayuda contextual para teclado/lector de pantalla.

6. Mantener performance:

* Sin librerías externas.
* JS pequeño y diferido/al final del `body`.
* DOM simple (sin wrappers innecesarios).