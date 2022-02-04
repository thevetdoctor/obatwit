const dotenv = require("dotenv").config();
const { 
    DEV_DB_USERNAME, 
    DEV_DB_PASSWORD, 
    DEV_DB_DB_NAME, 
    DEV_DB_HOSTNAME,
    DEV_DB_PORT,
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
    dev: {
      username: DEV_DB_USERNAME,
      password: DEV_DB_PASSWORD,
      database: DEV_DB_DB_NAME,
      host: DEV_DB_HOSTNAME,
      port: DEV_DB_PORT,
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
  