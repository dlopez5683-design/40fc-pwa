const mongoose = require('mongoose');


const playerSchema =
  new mongoose.Schema(
    {

      usuario: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: 'User',

        required: true,

        unique: true
      },


      telefono: {
        type: String,
        trim: true,
        default: ''
      },


      fechaNacimiento: {
        type: Date,
        default: null
      },


      fechaIngreso: {
        type: Date,
        default: Date.now
      },


      estado: {
        type: String,

        enum: [
          'ACTIVO',
          'INACTIVO'
        ],

        default: 'ACTIVO'
      }

    },

    {
      timestamps: true
    }

  );


module.exports =
  mongoose.model(
    'Player',
    playerSchema
  );