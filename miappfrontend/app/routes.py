from flask import render_template, request, redirect, url_for, flash
from . import app

# Ruta para mostrar el formulario de inicio de sesión
@app.route('/usuario/login', methods=['GET'])
def login():
    return render_template('login.html')

# Ruta para mostrar el formulario de registro
@app.route('/usuario/registro', methods=['GET'])
def registro():
    return render_template('registro.html')

@app.route('/usuario/registro', methods=['POST'])
def registro_submit():
    # Aquí iría tu código para manejar el registro...


# Resto de tus rutas del frontend aquí
# ...

# Por ejemplo, si tienes una ruta para el panel de usuario, podría verse así:
@app.route('/usuario/dashboard', methods=['GET'])
def dashboard():
    # Lógica de tu panel de usuario
    return render_template('dashboard.html')

# El resto de tus rutas del frontend que coincidan con el backend
# ...

if __name__ == '__main__':
    app.run(debug=True)
