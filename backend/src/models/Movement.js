const mongoose = require('mongoose');


const movementSchema =
  new mongoose.Schema(
    {

      jugador: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: 'Player',

        required: true
      },


      partido: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: 'Match',

        default: null
      },


      tipo: {

        type: String,

        enum: [
          'CREDITO_FONDO',
          'DEUDA_FONDO',
          'PAGO_DEUDA'
        ],

        required: true

      },


      valorCentavos: {

        type: Number,

        required: true,

        min: 0

      },


      descripcion: {

        type: String,

        trim: true,

        default: ''

      }

    },

    {
      timestamps: true
    }

  );


module.exports =
  mongoose.model(
    'Movement',
    movementSchema
  );
  