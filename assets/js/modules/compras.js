import {readDB,writeDB} from '../storage.js';
import {generarFolio} from '../utils.js';
export function listarSolicitudes(){return readDB().solicitudes}
export function generarSolicitud(items){const db=readDB();const solicitud={folio:generarFolio('SOL'),fecha:new Date().toISOString(),estado:'pendiente',items};db.solicitudes.push(solicitud);writeDB(db);return solicitud}
