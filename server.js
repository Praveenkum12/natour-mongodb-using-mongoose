const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', function (err) {
  console.log(err.name);
  console.log(err);
  process.exit(1);
});
dotenv.config({ path: __dirname + '/config.env' });
const app = require('./app');

const PORT = process.env.PORT || 3000;

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => console.log('Database Connected successfully...'));

const server = app.listen(PORT, function () {
  console.log(`App running on PORT ${PORT}`);
});

process.on('unhandledRejection', function (err) {
  console.log(err.name, err.message);
  server.close(function () {
    process.exit(1);
  });
});
