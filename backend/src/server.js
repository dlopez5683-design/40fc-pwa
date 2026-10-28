require('dotenv').config();

const app = require('./app');


const PORT =
  process.env.PORT || 3000;


app.listen(PORT, () => {

  console.log('');
  console.log('====================================');
  console.log('       40 FC - BACKEND API');
  console.log('====================================');

  console.log(
    `Servidor ejecutándose en http://localhost:${PORT}`
  );

  console.log(
    `API disponible en http://localhost:${PORT}/api`
  );

  console.log('====================================');
  console.log('');

});