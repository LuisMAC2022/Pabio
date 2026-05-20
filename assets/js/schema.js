export const estadosOrden=['borrador','aprobada','en-proceso','completada','cancelada'];
export function validarOrden(orden){return Boolean(orden?.folio&&orden?.materiales?.length)}
