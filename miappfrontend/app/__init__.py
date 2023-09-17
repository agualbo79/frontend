from flask import Flask, render_template

app = Flask(__name__, static_folder='static', template_folder='templates')

@app.route('/usuario/login', methods=['GET'])
def login():
    return render_template('login.html')

@app.route('/usuario/registro', methods=['GET'])
def registro():
    return render_template('registro.html')


# Resto de tus rutas y lógica aquí

if __name__ == '__main__':
    app.run()
