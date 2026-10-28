const mongoose = require('mongoose');


const activitySchema =
  new mongoose.Schema(
    {

      nombre: {
        type: String,
        required: true,
        trim: true
      },


      tipo: {

        type: String,

        enum: [
          'PERIODICA',
          'EVENTO',
          'EXTRAORDINARIA'
        ],

        required: true

      },


      descripcion: {
        type: String,
        trim: true,
        default: ''
      },


      valorPorMiembroCentavos: {
        type: Number,
        required: true,
        min: 0
      },


      fechaLimite: {
        type: Date,
        default: null
      },


      estado: {

        type: String,

        enum: [
          'ACTIVA',
          'CERRADA'
        ],

        default: 'ACTIVA'

      },


      participantes: [

        {

          jugador: {

            type:
              mongoose.Schema.Types.ObjectId,

            ref: 'Player',

            required: true

          },


          pagadoCentavos: {

            type: Number,

            default: 0,

            min: 0

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
    'Activity',
    activitySchema
  );