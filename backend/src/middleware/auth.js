const jwt =
  require('jsonwebtoken');

const User =
  require('../models/User');


const verificarToken =
  async (
    req,
    res,
    next
  ) => {

    try {

      const authorization =
        req.headers.authorization;


      if (
        !authorization
        ||
        !authorization.startsWith(
          'Bearer '
        )
      ) {

        return res
          .status(401)
          .json({

            ok: false,

            message:
              'Acceso no autorizado'

          });

      }


      const token =
        authorization.split(' ')[1];


      const decoded =
        jwt.verify(
          token,
          process.env.JWT_SECRET
        );


      const usuario =
        await User
          .findById(
            decoded.userId
          );


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
              'Usuario no autorizado'

          });

      }


      req.usuario =
        usuario;


      next();


    } catch (error) {

      return res
        .status(401)
        .json({

          ok: false,

          message:
            'Token inválido o expirado'

        });

    }

  };


const permitirRoles =
  (...rolesPermitidos) => {

    return (
      req,
      res,
      next
    ) => {

      if (
        !rolesPermitidos.includes(
          req.usuario.rol
        )
      ) {

        return res
          .status(403)
          .json({

            ok: false,

            message:
              'No tienes permisos para realizar esta acción'

          });

      }


      next();

    };

  };


module.exports = {
  verificarToken,
  permitirRoles
};