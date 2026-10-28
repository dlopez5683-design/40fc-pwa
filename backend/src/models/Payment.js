const mongoose = require('mongoose');


const paymentSchema =
  new mongoose.Schema(
    {

      jugador: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: 'Player',

        required: true

      },


      concepto: {

        type: String,

        enum: [
          'FONDO_COMUN',
          'ACTIVIDAD'
        ],

        required: true

      },


      actividad: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: 'Activity',

        default: null

      },


      valorCentavos: {

        type: Number,

        required: true,

        min: 1

      },


      formaPago: {

        type: String,

        enum: [
          'EFECTIVO',
          'TRANSFERENCIA'
        ],

        required: true

      },


      fecha: {

        type: Date,

        required: true

      },


      registradoPor: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: 'User',

        required: true

      }

    },

    {
      timestamps: true
    }

  );


module.exports =
  mongoose.model(
    'Payment',
    paymentSchema
  );