const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/config.env' });
const app = require('./app');

const PORT = process.env.PORT || 3000;

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB)
  .then(() => console.log('Database Connected successfully...'));

app.listen(PORT, function () {
  console.log(`App running on PORT ${PORT}`);
});
