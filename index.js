const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConnection } = require('./database/config');

// console.log(process.env);

// Crear servidor de express
const app = express();

// Base de datos
dbConnection();

// CORS
app.use(cors());

// Directorio publico
app.use( express.static('public') );

// lectura y parseo del body. Los datos q vienen en json pasan por este middleware
app.use( express.json() )

// Rutas
app.use('/api/auth', require('./routes/auth') );
app.use('/api/events', require('./routes/events') );

/* app.get('/', (req, res) => {
    res.json({
        "ok": true
    })
}) */

// Escuchar preticiones
app.listen( process.env.PORT, () => {
    console.log( `Servidor corriendo en puerto ${ process.env.PORT }`)
} )