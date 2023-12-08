document.getElementById('clienteForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var rol_id = sessionStorage.getItem('rol_id');    
    var usuario = sessionStorage.getItem('username');

    var nombre = document.getElementById('nombre').value;
    var cedula = document.getElementById('cedula').value;
    var direccion = document.getElementById('direccion').value;
    var telefono = document.getElementById('telefono').value;
    var correo_electronico = document.getElementById('correo_electronico').value;

    var cliente = {
        nombre: nombre,
        cedula: cedula,
        direccion: direccion,
        telefono: telefono,
        correo_electronico: correo_electronico,
        estado: 'A'
    };

    var btnText = document.getElementById('guardarBtn').textContent;
    if  (btnText == 'Guardar'){
        // Crear nuevo cliente
        fetch('/crearCliente', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cliente)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Creación exitosa, recargar la lista de clientes
                Cancelar();
                limpiaFilas();
                cargarClientes();
                // Crear nuevo usuario
                var nomnomb= (nombre).substring(0, 3);
                var usuario = {                    
                    nombre_usuario: nomnomb + cedula,
                    contrasena: cedula,                    
                    rol_id: 2, //el rol_id para un cliente es 2
                    cedula: cedula
                };
                fetch('/crearUsuario', { 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(usuario)
                })
                .then(response => response.json())
                .then(data => {
                    if (!data.success) {
                        // Creación fallida, mostrar un mensaje de error
                        alert('Error al crear el usuario: ' + data.message);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            } else {

                // Creación fallida, mostrar un mensaje de error
                alert('Error al crear el cliente: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }else{
        fetch('/actualizaCliente', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cliente)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Creación exitosa, recargar la lista de clientes
                Cancelar();
                limpiaFilas();
                cargarClientes();
            } else {
                // Creación fallida, mostrar un mensaje de error
                alert('Error al crear el cliente: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
});

document.getElementById('cancelarBtn').addEventListener('click', function() {
    // Cuando se haga clic en "Cancelar", limpia las cajas de texto
    Cancelar();
});

function Cancelar(){
    document.getElementById('nombre').value = '';
    document.getElementById('cedula').value = '';
    document.getElementById('cedula').readOnly = false;
    document.getElementById('direccion').value = '';
    document.getElementById('telefono').value = '';
    document.getElementById('correo_electronico').value = '';

    // Cambia el texto del botón de "submit" a "Guardar"
    document.getElementById('guardarBtn').textContent = 'Guardar';
}

function limpiaFilas(){
    // Limpia solo el cuerpo de la tabla antes de agregar las nuevas filas
    //var tbody = tabla.getElementsByTagName('tbody');
    //tbody.innerHTML = '';
    var tabla = document.getElementById('clientesTable');
    tabla.innerHTML='';
    // Agrega los títulos de las columnas
    var filaTitulos = document.createElement('tr');
    var titulos = ['Nombre', 'Cédula', 'Dirección', 'Teléfono', 'Correo Electrónico', 'Estado', 'Acciones'];
    titulos.forEach(titulo => {
        var celdaTitulo = document.createElement('th');
        celdaTitulo.textContent = titulo;
        filaTitulos.appendChild(celdaTitulo);
    });
    tabla.appendChild(filaTitulos);
}

function cargarClientes() {
    // Cargar la lista de clientes desde el servidor
    fetch('/listaClientes', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            var clientes = data.data;
            var tabla = document.getElementById('clientesTable');
            clientes.forEach(cliente => {
                var fila = document.createElement('tr');

                // Agrego un evento de clic a la fila
                fila.addEventListener('click', function() {
                    // Cuando se haga clic en la fila, llena las cajas de texto con los datos del cliente
                    document.getElementById('nombre').value = cliente.nombre;
                    document.getElementById('cedula').value = cliente.cedula;
                    document.getElementById('cedula').readOnly = true;
                    
                    document.getElementById('direccion').value = cliente.direccion;
                    document.getElementById('telefono').value = cliente.telefono;
                    document.getElementById('correo_electronico').value = cliente.correo_electronico;                    
                    document.getElementById('guardarBtn').textContent = 'Modificar';
                });
                
                var celdaNombre = document.createElement('td');
                celdaNombre.textContent = cliente.nombre;
                fila.appendChild(celdaNombre);

                var celdaCedula = document.createElement('td');
                celdaCedula.textContent = cliente.cedula;
                fila.appendChild(celdaCedula);

                var celdaDireccion = document.createElement('td');
                celdaDireccion.textContent = cliente.direccion;
                fila.appendChild(celdaDireccion);

                var celdaTelefono = document.createElement('td');
                celdaTelefono.textContent = cliente.telefono;
                fila.appendChild(celdaTelefono);

                var celdaCorreo = document.createElement('td');
                celdaCorreo.textContent = cliente.correo_electronico;
                fila.appendChild(celdaCorreo);

                var celdaEstado = document.createElement('td');
                celdaEstado.textContent = cliente.estado;
                fila.appendChild(celdaEstado);

                var celdaAccion = document.createElement('td');
                celdaAccion.style.textAlign = 'center'
                var iconoEliminar = document.createElement('img');
                iconoEliminar.src = '/assets/img/del.ico';
                iconoEliminar.style.width = '20px'; 
                iconoEliminar.style.height = '20px';                 
                iconoEliminar.addEventListener('click', function(event) {
                    event.stopPropagation(); // Esto evita que el evento de clic se propague a la fila
                    var confirmacion = confirm('¿Estás seguro de eliminar el registro ' + cliente.cedula + ' - ' + cliente.nombre + '?');
                    if (confirmacion) {                        
                        eliminarCliente(cliente.cedula);
                        Cancelar();
                        limpiaFilas();
                        cargarClientes();
                    }
                });
                
                celdaAccion.appendChild(iconoEliminar);
                fila.appendChild(celdaAccion);
                
                tabla.appendChild(fila);
            });
        } else {
            // Si hubo un error, puedes mostrar el mensaje de error
            alert('Error al cargar los clientes: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function eliminarCliente(cedula) {
    // Eliminar el cliente del servidor y recargar la lista de clientes
    var cliente = {
        cedula: cedula
    };
    fetch('/deleteCliente', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cliente)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Eliminacion exitosa, recargar la lista de clientes
        } else {
            // Eliminación fallida, mostrar un mensaje de error
            alert('Error al eliminar el cliente: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    if(sessionStorage.getItem('rol_id') != 1){
        window.location.href = '/';
    }
    Cancelar();
    limpiaFilas();
    cargarClientes();
});
