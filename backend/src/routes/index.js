const express = require('express');

const router = express.Router();


/*
 * Ruta de prueba de la API
 */
router.get('/health', (req, res) => {

  res.status(200).json({
    ok: true,
    message: 'API 40 FC funcionando correctamente - OK',
    service: '40 FC Backend'
  });

});


module.exports = router;