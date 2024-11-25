# Etapa de construcción
FROM node:18-alpine AS builder  # Cambiado a Node.js 18 (soporte LTS)

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos de dependencias
COPY package*.json ./

# Instalar las dependencias de desarrollo
RUN npm install

# Copiar el código de la aplicación
COPY . .

# Compilar la aplicación
RUN npm run build

# Remover las dependencias de desarrollo
RUN npm prune --production

# Etapa de producción
FROM node:18-alpine  # Cambiado a Node.js 18 (soporte LTS)

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar las dependencias de producción desde la etapa de construcción
COPY --from=builder /app/node_modules ./node_modules

# Copiar el código compilado desde la etapa de construcción
COPY --from=builder /app/dist ./dist

# Copiar el package.json (opcional, si es necesario)
COPY package*.json ./

# Exponer el puerto que utiliza la aplicación
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["node", "dist/main"]
