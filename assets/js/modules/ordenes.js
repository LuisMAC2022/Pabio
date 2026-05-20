import {readDB,writeDB} from '../storage.js';
import {generarFolio} from '../utils.js';
export function listarOrdenes(){return readDB().ordenes}
export function crearOrden(payload){const db=readDB();const orden={folio:generarFolio('ORD'),estado:'borrador',fecha:new Date().toISOString(),...payload};db.ordenes.push(orden);writeDB(db);return orden}
export function actualizarEstado(folio,estado){const db=readDB();const o=db.ordenes.find(x=>x.folio===folio);if(!o) return null;o.estado=estado;writeDB(db);return o}
