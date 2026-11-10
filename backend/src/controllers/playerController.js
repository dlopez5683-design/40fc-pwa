const bcrypt =
  require('bcryptjs');

const User =
  require('../models/User');

const Player =
  require('../models/Player');


/* =====================================================
   FORMATEAR JUGADOR
   ===================================================== */

const formatearJugador =
  jugador => {

    return {

      id:
        jugador._id,

      nombre:
        jugador.usuario?.nombre ?? '',

      correo:
        jugador.usuario?.email ?? '',

      telefono:
        jugador.telefono ?? '',

      fechaNacimiento:
        jugador.fechaNacimiento,

      fechaIngreso:
        jugador.fechaIngreso,

      estado:
        jugador.estado,

      usuarioActivo:
        jugador.usuario?.activo ?? false,

      usuarioId:
        jugador.usuario?._id ?? null

    };

  };


/* =====================================================
   LISTAR JUGADORES
   ===================================================== */

const listarJugadores =
  async (req, res) => {

    try {

      const jugadores =
        await Player
          .find()
          .populate(
            'usuario',
            'nombre email rol activo'
          )
          .sort({
            fechaIngreso: -1
          });


      return res
        .status(200)
        .json({

          ok:
            true,

          total:
            jugadores.length,

          jugadores:
            jugadores.map(
              formatearJugador
            )

        });

    } catch (error) {

      console.error(
        'Error listarJugadores:',
        error
      );


      return res
        .status(500)
        .json({

          ok:
            false,

          message:
            'No fue posible obtener los jugadores.'

        });

    }

  };


/* =====================================================
   OBTENER JUGADOR
   ===================================================== */

const obtenerJugador =
  async (req, res) => {

    try {

      const jugador =
        await Player
          .findById(
            req.params.id
          )
          .populate(
            'usuario',
            'nombre email rol activo'
          );


      if (!jugador) {

        return res
          .status(404)
          .json({

            ok:
              false,

            message:
              'Jugador no encontrado.'

          });

      }


      return res
        .status(200)
        .json({

          ok:
            true,

          jugador:
            formatearJugador(
              jugador
            )

        });

    } catch (error) {

      return res
        .status(500)
        .json({

          ok:
            false,

          message:
            'No fue posible obtener el jugador.'

        });

    }

  };


/* =====================================================
   CREAR JUGADOR
   ===================================================== */

const crearJugador =
  async (req, res) => {

    try {

      const {
        nombre,
        correo,
        password,
        telefono,
        fechaNacimiento,
        fechaIngreso
      } = req.body;


      if (
        !nombre?.trim()
        ||
        !correo?.trim()
        ||
        !password
      ) {

        return res
          .status(400)
          .json({

            ok:
              false,

            message:
              'Nombre, correo y contraseña son obligatorios.'

          });

      }


      if (
        password.length < 8
      ) {

        return res
          .status(400)
          .json({

            ok:
              false,

            message:
              'La contraseña temporal debe tener al menos 8 caracteres.'

          });

      }


      const emailNormalizado =
        correo
          .trim()
          .toLowerCase();


      const usuarioExistente =
        await User.findOne({

          email:
            emailNormalizado

        });


      if (usuarioExistente) {

        return res
          .status(409)
          .json({

            ok:
              false,

            message:
              'Ya existe un usuario con ese correo electrónico.'

          });

      }


      const passwordHash =
        await bcrypt.hash(
          password,
          12
        );


      const usuario =
        await User.create({

          nombre:
            nombre.trim(),

          email:
            emailNormalizado,

          password:
            passwordHash,

          rol:
            'JUGADOR',

          activo:
            true

        });


      try {

        const jugador =
          await Player.create({

            usuario:
              usuario._id,

            telefono:
              telefono?.trim() ?? '',

            fechaNacimiento:
              fechaNacimiento || null,

            fechaIngreso:
              fechaIngreso || new Date(),

            estado:
              'ACTIVO'

          });


        const jugadorCompleto =
          await Player
            .findById(
              jugador._id
            )
            .populate(
              'usuario',
              'nombre email rol activo'
            );


        return res
          .status(201)
          .json({

            ok:
              true,

            message:
              'Jugador creado correctamente.',

            jugador:
              formatearJugador(
                jugadorCompleto
              )

          });

      } catch (errorJugador) {

        /*
         * Si falla Player después de crear User,
         * eliminamos el User para no dejar
         * registros incompletos.
         */

        await User.findByIdAndDelete(
          usuario._id
        );


        throw errorJugador;

      }

    } catch (error) {

      console.error(
        'Error crearJugador:',
        error
      );


      return res
        .status(500)
        .json({

          ok:
            false,

          message:
            'No fue posible crear el jugador.'

        });

    }

  };


/* =====================================================
   ACTUALIZAR JUGADOR
   ===================================================== */

const actualizarJugador =
  async (req, res) => {

    try {

      const jugador =
        await Player
          .findById(
            req.params.id
          )
          .populate(
            'usuario'
          );


      if (!jugador) {

        return res
          .status(404)
          .json({

            ok:
              false,

            message:
              'Jugador no encontrado.'

          });

      }


      const {
        nombre,
        correo,
        telefono,
        fechaNacimiento,
        fechaIngreso
      } = req.body;


      if (
        correo
        &&
        correo.trim().toLowerCase()
          !==
        jugador.usuario.email
      ) {

        const emailExiste =
          await User.findOne({

            email:
              correo
                .trim()
                .toLowerCase(),

            _id: {
              $ne:
                jugador.usuario._id
            }

          });


        if (emailExiste) {

          return res
            .status(409)
            .json({

              ok:
                false,

              message:
                'Ese correo ya está registrado.'

            });

        }

      }


      if (nombre?.trim()) {

        jugador.usuario.nombre =
          nombre.trim();

      }


      if (correo?.trim()) {

        jugador.usuario.email =
          correo
            .trim()
            .toLowerCase();

      }


      if (
        telefono !== undefined
      ) {

        jugador.telefono =
          telefono?.trim() ?? '';

      }


      if (
        fechaNacimiento !==
        undefined
      ) {

        jugador.fechaNacimiento =
          fechaNacimiento || null;

      }


      if (
        fechaIngreso
      ) {

        jugador.fechaIngreso =
          fechaIngreso;

      }


      await jugador.usuario.save();

      await jugador.save();


      const actualizado =
        await Player
          .findById(
            jugador._id
          )
          .populate(
            'usuario',
            'nombre email rol activo'
          );


      return res
        .status(200)
        .json({

          ok:
            true,

          message:
            'Jugador actualizado correctamente.',

          jugador:
            formatearJugador(
              actualizado
            )

        });

    } catch (error) {

      console.error(
        'Error actualizarJugador:',
        error
      );


      return res
        .status(500)
        .json({

          ok:
            false,

          message:
            'No fue posible actualizar el jugador.'

        });

    }

  };


/* =====================================================
   CAMBIAR ESTADO
   ===================================================== */

const cambiarEstadoJugador =
  async (req, res) => {

    try {

      const {
        estado
      } = req.body;


      if (
        ![
          'ACTIVO',
          'INACTIVO'
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
              'Estado de jugador no válido.'

          });

      }


      const jugador =
        await Player
          .findById(
            req.params.id
          )
          .populate(
            'usuario'
          );


      if (!jugador) {

        return res
          .status(404)
          .json({

            ok:
              false,

            message:
              'Jugador no encontrado.'

          });

      }


      jugador.estado =
        estado;


      jugador.usuario.activo =
        estado === 'ACTIVO';


      await jugador.save();

      await jugador.usuario.save();


      const actualizado =
        await Player
          .findById(
            jugador._id
          )
          .populate(
            'usuario',
            'nombre email rol activo'
          );


      return res
        .status(200)
        .json({

          ok:
            true,

          message:
            estado === 'ACTIVO'
              ?
              'Jugador activado correctamente.'
              :
              'Jugador desactivado correctamente.',

          jugador:
            formatearJugador(
              actualizado
            )

        });

    } catch (error) {

      console.error(
        'Error cambiarEstadoJugador:',
        error
      );


      return res
        .status(500)
        .json({

          ok:
            false,

          message:
            'No fue posible cambiar el estado del jugador.'

        });

    }

  };


module.exports = {

  listarJugadores,

  obtenerJugador,

  crearJugador,

  actualizarJugador,

  cambiarEstadoJugador

};