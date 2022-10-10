const Sequelize = require('sequelize');
const pkg = require('../../package.json');

const databaseName =
  pkg.name + (process.env.NODE_ENV === 'test' ? '-test' : '');

const config = {
  logging: false,
};

if (process.env.LOGGING === 'true') {
  delete config.logging;
}

//https://stackoverflow.com/questions/61254851/heroku-postgres-sequelize-no-pg-hba-conf-entry-for-host
if (process.env.DATABASE_URL) {
  config.dialectOptions = {
    ssl: {
      rejectUnauthorized: false,
    },
  };
}

// const db = new Sequelize(
//   process.env.DATABASE_URL || `postgres://localhost:5432/${databaseName}`,
//   config
// );

const db = new Sequelize(
  'postgresql://doadmin:AVNS_gPdRK1CoHy1RxC4HncV@dbaas-db-10431507-do-user-11409516-0.b.db.ondigitalocean.com:25060/defaultdb?sslmode=require' ||
    `postgres://localhost:5432/${databaseName}`,
  config
);
module.exports = db;
