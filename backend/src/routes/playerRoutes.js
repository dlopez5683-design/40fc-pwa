const express =
  require('express');


const {

  listarJugadores,

  obtenerJugador,

  crearJugador,

  actualizarJugador,

  cambiarEstadoJugador

} =
  require(
    '../controllers/playerController'
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


/* =====================================================
   TODAS ESTAS RUTAS REQUIEREN AUTENTICACIÓN
   ===================================================== */

router.use(
  verificarToken
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
  listarJugadores
);


router.get(
  '/:id',
  permitirRoles(
    'ADMIN',
    'TI'
  ),
  obtenerJugador
);


router.post(
  '/',
  permitirRoles(
    'ADMIN',
    'TI'
  ),
  crearJugador
);


router.put(
  '/:id',
  permitirRoles(
    'ADMIN',
    'TI'
  ),
  actualizarJugador
);


router.patch(
  '/:id/estado',
  permitirRoles(
    'ADMIN',
    'TI'
  ),
  cambiarEstadoJugador
);


module.exports =
  router;