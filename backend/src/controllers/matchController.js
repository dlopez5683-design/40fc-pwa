const Match =
  require('../models/Match');

const Player =
  require('../models/Player');


/* =====================================================
   FORMATEAR PARTICIPANTE
   ===================================================== */

const formatearParticipante =
  participante => {

    const player =
      participante.jugador;

    return {

      jugadorId:
        player?._id ?? null,

      nombre:
        player?.usuario?.nombre ?? '',

      correo:
        player?.usuario?.email ?? '',

      confirmacion:
        participante.confirmacion,

      asistio:
        participante.asistio

    };

  };


/* =====================================================
   FORMATEAR PARTIDO
   ===================================================== */

const formatearPartido =
  partido => {

    return {

      id:
        partido._id,

      fecha:
        partido.fecha,

      hora:
        partido.hora,

      cancha:
        partido.cancha,

      costoCanchaCentavos:
        partido.costoCanchaCentavos,

      cuotaJugadorCentavos:
        partido.cuotaJugadorCentavos,

      estado:
        partido.estado,

      participantes:
        partido.participantes
          .map(
            formatearParticipante
          ),

      creadoPor:
        partido.creadoPor,

      createdAt:
        partido.createdAt,

      updatedAt:
        partido.updatedAt

    };

  };


/* =====================================================
   LISTAR PARTIDOS
   ===================================================== */

const listarPartidos =
  async (req, res) => {

    try {

      const partidos =
        await Match
          .find()
          .populate({
            path:
              'participantes.jugador',

            populate: {
              path:
                'usuario',

              select:
                'nombre email'
            }
          })
          .sort({
            fecha: -1
          });


      return res
        .status(200)
        .json({

          ok:
            true,

          total:
            partidos.length,

          partidos:
            partidos.map(
              formatearPartido
            )

        });

    } catch (error) {

      console.error(
        'Error listarPartidos:',
        error
      );


      return res
        .status(500)
        .json({

          ok:
            false,

          message:
            'No fue posible obtener los partidos.'

        });

    }

  };


/* =====================================================
   OBTENER PARTIDO
   ===================================================== */

const obtenerPartido =
  async (req, res) => {

    try {

      const partido =
        await Match
          .findById(
            req.params.id
          )
          .populate({
            path:
              'participantes.jugador',

            populate: {
              path:
                'usuario',

              select:
                'nombre email'
            }
          });


      if (!partido) {

        return res
          .status(404)
          .json({

            ok:
              false,

            message:
              'Partido no encontrado.'

          });

      }


      return res
        .status(200)
        .json({

          ok:
            true,

          partido:
            formatearPartido(
              partido
            )

        });

    } catch (error) {

      return res
        .status(500)
        .json({

          ok:
            false,

          message:
            'No fue posible obtener el partido.'

        });

    }

  };


/* =====================================================
   CREAR PARTIDO
   ===================================================== */

const crearPartido =
  async (req, res) => {

    try {

      const {
        fecha,
        hora,
        cancha,
        costoCanchaCentavos,
        cuotaJugadorCentavos
      } = req.body;


      if (
        !fecha
        ||
        !hora?.trim()
        ||
        !cancha?.trim()
        ||
        costoCanchaCentavos ===
          undefined
      ) {

        return res
          .status(400)
          .json({

            ok:
              false,

            message:
              'Fecha, hora, cancha y costo son obligatorios.'

          });

      }


      if (
        !Number.isInteger(
          costoCanchaCentavos
        )
        ||
        costoCanchaCentavos < 0
      ) {

        return res
          .status(400)
          .json({

            ok:
              false,

            message:
              'El costo de cancha debe enviarse en centavos enteros.'

          });

      }


      const jugadoresActivos =
        await Player
          .find({
            estado:
              'ACTIVO'
          })
          .select(
            '_id'
          );


      const participantes =
        jugadoresActivos.map(
          jugador => ({

            jugador:
              jugador._id,

            confirmacion:
              'PENDIENTE',

            asistio:
              false

          })
        );


      const partido =
        await Match.create({

          fecha,

          hora:
            hora.trim(),

          cancha:
            cancha.trim(),

          costoCanchaCentavos,

          cuotaJugadorCentavos:
            Number.isInteger(
              cuotaJugadorCentavos
            )
              ?
              cuotaJugadorCentavos
              :
              225,

          estado:
            'ABIERTA',

          participantes,

          creadoPor:
            req.usuario._id

        });


      const partidoCompleto =
        await Match
          .findById(
            partido._id
          )
          .populate({
            path:
              'participantes.jugador',

            populate: {
              path:
                'usuario',

              select:
                'nombre email'
            }
          });


      return res
        .status(201)
        .json({

          ok:
            true,

          message:
            'Partido creado correctamente.',

          partido:
            formatearPartido(
              partidoCompleto
            )

        });

    } catch (error) {

      console.error(
        'Error crearPartido:',
        error
      );


      return res
        .status(500)
        .json({

          ok:
            false,

          message:
            'No fue posible crear el partido.'

        });

    }

  };


/* =====================================================
   ACTUALIZAR PARTIDO
   ===================================================== */

const actualizarPartido =
  async (req, res) => {

    try {

      const partido =
        await Match.findById(
          req.params.id
        );


      if (!partido) {

        return res
          .status(404)
          .json({

            ok:
              false,

            message:
              'Partido no encontrado.'

          });

      }


      if (
        partido.estado ===
        'FINALIZADA'
      ) {

        return res
          .status(409)
          .json({

            ok:
              false,

            message:
              'Un partido finalizado no puede modificarse.'

          });

      }


      const {
        fecha,
        hora,
        cancha,
        costoCanchaCentavos
      } = req.body;


      if (fecha) {

        partido.fecha =
          fecha;

      }


      if (hora?.trim()) {

        partido.hora =
          hora.trim();

      }


      if (cancha?.trim()) {

        partido.cancha =
          cancha.trim();

      }


      if (
        costoCanchaCentavos !==
        undefined
      ) {

        if (
          !Number.isInteger(
            costoCanchaCentavos
          )
          ||
          costoCanchaCentavos < 0
        ) {

          return res
            .status(400)
            .json({

              ok:
                false,

              message:
                'El costo debe enviarse en centavos enteros.'

            });

        }


        partido.costoCanchaCentavos =
          costoCanchaCentavos;

      }


      await partido.save();


      const actualizado =
        await Match
          .findById(
            partido._id
          )
          .populate({
            path:
              'participantes.jugador',

            populate: {
              path:
                'usuario',

              select:
                'nombre email'
            }
          });


      return res
        .status(200)
        .json({

          ok:
            true,

          message:
            'Partido actualizado correctamente.',

          partido:
            formatearPartido(
              actualizado
            )

        });

    } catch (error) {

      console.error(
        'Error actualizarPartido:',
        error
      );


      return res
        .status(500)
        .json({

          ok:
            false,

          message:
            'No fue posible actualizar el partido.'

        });

    }

  };


/* =====================================================
   CAMBIAR ESTADO DEL PARTIDO
   ===================================================== */

const cambiarEstadoPartido =
  async (req, res) => {

    try {

      const {
        estado
      } = req.body;


      if (
        ![
          'ABIERTA',
          'CERRADA'
        ].includes(
          estado
        )
      ) {

        return res
          .status(400)
          .json({

            ok:
              false,

            message:
              'Estado de partido no válido.'

          });

      }


      const partido =
        await Match.findById(
          req.params.id
        );


      if (!partido) {

        return res
          .status(404)
          .json({

            ok:
              false,

            message:
              'Partido no encontrado.'

          });

      }


      if (
        partido.estado ===
        'FINALIZADA'
      ) {

        return res
          .status(409)
          .json({

            ok:
              false,

            message:
              'El partido ya está finalizado.'

          });

      }


      partido.estado =
        estado;


      await partido.save();


      return res
        .status(200)
        .json({

          ok:
            true,

          message:
            estado ===
              'CERRADA'
              ?
              'Convocatoria cerrada correctamente.'
              :
              'Convocatoria reabierta correctamente.',

          partido

        });

    } catch (error) {

      return res
        .status(500)
        .json({

          ok:
            false,

          message:
            'No fue posible cambiar el estado del partido.'

        });

    }

  };

/* =====================================================
   ACTUALIZAR ASISTENCIA DE JUGADOR
   ===================================================== */

const actualizarAsistencia =
  async (req, res) => {

    try {

      const {
        asistio
      } = req.body;


      if (
        typeof asistio !==
        'boolean'
      ) {

        return res
          .status(400)
          .json({

            ok: false,

            message:
              'El valor de asistencia debe ser verdadero o falso.'

          });

      }


      const partido =
        await Match.findById(
          req.params.id
        );


      if (!partido) {

        return res
          .status(404)
          .json({

            ok: false,

            message:
              'Partido no encontrado.'

          });

      }


      if (
        partido.estado ===
        'FINALIZADA'
      ) {

        return res
          .status(409)
          .json({

            ok: false,

            message:
              'No se puede modificar la asistencia de un partido finalizado.'

          });

      }


      const participante =
        partido.participantes.find(
          item =>
            item.jugador
              .toString()
            ===
            req.params.jugadorId
        );


      if (!participante) {

        return res
          .status(404)
          .json({

            ok: false,

            message:
              'El jugador no pertenece a esta convocatoria.'

          });

      }


      participante.asistio =
        asistio;


      await partido.save();


      const partidoActualizado =
        await Match
          .findById(
            partido._id
          )
          .populate({

            path:
              'participantes.jugador',

            populate: {

              path:
                'usuario',

              select:
                'nombre email'

            }

          });


      return res
        .status(200)
        .json({

          ok: true,

          message:
            asistio
              ?
              'Asistencia registrada correctamente.'
              :
              'Asistencia eliminada correctamente.',

          partido:
            formatearPartido(
              partidoActualizado
            )

        });

    } catch (error) {

      console.error(
        'Error actualizarAsistencia:',
        error
      );


      return res
        .status(500)
        .json({

          ok: false,

          message:
            'No fue posible actualizar la asistencia.'

        });

    }

  };

/* =====================================================
   LISTAR MIS PARTIDOS - JUGADOR
   ===================================================== */

const listarMisPartidos =
  async (req, res) => {

    try {

      const jugador =
        await Player.findOne({
          usuario:
            req.usuario._id
        });


      if (!jugador) {

        return res
          .status(404)
          .json({

            ok: false,

            message:
              'No existe un perfil de jugador asociado a este usuario.'

          });

      }


      const partidos =
        await Match
          .find({

            'participantes.jugador':
              jugador._id

          })
          .populate({

            path:
              'participantes.jugador',

            populate: {

              path:
                'usuario',

              select:
                'nombre email'

            }

          })
          .sort({
            fecha: -1
          });


      return res
        .status(200)
        .json({

          ok: true,

          total:
            partidos.length,

          jugadorId:
            jugador._id,

          partidos:
            partidos.map(
              formatearPartido
            )

        });

    } catch (error) {

      console.error(
        'Error listarMisPartidos:',
        error
      );


      return res
        .status(500)
        .json({

          ok: false,

          message:
            'No fue posible obtener los partidos del jugador.'

        });

    }

  };


/* =====================================================
   ACTUALIZAR MI CONFIRMACIÓN
   ===================================================== */

const actualizarMiConfirmacion =
  async (req, res) => {

    try {

      const {
        confirmacion
      } = req.body;


      if (
        ![
          'CONFIRMADO',
          'NO_ASISTIRA'
        ].includes(
          confirmacion
        )
      ) {

        return res
          .status(400)
          .json({

            ok: false,

            message:
              'La confirmación enviada no es válida.'

          });

      }


      /*
       * Identificamos al jugador por el
       * usuario autenticado en el JWT.
       */
      const jugador =
        await Player.findOne({

          usuario:
            req.usuario._id

        });


      if (!jugador) {

        return res
          .status(404)
          .json({

            ok: false,

            message:
              'No existe un perfil de jugador asociado a este usuario.'

          });

      }


      const partido =
        await Match.findById(
          req.params.id
        );


      if (!partido) {

        return res
          .status(404)
          .json({

            ok: false,

            message:
              'Partido no encontrado.'

          });

      }


      /*
       * Solo se puede responder mientras
       * la convocatoria esté abierta.
       */
      if (
        partido.estado !==
        'ABIERTA'
      ) {

        return res
          .status(409)
          .json({

            ok: false,

            message:
              'La convocatoria está cerrada y ya no admite cambios.'

          });

      }


      const participante =
        partido.participantes.find(
          item =>
            item.jugador
              .toString()
            ===
            jugador._id.toString()
        );


      if (!participante) {

        return res
          .status(403)
          .json({

            ok: false,

            message:
              'No formas parte de la convocatoria de este partido.'

          });

      }


      participante.confirmacion =
        confirmacion;


      await partido.save();


      const partidoActualizado =
        await Match
          .findById(
            partido._id
          )
          .populate({

            path:
              'participantes.jugador',

            populate: {

              path:
                'usuario',

              select:
                'nombre email'

            }

          });


      return res
        .status(200)
        .json({

          ok: true,

          message:
            confirmacion ===
              'CONFIRMADO'
              ?
              'Asistencia confirmada correctamente.'
              :
              'Se registró que no asistirás.',

          partido:
            formatearPartido(
              partidoActualizado
            )

        });

    } catch (error) {

      console.error(
        'Error actualizarMiConfirmacion:',
        error
      );


      return res
        .status(500)
        .json({

          ok: false,

          message:
            'No fue posible actualizar la confirmación.'

        });

    }

  };

module.exports = {

  listarPartidos,

  obtenerPartido,

  crearPartido,

  actualizarPartido,

  cambiarEstadoPartido,

  actualizarAsistencia,

  listarMisPartidos,

  actualizarMiConfirmacion

};
