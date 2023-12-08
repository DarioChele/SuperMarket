const mysql = require('mysql2');
const Usuario = require('../Model/usuario.js');
const express = require('express');
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
class ControladorUsuario {
    login(username, password, callback) {
        connection.query('SELECT id, rol_id FROM usuarios WHERE nombre_usuario = ? and contrasena = ?', [username, password], function(err, results) {
            if (err) throw err;
            if (results.length > 0) {
                callback(results[0]);
            } else {
                console.log('Usuario no existe.');
                callback(null);
            }
        });
    }

    crearCliente(cliente, callback) {
        // Crear un nuevo cliente
        connection.query("INSERT INTO clientes (nombre, cedula, direccion, telefono, correo_electronico, estado) VALUES (?, ?, ?, ?, ?, 'A')", [cliente.nombre, cliente.cedula, cliente.direccion, cliente.telefono, cliente.correo_electronico], function(err, results) {
            if (err) throw err;
            callback(results);
        });
    }

    crearUsuario(usuario, callback) {
        // Crear un nuevo usuario        
        connection.query('INSERT INTO usuarios (nombre_usuario, contrasena, rol_id, cedula) VALUES (?, ?, 2, ?)', [usuario.nombre_usuario, usuario.contrasena, usuario.cedula], function(err, results) {
            if (err) throw err;
            callback(results);
            });
    }
    actualizaCliente(cliente, callback) {
        // Crear un nuevo cliente        
        connection.query("update clientes set nombre = ?, direccion = ?, telefono = ?, correo_electronico = ?, estado = 'A'  where  cedula = ?;", [cliente.nombre, cliente.direccion, cliente.telefono, cliente.correo_electronico, cliente.cedula], function(err, results) {
            if (err) throw err;
            callback(results);
        });
    }
    
    deleteCliente(cliente, callback) {
        // Crear un nuevo cliente        
        connection.query("UPDATE clientes SET estado = 'I' WHERE cedula = ?;", [cliente.cedula], function(err, results) {
            if (err) throw err;
            callback(results);
        });
    }

    listaClientes(callback) {
        connection.query('SELECT * FROM clientes ', function(err, results) {
            if (err) throw err;
            if (results.length > 0) {
                callback(results);
            } else {
                callback(null);
            }
        });
    }
    getUsuario(id, callback) {
        connection.query('SELECT * FROM usuarios WHERE id = ? and rol_id = 2', [id], function(err, results) {
            if (err) throw err;
            if (results.length > 0) {
                callback(results[0]);
            } else {
                callback(null);
            }
        });
    }    
}
module.exports = ControladorUsuario;