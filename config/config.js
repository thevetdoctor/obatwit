const dotenv = require("dotenv").config();
const { 
    DB_USERNAME, 
    DB_PASSWORD, 
    DB_DB_NAME, 
    DB_HOSTNAME,
    DB_PORT,
    DIALECT,
    SEEDER_STORAGE,
    HEROKU_DB_USERNAME, 
    HEROKU_DB_PASSWORD, 
    HEROKU_DB_DB_NAME, 
    HEROKU_DB_HOSTNAME,
    HEROKU_DB_PORT,
    HEROKU_DIALECT,
    HEROKU_SEEDER_STORAGE 
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
        username: HEROKU_DB_USERNAME,
        password: HEROKU_DB_PASSWORD,
        database: HEROKU_DB_DB_NAME,
        host: HEROKU_DB_HOSTNAME,
        port: HEROKU_DB_PORT,
        dialect: 'postgres',
        seederStorage: HEROKU_SEEDER_STORAGE
    }
  }
  