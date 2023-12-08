class Articulo {
    constructor(codigo, nombre, fecha_empaque, fecha_vencimiento, lote_produccion, ingredientes, precio, stock, estado, fecha_baja, usuario_baja, razon_baja, url_imagen1, url_imagen2, url_imagen3) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.fecha_empaque = fecha_empaque;
        this.fecha_vencimiento = fecha_vencimiento;
        this.lote_produccion = lote_produccion;
        this.ingredientes = ingredientes;
        this.precio = precio;
        this.stock = stock;
        this.estado = estado;
        this.fecha_baja = fecha_baja;
        this.usuario_baja_baja = usuario_baja;
        this.razon_baja = razon_baja;
        this.url_imagen1 = url_imagen1;
        this.url_imagen2 = url_imagen2;
        this.url_imagen3 = url_imagen3;
    }
}

module.exports = Articulo;
