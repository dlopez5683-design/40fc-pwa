const mongoose =
  require('mongoose');


const participanteSchema =
  new mongoose.Schema(
    {

      jugador: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref:
          'Player',

        required:
          true
      },


      confirmacion: {
        type:
          String,

        enum: [
          'PENDIENTE',
          'CONFIRMADO',
          'NO_ASISTIRA'
        ],

        default:
          'PENDIENTE'
      },


      asistio: {
        type:
          Boolean,

        default:
          false
      }

    },
    {
      _id:
        false
    }
  );


const matchSchema =
  new mongoose.Schema(
    {

      fecha: {
        type:
          Date,

        required:
          true
      },


      hora: {
        type:
          String,

        required:
          true,

        trim:
          true
      },


      cancha: {
        type:
          String,

        required:
          true,

        trim:
          true
      },


      costoCanchaCentavos: {
        type:
          Number,

        required:
          true,

        min:
          0
      },


      cuotaJugadorCentavos: {
        type:
          Number,

        default:
          225,

        min:
          0
      },


      estado: {
        type:
          String,

        enum: [
          'ABIERTA',
          'CERRADA',
          'FINALIZADA'
        ],

        default:
          'ABIERTA'
      },


      participantes: {
        type: [
          participanteSchema
        ],

        default:
          []
      },


      creadoPor: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref:
          'User',

        required:
          true
      }

    },
    {

      timestamps:
        true

    }
  );


module.exports =
  mongoose.model(
    'Match',
    matchSchema
  );