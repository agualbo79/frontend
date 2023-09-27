//dashboard.js
console.log("canalActualId al cargar la página:", canalActualId);


// Variable global para almacenar el servidor seleccionado
var servidorSeleccionadoId = null;

// Variable global para almacenar el ID del canal actual
var canalActualId = null;

document.addEventListener("DOMContentLoaded", function() {
    console.log("DOMContentLoaded se ha disparado");
    var crearServidorBtn = document.getElementById("crear-servidor-btn");
    var crearServidorForm = document.getElementById("crear-servidor-form");
    var listaServidores = document.getElementById("lista-servidores");
    var listaCanales = document.getElementById("lista-canales");
    var crearCanalBtn = document.getElementById("crear-canal-btn");
    crearServidorForm.style.display = "none";
    var servidores = JSON.parse(localStorage.getItem("servidores")) || [];

    
    // Inicializa canalActualId en null al cargar la página
    canalActualId = null;

   // Evento para mostrar u ocultar el formulario de creación de canal
// Evento para mostrar u ocultar el formulario de creación de canal
crearCanalBtn.addEventListener("click", function() {
    var crearCanalForm = document.getElementById("crear-canal-form");
    if (crearCanalForm.style.display === "none" || crearCanalForm.style.display === "") {
        // Si el formulario está oculto o no tiene estilo de visualización, mostrarlo
        crearCanalForm.style.display = "block";
    } else {
        // Si el formulario está visible, ocultarlo
        crearCanalForm.style.display = "none";
    }
});



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
        return; 
    }
         // Crear un objeto con los datos del canal
         var datosCanal = {
             nombre: nombreCanal,
             id_servidor: servidorId,
             id_creador: obtenerIdUsuarioActual() 
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
            console.log("Respuesta del servidor al obtener canales:", data);
            if (data.mensaje === "Canales obtenidos con éxito" && Array.isArray(data.canales)) {
                var canales = data.canales; // Obtenemos la lista de canales
                // Limpia la lista de canales existente
                listaCanales.innerHTML = "";
            // Agrega los nuevos canales con eventos de clic
            // Agregar los nuevos canales con eventos de clic
            canales.forEach(function(canal) {
                var nuevoCanal = document.createElement("div");
                
                // Crear un elemento span para el símbolo "#"
                var simboloNumeral = document.createElement("span");
                simboloNumeral.textContent = "#";
                simboloNumeral.classList.add("hashtag"); // Agrega una clase para aplicar estilos específicos
                
                // Agregar el símbolo "#" al nuevo canal
                nuevoCanal.appendChild(simboloNumeral);
                
                // Agregar el nombre del canal después del símbolo "#"
                var nombreCanal = document.createElement("span");
                nombreCanal.textContent = canal.nombre;
                
                // Agregar el nombre del canal al nuevo canal
                nuevoCanal.appendChild(nombreCanal);

                // Asegúrate de que 'canal.id' sea el ID válido
                if (canal.id) {
                    nuevoCanal.setAttribute("data-canal-id", canal.id);
                } else {
                    console.error("ID de canal no válido para canal:", canal);
                }
            
                nuevoCanal.classList.add("canal"); // Agrega la clase "canal" al elemento
                listaCanales.appendChild(nuevoCanal);
                
                // Depuración: Verificar si los elementos de canal tienen data-canal-id
                console.log("Elemento de canal creado con data-canal-id:", nuevoCanal.getAttribute("data-canal-id"));
            });
            // Ahora que todos los elementos del canal están en el DOM, puedes seleccionarlos
            var elementosCanal = document.querySelectorAll(".canal");
            console.log("Elementos de canal encontrados:", elementosCanal.length);
            elementosCanal.forEach(function(elemento) {
                elemento.addEventListener("click", function(event) {
                    var canalId = this.getAttribute("data-canal-id");
                    console.log("Haciendo clic en un canal. canalId:", canalId);
                    canalActualId = canalId; // Actualiza el canal actual
                    cargarMensajes(canalId); // Carga los mensajes para el canal seleccionado
                });
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
        nuevoServidor.textContent = servidor.nombre.charAt(0); // Obtenemos la primera inicial del nombre
        nuevoServidor.setAttribute("data-servidor-id", servidor.id);
        nuevoServidor.classList.add("server-icon"); // Agregamos una clase para dar estilo a los iconos
        listaServidores.appendChild(nuevoServidor);
    
       // Agregamos el evento mouseover para mostrar el tooltip
        nuevoServidor.addEventListener("mouseover", function(event) {
            var nombreCompleto = servidor.nombre; // Obtenemos el nombre completo del servidor
            mostrarTooltip(event.clientX, event.clientY - 20, nombreCompleto); // Ajusta la posición vertical (20px arriba)
        });

        // Función para mostrar el tooltip con coordenadas personalizadas
        function mostrarTooltip(x, y, nombre) {
            var tooltip = document.createElement("div");
            tooltip.textContent = nombre;
            tooltip.classList.add("tooltip");
            tooltip.style.position = "fixed"; // Para que las coordenadas sean relativas a la ventana
            tooltip.style.left = x + "px";
            tooltip.style.top = y + "px";
            document.body.appendChild(tooltip);
        }
    
        // Agregamos el evento mouseout para ocultar el tooltip cuando el mouse sale del icono
        nuevoServidor.addEventListener("mouseout", function() {
            ocultarTooltip();
        });
    
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

    // Función para mostrar el tooltip
function mostrarTooltip(nombre) {
    var tooltip = document.createElement("div");
    tooltip.textContent = nombre;
    tooltip.classList.add("tooltip");
    document.body.appendChild(tooltip);
}

// Función para ocultar el tooltip
function ocultarTooltip() {
    var tooltips = document.querySelectorAll(".tooltip");
    tooltips.forEach(tooltip => {
        tooltip.remove();
    });
}

// Evento para hacer clic en un canal
document.addEventListener("click", function(event) {
    if (event.target.classList.contains("canal")) {
        var canalId = event.target.getAttribute("data-canal-id");
        console.log("Haciendo clic en un canal. canalId:", canalId);

        // Establece canalActualId al ID del canal
        canalActualId = canalId;
        console.log("canalActualId después de seleccionar un canal:", canalActualId);

       
        cargarMensajes(canalId);
    }
});

// Evento para hacer clic en un canal (delegación de eventos)
listaCanales.addEventListener("click", function(event) {
    var canalId = event.target.getAttribute("data-canal-id");
    if (canalId) {
        console.log("Haciendo clic en un canal. canalId:", canalId);

        // Establece canalActualId al ID del canal
        canalActualId = canalId;
        console.log("canalActualId después de seleccionar un canal:", canalActualId);

       
        cargarMensajes(canalId);
    }
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



