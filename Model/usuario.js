class Usuario {
    constructor(id, nombre_usuario, contrasena, rol_id) {
        this.id = id;
        this.nombre_usuario = nombre_usuario;
        this.contrasena = contrasena;
        this.rol_id = rol_id;        
    }
}

module.exports = Usuario;
