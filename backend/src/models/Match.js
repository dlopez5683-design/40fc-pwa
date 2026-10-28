const mongoose = require('mongoose');


const matchSchema =
  new mongoose.Schema(
    {

      fecha: {
        type: Date,
        required: true
      },


      hora: {
        type: String,
        required: true
      },


      cancha: {
        type: String,
        required: true,
        trim: true
      },


      costoCanchaCentavos: {
        type: Number,
        required: true,
        min: 0
      },


      cuotaJugadorCentavos: {
        type: Number,
        default: 225
      },


      estado: {

        type: String,

        enum: [
          'ABIERTA',
          'CERRADA',
          'FINALIZADA'
        ],

        default: 'ABIERTA'

      },


      participantes: [

        {

          jugador: {

            type:
              mongoose.Schema.Types.ObjectId,

            ref: 'Player',

            required: true

          },


          confirmacion: {

            type: String,

            enum: [
              'PENDIENTE',
              'CONFIRMADO',
              'NO_ASISTIRA'
            ],

            default: 'PENDIENTE'

          },


          asistio: {
            type: Boolean,
            default: false
          }

        }

      ]


    },

    {
      timestamps: true
    }

  );


module.exports =
  mongoose.model(
    'Match',
    matchSchema
  );