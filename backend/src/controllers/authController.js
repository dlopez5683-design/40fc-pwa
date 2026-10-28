const bcrypt =
  require('bcryptjs');

const User =
  require('../models/User');

const Player =
  require('../models/Player');

const {
  generarToken
} = require('../services/tokenService');


/* =====================================================
   LOGIN
   ===================================================== */

const login = async (
  req,
  res
) => {

  try {

    const {
      email,
      password
    } = req.body;


    if (
      !email ||
      !password
    ) {

      return res
        .status(400)
        .json({

          ok: false,

          message:
            'Correo y contraseña son obligatorios'

        });

    }


    const usuario =
      await User
        .findOne({
          email:
            email
              .trim()
              .toLowerCase()
        })
        .select('+password');


    if (
      !usuario
      ||
      !usuario.activo
    ) {

      return res
        .status(401)
        .json({

          ok: false,

          message:
            'Credenciales incorrectas'

        });

    }


    const passwordValido =
      await bcrypt.compare(
        password,
        usuario.password
      );


    if (!passwordValido) {

      return res
        .status(401)
        .json({

          ok: false,

          message:
            'Credenciales incorrectas'

        });

    }


    let jugador = null;


    if (
      usuario.rol === 'JUGADOR'
    ) {

      jugador =
        await Player.findOne({
          usuario:
            usuario._id
        });

    }


    const token =
      generarToken(usuario);


    return res
      .status(200)
      .json({

        ok: true,

        token,

        usuario: {

          id:
            usuario._id,

          nombre:
            usuario.nombre,

          email:
            usuario.email,

          rol:
            usuario.rol

        },

        jugadorId:
          jugador?._id
          ||
          null

      });


  } catch (error) {

    console.error(error);


    return res
      .status(500)
      .json({

        ok: false,

        message:
          'Error interno del servidor'

      });

  }

};


module.exports = {
  login
};