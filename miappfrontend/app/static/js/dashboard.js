// Variable global para almacenar el servidor seleccionado
var servidorSeleccionadoId = null;

document.addEventListener("DOMContentLoaded", function() {
    var crearServidorBtn = document.getElementById("crear-servidor-btn");
    var crearServidorForm = document.getElementById("crear-servidor-form");
    var listaServidores = document.getElementById("lista-servidores");
    var listaCanales = document.getElementById("lista-canales");
    var crearCanalBtn = document.getElementById("crear-canal-btn");
    crearServidorForm.style.display = "none";
    var servidores = JSON.parse(localStorage.getItem("servidores")) || [];

     // Evento para crear un canal
    var crearCanalForm = document.getElementById("crear-canal-form");
    crearCanalForm.addEventListener("submit", function(event) {
        event.preventDefault();
        var nombreCanal = document.getElementById("nombre-canal").value;

        if (servidorSeleccionadoId) { // Verifica si se ha seleccionado un servidor
            console.log("Creando canal:", nombreCanal, "en el servidor ID:", servidorSeleccionadoId);
            crearCanal(nombreCanal, servidorSeleccionadoId);
        } else {
            console.error("Error: Debes seleccionar un servidor antes de crear un canal.");
        }
    });

     // Función para crear un canal
     function crearCanal(nombreCanal, servidorId) {
        // Verifica si se ha seleccionado un servidor
        if (servidorSeleccionadoId === null) {
        alert("Debes seleccionar un servidor antes de crear un canal.");
        return; // No envíes la solicitud al servidor
    }
         // Crear un objeto con los datos del canal
         var datosCanal = {
             nombre: nombreCanal,
             id_servidor: servidorId,
             id_creador: obtenerIdUsuarioActual() // Debes implementar esta función para obtener el ID del usuario actual
         };
         console.log("Enviando solicitud para crear canal:", datosCanal);
 
         // Realizar una solicitud POST al servidor para crear el canal
         fetch("http://127.0.0.1:5000/usuario/crear_canal", {
             method: "POST",
             headers: {
                 "Content-Type": "application/json"
             },
             body: JSON.stringify(datosCanal),
             credentials: "include"
         })
         .then(response => response.json())
         .then(function(data) {
             console.log("Respuesta del servidor al crear canal:", data);
             if (data.mensaje === "Canal creado exitosamente") {
                 alert("Canal creado exitosamente");
                 // Puedes actualizar la lista de canales aquí si lo deseas
             } else {
                 alert("Error al crear el canal");
             }
         })
         .catch(error => {
             console.error("Error de red:", error);
         });
     }
 

    // Función para obtener el ID del usuario actual
    function obtenerIdUsuarioActual() {
        // Aquí debes implementar la lógica para obtener el ID del usuario actual.
        // Puede ser a través de variables de sesión, tokens de autenticación, etc.
        // Por ejemplo, si tienes el ID almacenado en una variable de sesión llamada "user_id"
        var idUsuario = sessionStorage.getItem("user_id");

        // Si lo obtuviste con éxito, devuélvelo
        if (idUsuario) {
            return idUsuario;
        } else {
            // Si no pudiste obtener el ID del usuario actual, debes manejarlo según tu lógica
            // Puedes lanzar un error, mostrar un mensaje al usuario o manejarlo de otra manera adecuada.
            // Por ejemplo:
            console.error("No se pudo obtener el ID del usuario actual");
            return null; // O puedes lanzar un error personalizado aquí
        }
    }
    // Función para cargar canales
    function cargarCanales(servidorId) {
        console.log("Cargando canales para el servidor con ID:", servidorId);
        // Mostrar el botón "Crear Canal" al final
crearCanalBtn.style.display = "block";
        var formularioCrearCanal = document.getElementById("crear-canal-form");
        if (formularioCrearCanal) {
            formularioCrearCanal.style.display = "block";
        }

        fetch("http://127.0.0.1:5000/usuario/obtener_canales/" + servidorId, {
            method: "GET",
            credentials: "include"
        })
        .then(response => response.json())
        .then(function(data) {
            if (data.mensaje === "Canales obtenidos con éxito" && Array.isArray(data.canales)) {
                var canales = data.canales; // Obtenemos la lista de canales
                // Limpia la lista de canales existente
                listaCanales.innerHTML = "";

                // Agrega los nuevos canales
                canales.forEach(function(canal) {
                    var nuevoCanal = document.createElement("div");
                    nuevoCanal.textContent = canal.nombre;
                    listaCanales.appendChild(nuevoCanal);
                });
                // Mostrar el botón "Crear Canal" al inicio
                crearCanalBtn.style.display = "block";
            } else {
                console.warn("Respuesta inesperada del servidor:", data.mensaje);
            }
        })
        .catch(function(error) {
            console.error("Error de red:", error);
        });
    }

    // Evento para mostrar el formulario de creación de servidor
    crearServidorBtn.addEventListener("click", function() {
        crearServidorForm.style.display = "block";
    });

    // Evento para crear un servidor
    crearServidorForm.addEventListener("submit", function(event) {
        event.preventDefault();
        var nombre = document.getElementById("nombre-servidor").value;
        var descripcion = document.getElementById("descripcion-servidor").value;
        crearServidor(nombre, descripcion);
    });

    // Función para crear un servidor
    function crearServidor(nombre, descripcion) {
        var idCreador = sessionStorage.getItem("user_id");
        var datosServidor = {
            nombre: nombre,
            descripcion: descripcion,
            id_creador: idCreador
        };

        fetch("http://127.0.0.1:5000/usuario/crear_servidor", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datosServidor),
            credentials: "include"
        })
        .then(response => response.json())
        .then(data => {
            if (data.mensaje === "Servidor creado exitosamente") {
                alert("Servidor creado exitosamente");
                datosServidor.id = data.id_servidor;
                servidores.push(datosServidor);
                localStorage.setItem("servidores", JSON.stringify(servidores));
                var nuevoServidor = document.createElement("div");
                nuevoServidor.textContent = nombre;
                nuevoServidor.setAttribute("data-servidor-id", data.id_servidor);
                listaServidores.appendChild(nuevoServidor);
                document.getElementById("nombre-servidor").value = "";
                document.getElementById("descripcion-servidor").value = "";
                crearServidorForm.style.display = "none";
            } else {
                alert("Error al crear el servidor");
            }
        })
        .catch(error => {
            console.error("Error de red:", error);
        });
    }



    // Evento para cargar canales al hacer clic en un servidor
    servidores.forEach(servidor => {
    var nuevoServidor = document.createElement("div");
    nuevoServidor.textContent = servidor.nombre;
    nuevoServidor.setAttribute("data-servidor-id", servidor.id);
    listaServidores.appendChild(nuevoServidor);

    nuevoServidor.addEventListener("click", function() {
        console.log("Haciendo clic en un servidor");
        var servidorId = nuevoServidor.getAttribute("data-servidor-id");
        // Actualiza el servidor seleccionado globalmente
        servidorSeleccionadoId = servidorId;
        cargarCanales(servidorId);

        var formularioCrearCanal = document.getElementById("crear-canal-form");
        if (formularioCrearCanal) {
            if (formularioCrearCanal.style.display === "block") {
                formularioCrearCanal.style.display = "block";
            }
        }
    });
});


    
});
function obtenerServidorSeleccionadoId() {
    var servidorSeleccionado = document.querySelector(".server.selected");
    if (servidorSeleccionado) {
        var servidorId = servidorSeleccionado.getAttribute("data-servidor-id");
        console.log("Servidor seleccionado:", servidorId);
        return servidorId;
    } else {
        console.log("Ningún servidor seleccionado.");
        return null;
    }
}