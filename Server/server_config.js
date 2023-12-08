const express = require('express');
var session = require('express-session');
const path = require('path');
const app = express();
const ControladorUsuario = require('../Controllers/controlador_usuario.js');
const ControladorArticulo = require('../Controllers/controlador_articulo.js');
const controladorUsuario = new ControladorUsuario();
const controladorArticulo = new ControladorArticulo();

// Sirve archivos estáticos desde la carpeta 'View'
app.use(express.static(path.join(__dirname, '../View')));
app.use('/assets', express.static(path.join(__dirname, '../assets')));
app.use(express.json());

app.use(session({
    secret: 'secreto_A9099',
    resave: false,
    saveUninitialized: true
  }));
  
 app.get('/logout', function(req, res){
    req.session.destroy();
    res.send("Sesión cerrada");
 });

app.post('/login', function(req, res) {
    const { username, password } = req.body;
    controladorUsuario.login(username, password, function(result) {
        if (result) {
            req.session.usuario = username;
            req.session.rol_id = result.rol_id;
            res.json({ success: true, data: result });
        } else {
            res.json({ success: false, message: 'Usuario no existe.' });
        }
    });
});
app.post('/listaArticulos', function(req, res) {
    controladorArticulo.listaArticulos(function(result) {
        if (result) {
            res.json({ success: true, data: result });
        } else {
            res.json({ success: false, message: 'Error al listar Articulos.' });
        }
    });
});

app.post('/crearArticulo', function(req, res) {
    if (req.session.rol_id != 1){
        res.json({ success: false, message: 'Usuario no autorizado.' });
    }
    const articulo  = req.body;
    controladorArticulo.crearArticulo(articulo, function(result) {
        if (result) {
            res.json({ success: true, data: result });
        } else {
            res.json({ success: false, message: 'Error al crear articulo.' });
        }
    });
});

app.post('/actualizaArticulo', function(req, res) {
    if (req.session.rol_id != 1){
        res.json({ success: false, message: 'Usuario no autorizado.' });
    }
    const articulo  = req.body;
    controladorArticulo.actualizaArticulo(articulo, function(result) {
        if (result) {
            res.json({ success: true, data: result });
        } else {
            res.json({ success: false, message: 'Error al actualizar articulo.' });
        }
    });
});

app.post('/deleteArticulo', function(req, res) {
    if (req.session.rol_id != 1){
        res.json({ success: false, message: 'Usuario no autorizado.' });
    }
    const articulo  = req.body;
    controladorArticulo.deleteArticulo(articulo, function(result) {
        if (result) {
            res.json({ success: true, data: result });
        } else {
            res.json({ success: false, message: 'Error al eliminar el articulo.' });
        }
    });
});


app.post('/crearURLS', function(req, res) {
    if (req.session.rol_id != 1){
        res.json({ success: false, message: 'Usuario no autorizado.' });
    }
    const articulo  = req.body;
    controladorArticulo.crearURLS(articulo, function(result) {
        if (result) {
            res.json({ success: true, data: result });
        } else {
            res.json({ success: false, message: 'Error al crear cliente.' });
        }
    });
});

app.post('/getUrlsArticulo', function(req, res) {
    if (req.session.rol_id != 1){
        res.json({ success: false, message: 'Usuario no autorizado.' });
    }
    const articulo  = req.body;
    controladorArticulo.getUrlsArticulo(articulo, function(result) {
        if (result) {
            res.json({ success: true, data: result });
        } else {
            res.json({ success: false, message: 'Error al crear cliente.' });
        }
    });
});


app.post('/crearCliente', function(req, res) {
    if (req.session.rol_id != 1){
        res.json({ success: false, message: 'Usuario no autorizado.' });
    }
    const cliente  = req.body;
    controladorUsuario.crearCliente(cliente, function(result) {
        if (result) {
            res.json({ success: true, data: result });
        } else {
            res.json({ success: false, message: 'Error al crear cliente.' });
        }
    });
});

app.post('/deleteCliente', function(req, res) {
    if (req.session.rol_id != 1){
        res.json({ success: false, message: 'Usuario no autorizado.' });
    }
    const cliente  = req.body;
    controladorUsuario.deleteCliente(cliente, function(result) {
        if (result) {
            res.json({ success: true, data: result });
        } else {
            res.json({ success: false, message: 'Error al crear cliente.' });
        }
    });
});

app.post('/actualizaCliente', function(req, res) {
    if (req.session.rol_id != 1){
        res.json({ success: false, message: 'Usuario no autorizado.' });
    }
    const cliente  = req.body;
    controladorUsuario.actualizaCliente(cliente, function(result) {
        if (result) {
            res.json({ success: true, data: result });
        } else {
            res.json({ success: false, message: 'Error al actualizar cliente.' });
        }
    });
});
app.post('/listaClientes', function(req, res) {
    if (req.session.rol_id != 1){
        res.json({ success: false, message: 'Usuario no autorizado.' });
    }
    controladorUsuario.listaClientes(function(result) {
        if (result) {
            res.json({ success: true, data: result });
        } else {
            res.json({ success: false, message: 'Error al listar Clientes.' });
        }
    });
});

app.post('/crearUsuario', function(req, res) {
    if (req.session.rol_id != 1){
        res.json({ success: false, message: 'Usuario no autorizado.' });
    }
    const usuario  = req.body;
    controladorUsuario.crearUsuario(usuario, function(result) {
        if (result) {
            res.json({ success: true, data: result });
        } else {
            res.json({ success: false, message: 'Error al crear usuario.' });
        }
    });
});


app.listen(3000, function() {
    console.log('Servidor escuchando en el puerto 3000!');
});

module.exports = app;
