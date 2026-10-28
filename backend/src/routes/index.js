const express =
  require('express');

const authRoutes =
  require('./authRoutes');


const router =
  express.Router();


/* =====================================================
   HEALTH
   ===================================================== */

router.get(
  '/health',
  (req, res) => {

    res.status(200).json({

      ok: true,

      message:
        'API 40 FC funcionando correctamente',

      service:
        '40 FC Backend'

    });

  }
);


/* =====================================================
   AUTENTICACIÓN
   ===================================================== */

router.use(
  '/auth',
  authRoutes
);


module.exports =
  router;