const mysql = require('mysql2');
const Articulo = require('../Model/articulo.js');
const express  = require('express');
var connection = mysql.createConnection({
    host: 'localhost',
    port: '3333',//Puerto de docker
    user: 'root',
    password: 'root',
    database: 'superMarket'
});

connection.connect(function(err) {
    if (err) throw err;
    console.log('Conectado a la base de datos MySQL!');
});
class ControladorArticulo {
    crearArticulo(articulo, callback) {
        // Crear un nuevo cliente
        connection.query("INSERT INTO articulos ( codigo, nombre, fecha_empaque, fecha_vencimiento, lote_produccion, ingredientes, precio, stock, estado, fecha_baja,  articulo_baja, razon_baja) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [articulo.codigo, articulo.nombre, articulo.fecha_empaque, articulo.fecha_vencimiento, articulo.lote_produccion, articulo.ingredientes, articulo.precio, articulo.stock, articulo.estado, articulo.fecha_baja, articulo.articulo_baja, articulo.razon_baja], 
            function(err, results) {
            if (err) throw err;
            callback(results);
        });
    }

    crearURLS(articulo, callback) {
        //Eliminar las urls anteriores
        this.getArticulo(articulo, function(articuloNew) {
            connection.beginTransaction(function(err) {
                if (err) throw err;
                connection.query('delete from imagenes_articulo where articulo_codigo = ? ', [articuloNew.codigo], function(err, results) {
                    if (err) {
                        return connection.rollback(function() {
                            throw err;
                        });
                    }
                    //Guardar las nuevas urls
                    connection.query('INSERT INTO imagenes_articulo (articulo_id, ruta, articulo_codigo) VALUES (?, ?, ?)', [articuloNew.id, articulo.url_imagen1, articulo.codigo], function(err, results) {
                        if (err) {
                            return connection.rollback(function() {
                                throw err;
                            });
                        }
                        connection.query('INSERT INTO imagenes_articulo (articulo_id, ruta, articulo_codigo) VALUES (?, ?, ?)', [articuloNew.id, articulo.url_imagen2, articulo.codigo], function(err, results) {
                            if (err) {
                                return connection.rollback(function() {
                                    throw err;
                                });
                            }
                            connection.query('INSERT INTO imagenes_articulo (articulo_id, ruta, articulo_codigo) VALUES (?, ?, ?)', [articuloNew.id, articulo.url_imagen3, articulo.codigo], function(err, results) {
                                if (err) {
                                    return connection.rollback(function() {
                                        throw err;
                                    });
                                }
                                connection.commit(function(err) {
                                    if (err) {
                                        return connection.rollback(function() {
                                            throw err;
                                        });
                                    }
                                    callback(results);
                                });
                            });
                        });
                    });
                });
            });
        });
    }   
    
    actualizaArticulo(articulo, callback) {
        connection.query("update articulos SET nombre = ?, fecha_empaque = ?, fecha_vencimiento = ?, lote_produccion = ?, ingredientes = ?, precio = ?, stock = ?, estado = ?, fecha_baja = ?, usuario_baja = ?, razon_baja = ? where  codigo = ?;", 
        [articulo.nombre, articulo.fecha_empaque, articulo.fecha_vencimiento, articulo.lote_produccion, articulo.ingredientes, articulo.precio, articulo.stock, articulo.estado, articulo.fecha_baja,
            articulo.usuario_baja, articulo.razon_baja, articulo.codigo], function(err, results) 
            {if (err) throw err;
            callback(results);
        });
    }
    
    deleteArticulo(articulo, callback) {
        // Crear un nuevo cliente        
        connection.query("UPDATE articulos SET estado = 'E' WHERE codigo = ?;", [articulo.codigo], function(err, results) {
            if (err) throw err;
            callback(results);
        });
    }
    getUrlsArticulo(articulo, callback){
        connection.query('SELECT * FROM imagenes_articulo where articulo_codigo = ? ', [articulo.codigo], function(err, results) {
            if (err) throw err;
            if (results.length > 0) {
                callback(results);
            } else {
                callback(null);
            }
        });
    }
    listaArticulosCoincide(articulo, callback) {
        connection.query(`SELECT a.id,a.codigo,a.nombre,a.fecha_empaque,a.fecha_vencimiento,a.lote_produccion, 
                            a.ingredientes,a.precio,a.stock,a.estado,a.fecha_baja,a.usuario_baja,a.razon_baja, 
                            COALESCE(MAX(CASE WHEN i.rn = 1 THEN i.ruta END), 'No image') as url_imagen1,
                            COALESCE(MAX(CASE WHEN i.rn = 2 THEN i.ruta END), 'No image') as url_imagen2,
                            COALESCE(MAX(CASE WHEN i.rn = 3 THEN i.ruta END), 'No image') as url_imagen3
                        FROM articulos a
                        LEFT JOIN 
                            (SELECT articulo_codigo, ruta, rn 
                            FROM (SELECT articulo_codigo, ruta, ROW_NUMBER() OVER(PARTITION BY articulo_codigo ORDER BY ruta ASC) as rn 
                                    FROM  imagenes_articulo) tmp
                            WHERE rn <= 3) i ON a.codigo = i.articulo_codigo
                        Where a.nombre like('%?%')
                        GROUP BY 
                            a.id, a.codigo, a.nombre, a.lote_produccion, a.ingredientes,
                            a.precio, a.stock, a.estado, a.fecha_baja,a.usuario_baja,a.razon_baja;`,
                            [articulo.nombre],
                        function(err, results) {
            if (err) throw err;
            if (results.length > 0) {
                callback(results);
            } else {
                callback(null);
            }
        });
    }

    listaArticulos(callback) {
        connection.query(`SELECT a.id,a.codigo,a.nombre,a.fecha_empaque,a.fecha_vencimiento,a.lote_produccion, 
                            a.ingredientes,a.precio,a.stock,a.estado,a.fecha_baja,a.usuario_baja,a.razon_baja, 
                            COALESCE(MAX(CASE WHEN i.rn = 1 THEN i.ruta END), 'No image') as url_imagen1,
                            COALESCE(MAX(CASE WHEN i.rn = 2 THEN i.ruta END), 'No image') as url_imagen2,
                            COALESCE(MAX(CASE WHEN i.rn = 3 THEN i.ruta END), 'No image') as url_imagen3
                        FROM 
                            articulos a
                        LEFT JOIN 
                            (SELECT articulo_codigo, ruta, rn 
                            FROM 
                                (SELECT articulo_codigo, ruta, ROW_NUMBER() OVER(PARTITION BY articulo_codigo ORDER BY ruta ASC) as rn 
                                FROM 
                                    imagenes_articulo) tmp
                            WHERE 
                                rn <= 3) i ON a.codigo = i.articulo_codigo
                        GROUP BY 
                            a.id, a.codigo, a.nombre, a.lote_produccion, a.ingredientes,
                            a.precio, a.stock, a.estado, a.fecha_baja,a.usuario_baja,a.razon_baja;`,
                        function(err, results) {
            if (err) throw err;
            if (results.length > 0) {
                callback(results);
            } else {
                callback(null);
            }
        });
    }
    getArticulo(articulo, callback) {
        connection.query('SELECT * FROM articulos WHERE codigo = ? ', [articulo.codigo], function(err, results) {
            if (err) throw err;
            if (results.length > 0) {
                console.log(results);
                callback(results[0]);
            } else {
                callback(null);
            }
        });
    }
}
module.exports = ControladorArticulo;