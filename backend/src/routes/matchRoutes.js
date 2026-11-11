const express =
  require('express');


const {

  listarPartidos,

  obtenerPartido,

  crearPartido,

  actualizarPartido,

  cambiarEstadoPartido,

  actualizarAsistencia,

  listarMisPartidos,

  actualizarMiConfirmacion

} =
  require(
    '../controllers/matchController'
  );


const {

  verificarToken,

  permitirRoles

} =
  require(
    '../middleware/auth'
  );


const router =
  express.Router();


router.use(
  verificarToken
);

/* =====================================================
   RUTAS DEL JUGADOR
   ===================================================== */

router.get(
  '/mios',

  permitirRoles(
    'JUGADOR'
  ),

  listarMisPartidos
);


router.patch(
  '/:id/mi-confirmacion',

  permitirRoles(
    'JUGADOR'
  ),

  actualizarMiConfirmacion
);


/* =====================================================
   ADMIN / TI
   ===================================================== */

router.get(
  '/',
  permitirRoles(
    'ADMIN',
    'TI'
  ),
  listarPartidos
);


router.get(
  '/:id',
  permitirRoles(
    'ADMIN',
    'TI'
  ),
  obtenerPartido
);


router.post(
  '/',
  permitirRoles(
    'ADMIN',
    'TI'
  ),
  crearPartido
);


router.put(
  '/:id',
  permitirRoles(
    'ADMIN',
    'TI'
  ),
  actualizarPartido
);


router.patch(
  '/:id/estado',
  permitirRoles(
    'ADMIN',
    'TI'
  ),
  cambiarEstadoPartido
);

/* =====================================================
   ASISTENCIA REAL
   ===================================================== */

router.patch(
  '/:id/participantes/:jugadorId/asistencia',

  permitirRoles(
    'ADMIN',
    'TI'
  ),

  actualizarAsistencia
);

module.exports =
  router;