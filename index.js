require('dotenv').config();

const express = require('express');
const cors = require('cors')

const { dbConnection } = require('./database/config');

// Crear servidor express
const app = express();

// Configurar CORS
app.use( cors() )

// Lectura y parseo del Body 
app.use( express.json() );

// Base de datos
dbConnection();

// Rutas
app.use( '/api/users', require('./routes/user-routes') );
app.use( '/api/login', require('./routes/auth-routes') );

// Puerto de escucha
app.listen( process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto ' + process.env.PORT);
});