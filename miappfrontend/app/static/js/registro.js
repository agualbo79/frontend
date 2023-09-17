document.addEventListener('DOMContentLoaded', function () {
    const formularioRegistro = document.getElementById('registro-form');

    formularioRegistro.addEventListener('submit', function (event) {
        event.preventDefault(); // Evita que el formulario se envíe automáticamente

        fetch('http://127.0.0.1:5000/usuario/registro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(new FormData(formularioRegistro))
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch((error) => {
            console.error('Error:', error);
        });

    });
});
