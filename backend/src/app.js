const express = require('express');
const cors = require('cors');

const apiRoutes = require('./routes');


const app = express();


/* =====================================================
   CORS
   ===================================================== */

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:4200',
    credentials: true
  })
);


/* =====================================================
   MIDDLEWARE
   ===================================================== */

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true
  })
);


/* =====================================================
   RUTA PRINCIPAL
   ===================================================== */

app.get('/', (req, res) => {

  res.status(200).json({
    ok: true,
    application: '40 FC',
    message: 'Servidor de 40 FC funcionando'
  });

});


/* =====================================================
   API
   ===================================================== */

app.use('/api', apiRoutes);


/* =====================================================
   RUTA NO ENCONTRADA
   ===================================================== */

app.use((req, res) => {

  res.status(404).json({
    ok: false,
    message: 'Ruta no encontrada'
  });

});


module.exports = app;