const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DATABASE,
  synchronize: true,
  logging: false,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migration/*.js'],
  subscribers: ['src/subscriber/**/*.ts'],
  seeds: ['dist/seeds/*.js'],
  factories: ['dist/factories/*.js'],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber',
  },
};
