# Proyecto-Final-DAW
Repositorio que contendrá el proyecto de final de ciclo
Este es un proyecto fullstack que consiste en una plataforma web de recetas enfocada en la gastronomía peruana. Permite explorar recetas, buscar según ingredientes, guardar favoritas y planificar comidas semanalmente.

Proyecto-Final-DAW/ 
├── backend/ # API REST desarrollada con Python + Flask 
│ ├── app/ 
│ ├── run.py 
│ ├── .env 
│ ├── requirements.txt 
│ └── venv/ 
├── frontend/ # Aplicación frontend en React 
└── README.md

## Tecnologías utilizadas

### Backend
- Python 3.11
- Flask
- PostgreSQL
- SQLAlchemy
- Flask-Migrate
- Flask-JWT-Extended
- Marshmallow
- CORS

### Frontend
- React
- Tailwind CSS
- Shadecn/ui
- ...

## Implementación de la aplicación en el servidor:
### Preparamos el backend en caso haga falta:
-	Verificamos nuestro requirements.txt actualizado.
-	Las variables de entorno ya estan configuradas y listas para que se le añadan las generadas por Render.
### Creación de la Base de datos en Render:
-	Iniciamos sesión en nuestra cuenta de Render y añadimos un nuevo Postgres, que será donde se almacene nuestra bbdd.
-	Añadimos un nombre, región y versión de PostgreSQL y creamos la bbdd.
-	Una vez creada obtendremos el Hostname, Port, Database, User y Password, podemos usar esto para conectarnos desde PgAdmin si se desea.
-	Necesitamos copiar el External Connection String o External URL dado que la necesitaremos para la variable de entorno DATABASE_URL en nuestro backend.
 
### Creación del servicio web para el backend en Render:
-	En nuestro Dashboard vamos a “New” -> “Web Service”
-	Conectamos nuestro repositorio, en nuestro caso Github.
-	También es posible usar un repositorio público para el alojamiento.
-	Configuramos el servicio web dándole un nombre, regio, Branch del Github, y la ruta raíz del directorio en caso sea una carpeta conjunta.
-	En mi caso, al tener tanto backend como frontend juntos, elijo backend.
-	Seleccionamos Python3 y en Build Command dejamos por defecto “pip install –r requirements.txt”
-	Para el Start Command configuramos “flask db upgrade && gunicorn run:app” para que al desplegar el backend también me cree la base de datos.
-	Create web service y ahora nos pedirá configurar las variables de entorno.
-	De momento configuramos DATABASE_URL con la external url que obtuvimos al crear la bbdd.
-	Podemos también crear JWT_SECRET_KEY y darle una contraseña random.
-	Todavia nos queda configurar FRONTEND_URL, pero de momento guardamos los cambios.

### Creación del proyecto web para el frontend en Vercel:
-	Iniciamos sesión en Vercel
-	En el dashboard vamos a “Add New” -> “Project”
-	Conectamos nuestra cuenta de Github y elegimos el repositorio que contiene el frontend, luego utilizamos la carpeta frontend.
-	Elegimos un nombre, y en Framework Preset Vercel nos detectará por defecto Vite, caso contrario, lo seleccionamos.
-	Build and Output Settings, aquí Vercel por defecto utiliza los comandos correctos para realizar el despliegue, por lo que lo dejamos como está.
-	Configuramos las variables de entorno para el Frontend en Vercel:
Añadimos VITE_API_BASE_URL y le damos la URL obtenida del backend en Render + “/api”
Ejemplo: https://recetas-backend-proyectofinal.onrender.com/api
-	Ejecutamos Deploy y el proceso de Build se realizará.
-	Copiamos la URL del dominio obtenido una vez desplegado el frontend.
-	Volvemos a nuestro backend y ahora si configuramos la variable de entorno FRONTEND_URL con la URL que obtuvimos en el frontend.
-	Tanto frontend como backend quedarán sincronizadas.
-	Al realizar un commit, se realiza el re-despliegue automatico.


## Autor
Desarrollado como proyecto final del módulo DAW por Adrián Rivas Fernández