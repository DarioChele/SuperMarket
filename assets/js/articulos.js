document.getElementById('div_razon_baja').style.display = 'none';

function manejarCambioEstado() {
    // Si se selecciona 'De baja', se muestra el div, de lo contrario, se oculta
    if (this.value === 'De baja') {
        document.getElementById('div_razon_baja').style.display = 'block';
        document.getElementById('razon_baja').required = true;
    } else {
        document.getElementById('div_razon_baja').style.display = 'none';
        document.getElementById('razon_baja').required = false;
    }
}

document.getElementById('estado').addEventListener('change', manejarCambioEstado);


document.getElementById('articuloForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var rol_id = sessionStorage.getItem('rol_id');    
    var usuario_baja = sessionStorage.getItem('user_id');
    
    var codigo= document.getElementById('codigo').value;
    var nombre= document.getElementById('nombre').value;
    var fecha_empaque= document.getElementById('fecha_empaque').value;
    var fecha_vencimiento= document.getElementById('fecha_vencimiento').value; 
    var lote_produccion= document.getElementById('lote_produccion').value; 
    var ingredientes= document.getElementById('ingredientes').value; 
    var precio= document.getElementById('precio').value; 
    var stock = document.getElementById('stock').value;

    var razon_baja = document.getElementById('razon_baja').value;

    var mapeoEstado = {
        'Activo': 'A',
        'De baja': 'D',
        'Eliminado': 'E'
      };
      
    // Obtén el elemento select
    var selectEstado = document.getElementById('estado').value;
    var estado = mapeoEstado[selectEstado];
    var url_imagen1= document.getElementById('url1').value;
    var url_imagen2= document.getElementById('url2').value;
    var url_imagen3= document.getElementById('url3').value;

    var articulo = {
        codigo :codigo,
        nombre : nombre,
        fecha_empaque : fecha_empaque,
        fecha_vencimiento:fecha_vencimiento, 
        lote_produccion:lote_produccion, 
        ingredientes:ingredientes, 
        precio:precio, 
        stock:stock, 
        estado: estado,
        fecha_baja:'1900-01-01', 
        usuario_baja:usuario_baja,
        razon_baja:razon_baja,
        url_imagen1:url_imagen1,
        url_imagen2:url_imagen2,
        url_imagen3:url_imagen3
        
    };

    var btnText = document.getElementById('guardarBtn').textContent;
    if  (btnText == 'Guardar'){
        // Crear nuevo Articulo
        fetch('/crearArticulo', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(articulo)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Creación exitosa, recargar la lista de Articulos
                Cancelar();
                limpiaFilas();
                cargarArticulos();
                // Cargar imagenes de artículo.                
                fetch('/crearURLS', { 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(articulo)
                })
                .then(response => response.json())
                .then(data => {
                    if (!data.success) {
                        alert('Error al crear Urls de articulo: ' + data.message);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            } else {

                // Creación fallida, mostrar un mensaje de error
                alert('Error al crear el Articulo: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }else{
        
        fetch('/actualizaArticulo', {             
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(articulo)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Creación exitosa, recargar la lista de Articulos
                Cancelar();
                limpiaFilas();
                cargarArticulos();
                // Cargar imagenes de artículo.                
                fetch('/crearURLS', { 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(articulo)
                })
                .then(response => response.json())
                .then(data => {
                    if (!data.success) {
                        alert('Error al crear Urls de articulo: ' + data.message);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            } else {
                // Creación fallida, mostrar un mensaje de error
                alert('Error al crear el Articulo: ' + data.message);
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
    document.getElementById('codigo').value = "";
    document.getElementById('codigo').readOnly = false;                    
    document.getElementById('nombre').value = "";
    
    var fechaHoy = new Date();
    var dia = String(fechaHoy.getDate()).padStart(2, '0');
    var mes = String(fechaHoy.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript comienzan desde 0
    var ano = fechaHoy.getFullYear();
    fechaHoy = ano + '-' + mes + '-' + dia;
    document.getElementById('fecha_empaque').value = fechaHoy;                    
    document.getElementById('fecha_vencimiento').value = fechaHoy;
    document.getElementById('lote_produccion').value = "";
    document.getElementById('estado').selectedIndex = 0;
    document.getElementById('ingredientes').value = "";
    document.getElementById('precio').value = "";
    document.getElementById('stock').value = "";
    document.getElementById('razon_baja').value = "";
    document.getElementById('url1').value = "";
    document.getElementById('url2').value = "";
    document.getElementById('url3').value = "";
    document.getElementById('imagen1').src = "";
    document.getElementById('imagen2').src = "";
    document.getElementById('imagen3').src = "";
                    

    // Cambia el texto del botón de "submit" a "Guardar"
    document.getElementById('guardarBtn').textContent = 'Guardar';


}

function limpiaFilas(){
    // Limpia solo el cuerpo de la tabla antes de agregar las nuevas filas
    //var tbody = tabla.getElementsByTagName('tbody');
    //tbody.innerHTML = '';
    var tabla = document.getElementById('articulosTable');
    tabla.innerHTML='';
    // Agrega los títulos de las columnas
    var filaTitulos = document.createElement('tr');
    var titulos = ['Codigo', 'Nombre', 'Fecha de Empaque', 'Fecha de Vencimiento','Lote', 'Estado','Ingredientes', 'Precio', 'Stock', 'Acciones'];
    titulos.forEach(titulo => {
        var celdaTitulo = document.createElement('th');
        celdaTitulo.textContent = titulo;
        filaTitulos.appendChild(celdaTitulo);
    });
    tabla.appendChild(filaTitulos);
}

function cargarArticulos() {
    // Cargar la lista de Articulos desde el servidor
    fetch('/listaArticulos', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            var articulos = data.data;
            var tabla = document.getElementById('articulosTable');
            articulos.forEach(articulo => {
                var fila = document.createElement('tr');
                // Agrego un evento de clic a la fila
                fila.addEventListener('click', function() {
                    // Cuando se haga clic en la fila, llena las cajas de texto con los datos del Articulo
                    document.getElementById('codigo').value = articulo.codigo;
                    document.getElementById('codigo').readOnly = true;
                    document.getElementById('nombre').value = articulo.nombre;

                    var fech_empa = new Date(articulo.fecha_empaque);
                    var fech_empaFormateada = fech_empa.toISOString().split('T')[0];
                    document.getElementById('fecha_empaque').value = fech_empaFormateada;
                    var fech_venci = new Date(articulo.fecha_vencimiento);
                    var fech_venciFormateada = fech_venci.toISOString().split('T')[0];
                    document.getElementById('fecha_vencimiento').value = fech_venciFormateada;                    
                    document.getElementById('lote_produccion').value = articulo.lote_produccion;
                    
                    var mapeoEstado = {
                    'A': 'Activo',
                    'D': 'De baja',
                    'E': 'Eliminado'
                    };
                    // Obtén el elemento select
                    var selectEstado = document.getElementById('estado');
                    selectEstado.value = mapeoEstado[articulo.estado];
                    manejarCambioEstado.call(selectEstado);

                    document.getElementById('razon_baja').value = articulo.razon_baja;

                    document.getElementById('ingredientes').value = articulo.ingredientes;
                    document.getElementById('precio').value = articulo.precio;
                    document.getElementById('stock').value = articulo.stock;
                    document.getElementById('url1').value = articulo.url_imagen1;
                    document.getElementById('url2').value = articulo.url_imagen2;
                    document.getElementById('url3').value = articulo.url_imagen3;
                    document.getElementById('imagen1').src = articulo.url_imagen1;
                    document.getElementById('imagen2').src = articulo.url_imagen2;
                    document.getElementById('imagen3').src = articulo.url_imagen3;

                    document.getElementById('guardarBtn').textContent = 'Modificar';
                });
                
                

                var celdaCodigo = document.createElement('td');
                celdaCodigo.textContent = articulo.codigo;
                fila.appendChild(celdaCodigo);

                var celdaNombre = document.createElement('td');
                celdaNombre.textContent = articulo.nombre;
                fila.appendChild(celdaNombre);                
                
                var fecha_empaq = new Date(articulo.fecha_empaque);
                var fec_empaque = fecha_empaq.toISOString().split('T')[0];
                var celdaFecha_empaque = document.createElement('td');
                celdaFecha_empaque.textContent = fec_empaque
                fila.appendChild(celdaFecha_empaque);

                var fecha_venci = new Date(articulo.fecha_vencimiento);
                var fec_venci = fecha_venci.toISOString().split('T')[0];
                var celdaFecha_vencimiento = document.createElement('td');
                celdaFecha_vencimiento.textContent = fec_venci;
                fila.appendChild(celdaFecha_vencimiento);

                var celdaLote_produccion= document.createElement('td');
                celdaLote_produccion.textContent = articulo.lote_produccion;
                fila.appendChild(celdaLote_produccion);

                var celdaEstado= document.createElement('td');
                celdaEstado.textContent = articulo.estado.charAt(0).toUpperCase() +  articulo.estado.slice(1);;                
                fila.appendChild(celdaEstado);

                var celdaIngredientes= document.createElement('td');
                celdaIngredientes.textContent = articulo.ingredientes;
                fila.appendChild(celdaIngredientes);

                var celdaPrecio= document.createElement('td');
                celdaPrecio.textContent = articulo.precio;
                fila.appendChild(celdaPrecio);

                var celdaStock= document.createElement('td');
                celdaStock.textContent = articulo.stock;
                fila.appendChild(celdaStock);

                var celdaAccion = document.createElement('td');
                celdaAccion.style.textAlign = 'center'
                var iconoEliminar = document.createElement('img');
                iconoEliminar.src = '/assets/img/del.ico';
                iconoEliminar.style.width = '20px'; 
                iconoEliminar.style.height = '20px';                 
                iconoEliminar.addEventListener('click', function(event) {
                    event.stopPropagation(); // Esto evita que el evento de clic se propague a la fila
                    if(articulo.stock > 0){
                        alert('No se puede eliminar un articulo con stock existente..!');
                    }else{
                        var confirmacion = confirm('¿Estás seguro de eliminar el registro ' + articulo.codigo + ' - ' + articulo.nombre + '?');
                        if (confirmacion) {                        
                            eliminarArticulo(articulo.codigo);
                            Cancelar();
                            limpiaFilas();
                            cargarArticulos();
                        }
                    }
                });
                
                celdaAccion.appendChild(iconoEliminar);
                fila.appendChild(celdaAccion);
                
                tabla.appendChild(fila);
            });
        } else {
            // Si hubo un error, puedes mostrar el mensaje de error
            alert('Error al cargar los Articulos: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function eliminarArticulo(codigo) {
    // Eliminar el Articulo del servidor y recargar la lista de Articulos
    var Articulo = {
        codigo: codigo
    };
    fetch('/deleteArticulo', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(Articulo)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Eliminacion exitosa, recargar la lista de Articulos
        } else {
            // Eliminación fallida, mostrar un mensaje de error
            alert('Error al eliminar el Articulo: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

document.getElementById('mostrarBtn1').addEventListener('click', function() {
    var url = document.getElementById('url1').value;
    document.getElementById('imagen1').src = url;
});
document.getElementById('mostrarBtn2').addEventListener('click', function() {
    var url = document.getElementById('url2').value;
    document.getElementById('imagen2').src = url;
});
document.getElementById('mostrarBtn3').addEventListener('click', function() {
    var url = document.getElementById('url3').value;
    document.getElementById('imagen3').src = url;
});


document.addEventListener('DOMContentLoaded', function() {
    if(sessionStorage.getItem('rol_id') != 1){
        window.location.href = '/';
    }    
    Cancelar();
    limpiaFilas();    
    cargarArticulos();
});
