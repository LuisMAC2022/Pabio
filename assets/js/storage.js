const VERSION='1.0.0';
const KEY='pabio.db';
export function readDB(){const raw=localStorage.getItem(KEY);if(!raw)return {version:VERSION,ordenes:[],inventario:[],solicitudes:[]};return JSON.parse(raw)}
export function writeDB(db){localStorage.setItem(KEY,JSON.stringify({...db,version:VERSION}))}
