require('dotenv').config();

const app = require('./app');

const connectDatabase =
  require('./config/database');


const PORT =
  process.env.PORT || 3000;


/* =====================================================
   INICIAR SERVIDOR
   ===================================================== */

const startServer = async () => {

  /*
   * Primero conectamos MongoDB.
   */
  await connectDatabase();


  /*
   * Después iniciamos Express.
   */
  app.listen(PORT, () => {

    console.log('');
    console.log('====================================');
    console.log('       40 FC - BACKEND API');
    console.log('====================================');

    console.log(
      `Servidor: http://localhost:${PORT}`
    );

    console.log(
      `API: http://localhost:${PORT}/api`
    );

    console.log('====================================');
    console.log('');

  });

};


startServer();