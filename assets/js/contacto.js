function Guardar() {   
    var Contactos = {
        nomnbre: $('#ci_cedu').val(),
        email: $('#no_nomb').val(),
        asunto: $('#no_apel').val(),
        mensaje: $('#ciu_naci').val(),
        

    };
    $.ajax({
        type: "POST", //POST xq vas a enviar 
        url: "https://localhost:7255/GuardarContactos", //Esta es la URL de la API
        contentType: "application/json; charset=utf-8",
        data: Contactos,
        success: function (response) {
            if (response.message == "Registro Almacenado") {
                swal({
                    title: "Contactos",
                    text: response.message,
                    type: "success"
                },
                    function () {
                        location.reload();
                    });
            } else {
                swal({
                    title: "Contactos",
                    text: response.message,
                    type: "error"
                },
                    function () {
                    });
            }
        },
        failure: function (response) {
            if (response.responseText != '') {
                alert(response.responseText);
            }
            //alert(response.responseText);
        },
        error: function (response) {
            if (response.responseText != '') {
                alert(response.responseText);
            }
            //alert(response.responseText);
        }
    });
}