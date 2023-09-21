document.addEventListener("DOMContentLoaded", function() {
  // Obtén una referencia al botón para crear servidores
  var crearServidorBtn = document.getElementById("crear-servidor-btn");

  // Obtén una referencia al formulario de creación de servidores
  var crearServidorForm = document.getElementById("crear-servidor-form");

  // Oculta el formulario al cargar la página
  crearServidorForm.style.display = "none";

  // Agrega un evento de clic al botón para mostrar el formulario
  crearServidorBtn.addEventListener("click", function() {
      // Muestra el formulario
      crearServidorForm.style.display = "block";
  });

  // Agrega un evento de envío al formulario para enviar los datos al backend
  crearServidorForm.addEventListener("submit", function(event) {
      event.preventDefault(); // Evita el envío del formulario por defecto

      // Captura los datos del formulario
      var nombre = document.getElementById("nombre-servidor").value;
      var descripcion = document.getElementById("descripcion-servidor").value;

      // Obtén el id del usuario de la sesión del navegador
      var idCreador = sessionStorage.getItem("user_id");

      // Crea un objeto de datos para enviar al servidor
      var datosServidor = {
          nombre: nombre,
          descripcion: descripcion,
          id_creador: idCreador  // Añade el ID del usuario autenticado
      };

    
      fetch("http://127.0.0.1:5000/usuario/crear_servidor", { // Cambia el puerto si es necesario
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(datosServidor),
    credentials: "include",  // Esto envía las cookies si es necesario
})
.then(function(response) {
    if (response.status === 200) {
        // El servidor respondió con éxito
        alert("Servidor creado exitosamente");

        // Aquí puedes agregar el código para visualizar el servidor en el frontend
        // Por ejemplo, podrías agregar un nuevo elemento a una lista de servidores
        var listaServidores = document.getElementById("lista-servidores");
        var nuevoServidor = document.createElement("div");
        nuevoServidor.textContent = nombre;  // Usa el nombre del servidor
        listaServidores.appendChild(nuevoServidor);
    } else {
        // El servidor respondió con un error
        alert("Error al crear el servidor");
    }
})
.catch(function(error) {
    console.error("Error de red:", error);
});


  });
});

document.addEventListener("DOMContentLoaded", function() {
  // Obtén una referencia al botón para crear servidores
  var crearServidorBtn = document.getElementById("crear-servidor-btn");

  // Obtén una referencia al formulario de creación de servidores
  var crearServidorForm = document.getElementById("crear-servidor-form");

  // Oculta el formulario al cargar la página
  crearServidorForm.style.display = "none";

  // Agrega un evento de clic al botón para mostrar el formulario
  crearServidorBtn.addEventListener("click", function() {
      // Muestra el formulario
      crearServidorForm.style.display = "block";
  });
});
