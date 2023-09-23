document.addEventListener("DOMContentLoaded", function() {
    var crearServidorBtn = document.getElementById("crear-servidor-btn");
    var crearServidorForm = document.getElementById("crear-servidor-form");
    var listaServidores = document.getElementById("lista-servidores");
    var listaCanales = document.getElementById("lista-canales");
    var crearCanalBtn = document.getElementById("crear-canal-btn");
    crearServidorForm.style.display = "none";
    var servidores = JSON.parse(localStorage.getItem("servidores")) || [];

    function cargarCanales(servidorId) {
        console.log("Cargando canales para el servidor con ID:", servidorId);
        var formularioCrearCanal = document.getElementById("crear-canal-form");
        if (formularioCrearCanal) {
            formularioCrearCanal.style.display = "none";
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
            } else {
                console.warn("Respuesta inesperada del servidor:", data.mensaje);
            }

            // Mostrar el botón "Crear Canal" independientemente de la respuesta
            crearCanalBtn.style.display = "block";
        })
        .catch(function(error) {
            console.error("Error de red:", error);

            // Mostrar el botón "Crear Canal" incluso si hay un error
            crearCanalBtn.style.display = "block";
        });
    }



     
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
    } // Cierre de la función crearServidor

    crearServidorBtn.addEventListener("click", function() {
        crearServidorForm.style.display = "block";
    });

    crearServidorForm.addEventListener("submit", function(event) {
        event.preventDefault();
        var nombre = document.getElementById("nombre-servidor").value;
        var descripcion = document.getElementById("descripcion-servidor").value;
        crearServidor(nombre, descripcion);
    });

    servidores.forEach(servidor => {
        var nuevoServidor = document.createElement("div");
        nuevoServidor.textContent = servidor.nombre;
        nuevoServidor.setAttribute("data-servidor-id", servidor.id);
        listaServidores.appendChild(nuevoServidor);

        nuevoServidor.addEventListener("click", function() {
            console.log("Haciendo clic en un servidor");
            var servidorId = nuevoServidor.getAttribute("data-servidor-id");
            cargarCanales(servidorId);

            var formularioCrearCanal = document.getElementById("crear-canal-form");
            if (formularioCrearCanal) {
                if (formularioCrearCanal.style.display === "none") {
                    formularioCrearCanal.style.display = "block";
                }
            }

            console.log("Estado del botón después de cargar canales:", crearCanalBtn.style.display);
        });
    });
});
