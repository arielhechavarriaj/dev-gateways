# Usamos una imagen de Node.js como base
FROM node:14
LABEL authors="leiraStudio@gmail.com"
# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos los archivos necesarios al contenedor
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto de los archivos al contenedor
COPY . .

# Exponemos el puerto en el que tu aplicación Express escucha
EXPOSE 3000

# Comando para iniciar la aplicación cuando se ejecute el contenedor
CMD ["npm", "start"]
