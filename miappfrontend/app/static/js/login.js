document.addEventListener('DOMContentLoaded', function () {
    const formularioLogin = document.getElementById('login-form');

    formularioLogin.addEventListener('submit', async function (event) {
        event.preventDefault();

        // Obtén los datos del formulario
        const username = formularioLogin.querySelector('[name="username"]').value;
        const password = formularioLogin.querySelector('[name="password"]').value;

        console.log('Evento submit del formulario ejecutado.');
        
        try {
            // Realiza la solicitud POST al backend para el inicio de sesión
            const response = await fetch('http://127.0.0.1:5000/usuario/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({ username, password }),
                credentials: 'include'
            });

            const data = await response.json();
            console.log('Data received from fetch:', data);

            // Después de recibir la respuesta exitosa del backend
            if (response.ok) {
                if (data.mensaje === 'Inicio de sesión exitoso' && data.redirect_url) {
                    console.log('Redirigiendo al usuario al dashboard...');
                    const nextUrl = data.redirect_url || '/dashboard';
                    
                    // Almacena el ID de usuario en la sesión del navegador
                    sessionStorage.setItem("user_id", data.user_id);

                    window.location.replace(nextUrl);

                } else {
                    console.error('URL de redirección no especificada en la respuesta del backend.');
                    // Maneja este caso si la URL de redirección no está presente.
                }
            }
            
             else {
                console.error('Error en el inicio de sesión:', data.error_message || response.statusText);
                alert('Error en el inicio de sesión. Verifica tus credenciales.');
            }
        } catch (error) {
            console.error('Error from fetch:', error);
            alert('Ocurrió un error al procesar la solicitud. Inténtalo de nuevo más tarde.');
        }
    });
});
