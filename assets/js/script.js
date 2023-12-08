document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    fetch('/login', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Inicio de sesión exitoso, redirigir al usuario a la página principal            
            let rol_id = data.data.rol_id;
            sessionStorage.setItem('user_id', data.data.id);
            sessionStorage.setItem('rol_id', rol_id);
            sessionStorage.setItem('username', username);
            if (rol_id == 1) {
                window.location.href = '/menu_administrador.html';
            } else if (rol_id == 2) {
                window.location.href = '/menu_cliente.html';
            }
        } else {
            // Inicio de sesión fallido, mostrar un mensaje de error
            alert('Inicio de sesión fallido: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
