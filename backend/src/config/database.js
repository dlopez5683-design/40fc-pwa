const mongoose = require('mongoose');


const connectDatabase = async () => {

  try {

    const connection =
      await mongoose.connect(
        process.env.MONGODB_URI
      );


    console.log('');
    console.log('MongoDB conectado correctamente');

    console.log(
      `Host: ${connection.connection.host}`
    );

    console.log(
      `Base de datos: ${connection.connection.name}`
    );

  } catch (error) {

    console.error('');
    console.error(
      'Error al conectar MongoDB:'
    );

    console.error(
      error.message
    );

    process.exit(1);

  }

};


module.exports = connectDatabase;