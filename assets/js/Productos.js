// Productos.js



function GetProductosBD() {
    const productContainer = document.getElementById("product-list");

    // Realizar una solicitud GET a la API
    fetch('https://localhost:7253/ListarProdutos')
    .then(response => response.json())
    .then(data => {
        // Iterar sobre los productos y crear tarjetas para cada uno
        data.forEach(producto => {
            const tarjeta = document.createElement('div');
            tarjeta.classList.add('tarjeta'); // Agrega una clase CSS para dar estilo a la tarjeta

            tarjeta.innerHTML = `
        <div class="card h-100">
            <a href="shop-single.html">
            <img src="${producto.imagen}" alt="Imagen del producto">
            </a>
            <div class="card-body">
                <ul class="list-unstyled d-flex justify-content-between">
                    <li>
                        <i class="text-warning fa fa-star"></i>
                        <i class="text-warning fa fa-star"></i>
                        <i class="text-warning fa fa-star"></i>
                        <i class="text-muted fa fa-star"></i>
                        <i class="text-muted fa fa-star"></i>
                    </li>
                    <li class="text-muted text-right">$${producto.precio}</li>
                </ul>
                <a href="shop-single.html" class="h2 text-decoration-none text-dark">${producto.nombreProducto}</a>
                <p class="card-text">${producto.descripcion}</p>
                <p class="text-muted">Reviews (24)</p>
            </div>
        </div>
    `;

            tarjetasProductos.appendChild(tarjeta);
        });
    })
    .catch(error => {
        console.error('Error al obtener los productos:', error);
    });
}

// Llama a la función cargarProductos() cuando la página se cargue
window.addEventListener("DOMContentLoaded", GetProductosBD);

// Función para cargar las tarjetas de productos en el carrusel
function cargarProductos() {

    fetch('https://localhost:7253/ListarProdutos')
    .then(response => response.json())
    const productRow = document.getElementById("productRow");

    // Dividir los productos en grupos de 4
    for (let i = 0; i < productos.length; i += 4) {
        const productGroup = productos.slice(i, i + 4);

        // Crear una fila para cada grupo de productos
        const row = document.createElement("div");
        row.className = "row";

        // Generar tarjetas de producto para cada producto en el grupo
        productGroup.forEach((producto) => {
            const card = document.createElement("div");
            card.className = "col-12 col-md-3 mb-4";
            card.innerHTML = `
                        <div class="card h-100">
                            <a href="shop-single.html">
                            <img src="${producto.imagen}" alt="Imagen del producto">
                            </a>
                            <div class="card-body">
                                <ul class="list-unstyled d-flex justify-content-between">
                                    <li>
                                        <i class="text-warning fa fa-star"></i>
                                        <i class="text-warning fa fa-star"></i>
                                        <i class="text-warning fa fa-star"></i>
                                        <i class="text-muted fa fa-star"></i>
                                        <i class="text-muted fa fa-star"></i>
                                    </li>
                                    <li class="text-muted text-right">$${producto.Precio}</li>
                                </ul>
                                <a href="shop-single.html" class="h2 text-decoration-none text-dark">${producto.nombreProducto}</a>
                                <p class="card-text">${producto.Descripcion}</p>
                                <p class="text-muted">Reviews (24)</p>
                            </div>
                        </div>
                    `;
            row.appendChild(card);
        });

        // Agregar la fila al contenedor principal
        productRow.appendChild(row);
    }
}

// Llama a la funci�n cuando la p�gina se cargue
window.addEventListener("DOMContentLoaded", GetProductosBD);

