export function generarFolio(prefijo='PB'){return `${prefijo}-${Date.now().toString(36).toUpperCase()}`}
export function hoyISO(){return new Date().toISOString().slice(0,10)}
export function normalizarTexto(v=''){return v.trim().toLowerCase()}
