require('dotenv').config();

const mongoose =
  require('mongoose');

const bcrypt =
  require('bcryptjs');

const connectDatabase =
  require('../config/database');

const User =
  require('../models/User');


const seedAdmin = async () => {

  try {

    await connectDatabase();


    const email =
      process.env.ADMIN_EMAIL
        ?.trim()
        .toLowerCase();


    const password =
      process.env.ADMIN_PASSWORD;


    const nombre =
      process.env.ADMIN_NAME
      ||
      'Administrador 40 FC';


    if (
      !email ||
      !password
    ) {

      throw new Error(
        'ADMIN_EMAIL y ADMIN_PASSWORD son obligatorios'
      );

    }


    const existente =
      await User.findOne({
        email
      });


    if (existente) {

      console.log(
        'El administrador ya existe.'
      );

      await mongoose.disconnect();

      return;

    }


    const passwordHash =
      await bcrypt.hash(
        password,
        12
      );


    await User.create({

      nombre,

      email,

      password:
        passwordHash,

      rol:
        'ADMIN',

      activo:
        true

    });


    console.log(
      'Administrador 40 FC creado correctamente.'
    );


    await mongoose.disconnect();


  } catch (error) {

    console.error(
      error.message
    );

    await mongoose.disconnect();

    process.exit(1);

  }

};


seedAdmin();