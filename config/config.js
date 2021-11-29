const dotenv = require("dotenv").config();
const { 
    DB_USERNAME, 
    DB_PASSWORD, 
    DB_DB_NAME, 
    DB_HOSTNAME,
    DB_PORT,
    SEEDER_STORAGE,
} = process.env;

module.exports = {
    development: {
      username: DB_USERNAME,
      password: DB_PASSWORD,
      database: DB_DB_NAME,
      host: DB_HOSTNAME,
      port: DB_PORT,
      dialect: 'postgres',
      seederStorage: SEEDER_STORAGE
    },
    test: {
        username: DB_USERNAME,
        password: DB_PASSWORD,
        database: DB_DB_NAME,
        host: DB_HOSTNAME,
        port: DB_PORT,
        dialect: 'postgres',
        seederStorage: SEEDER_STORAGE
    },
    production: {
        username: DB_USERNAME,
        password: DB_PASSWORD,
        database: DB_DB_NAME,
        host: DB_HOSTNAME,
        port: DB_PORT,
        dialect: 'postgres',
        seederStorage: SEEDER_STORAGE
    }
  }
  