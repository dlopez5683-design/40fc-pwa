const mongoose = require('mongoose');


const userSchema =
  new mongoose.Schema(
    {

      nombre: {
        type: String,
        required: true,
        trim: true
      },


      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
      },


      password: {
        type: String,
        required: true,
        select: false
      },


      rol: {
        type: String,

        enum: [
          'JUGADOR',
          'ADMIN',
          'TI'
        ],

        default: 'JUGADOR'
      },


      activo: {
        type: Boolean,
        default: true
      }

    },

    {
      timestamps: true
    }

  );


module.exports =
  mongoose.model(
    'User',
    userSchema
  );