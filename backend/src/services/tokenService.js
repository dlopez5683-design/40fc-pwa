const jwt =
  require('jsonwebtoken');


const generarToken = (
  usuario
) => {

  return jwt.sign(

    {

      userId:
        usuario._id,

      rol:
        usuario.rol

    },

    process.env.JWT_SECRET,

    {

      expiresIn:
        process.env.JWT_EXPIRES_IN
        ||
        '8h'

    }

  );

};


module.exports = {
  generarToken
};