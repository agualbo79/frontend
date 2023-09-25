
var elementosCanal = document.querySelectorAll(".canal");
console.log("Elementos de canal encontrados:", elementosCanal.length);

elementosCanal.forEach(function(elemento) {
    elemento.addEventListener("click", function(event) {
        // Obtén el ID del canal del atributo de datos
        var canalId = this.getAttribute("data-canal-id");
        console.log("Haciendo clic en un canal. canalId:", canalId);

        // Establece canalActualId al ID del canal
        canalActualId = canalId;
        console.log("canalActualId después de seleccionar un canal:", canalActualId);

        // Ahora puedes cargar los mensajes para este canal
        cargarMensajes(canalId);
    });
});


var enviarMensajeForm = document.getElementById("enviar-mensaje-form");
// Modificar el evento para enviar mensajes
enviarMensajeForm.addEventListener("submit", function(event) {
    event.preventDefault();
    var mensajeTexto = document.getElementById("mensaje").value;

    console.log("canalActualId antes de enviar un mensaje:", canalActualId);
    if (canalActualId) { // Verifica si se ha seleccionado un canal
        console.log("Enviando mensaje:", mensajeTexto, "al canal ID:", canalActualId);
        enviarMensaje(mensajeTexto, canalActualId);
    } else {
        console.error("Error: Debes seleccionar un canal antes de enviar un mensaje.");
    }
});

// Función para cargar mensajes en el canal actual
function cargarMensajes(canalId) {
    console.log("cargarMensajes llamado con canalId:", canalId);

    if (!canalId || canalId === "undefined") {
        console.error("ID del canal no válido. canalId:", canalId);
        return;
    }

    console.log("Cargando mensajes para el canal con ID:", canalId);

    fetch("http://127.0.0.1:5000/usuario/obtener_mensajes/" + canalId, {
        method: "GET",
        credentials: "include"
    })
    .then(response => response.json())
    .then(function(data) {
        console.log("Respuesta del servidor al obtener mensajes:", data);

        if (Array.isArray(data.mensajes) && data.mensajes.length > 0) {
            var mensajes = data.mensajes;
            var mensajesContainer = document.getElementById("lista-mensajes");
            mensajesContainer.innerHTML = "";

            mensajes.forEach(function(mensaje) {
                var nuevoMensaje = document.createElement("div");
                nuevoMensaje.textContent = mensaje.contenido;
                mensajesContainer.appendChild(nuevoMensaje);
            });
        } else {
            console.warn("Respuesta inesperada del servidor:", data.mensaje);
        }
    })
    .catch(function(error) {
        console.error("Error de red:", error);
    });
}



// Función para enviar un mensaje
function enviarMensaje(mensajeTexto, canalId) {
    if (!canalId) {
        console.error("ID del canal no válido");
        return;
    }

    // Obtener el ID del usuario actual y asignarlo a datosMensaje.id_remitente
    var idRemitente = obtenerIdUsuarioActual();
    if (!idRemitente) {
        console.error("ID del remitente no válido");
        return;
    }

    var datosMensaje = {
        contenido: mensajeTexto,
        id_canal: canalId,
        id_remitente: idRemitente // Asignar el ID del remitente
    };

    fetch("http://127.0.0.1:5000/usuario/enviar_mensaje", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datosMensaje),
        credentials: "include"
    })
    .then(response => response.json())
    .then(function(data) {
        console.log("Respuesta del servidor al enviar mensaje:", data);
        if (data.mensaje === "Mensaje enviado exitosamente") {
            // Puedes hacer algo aquí, como actualizar la lista de mensajes
            cargarMensajes(canalId);
            document.getElementById("mensaje").value = ""; // Limpia el campo de texto
        } else {
            alert("Error al enviar el mensaje");
        }
    })
    .catch(error => {
        console.error("Error de red:", error);
    });
}

// Función para obtener el ID del usuario actual (
function obtenerIdUsuarioActual() {
    // Devuelve un ID 
    return 12; //  cambiar este valor des
}

// Ejemplo de uso:
const idRemitente = obtenerIdUsuarioActual();
if (idRemitente) {
    // Aquí puedes usar el ID del remitente para enviar un mensaje
    console.log('ID del remitente:', idRemitente);
    // Resto del código para enviar el mensaje...
} else {
    // Maneja el caso en el que no haya un usuario autenticado
    console.error('No hay usuario autenticado');
}