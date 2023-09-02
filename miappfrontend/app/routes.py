from flask import Flask

# Crea una instancia de la aplicación Flask
app = Flask(__name__)

# Configuración de la aplicación (puedes definir configuraciones aquí)

# Importa las vistas después de crear la instancia de la aplicación para evitar ciclos de importación
from miappfrontend.app import routes
