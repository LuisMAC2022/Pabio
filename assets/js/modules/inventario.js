import {readDB,writeDB} from '../storage.js';
export function listarInventario(){return readDB().inventario}
export function agregarMaterial(material){const db=readDB();db.inventario.push({...material,cantidadReservada:material.cantidadReservada||0});writeDB(db)}
