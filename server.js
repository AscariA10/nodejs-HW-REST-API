const app = require('./app');
const mongoose = require('mongoose');

// TRkx2HriQLUvvtnI DataBase Password

const { DB_HOST } = process.env;

mongoose
   .connect(DB_HOST)
   .then(() => {
      app.listen(3000, () => {
         console.log('Database connection successful');
      });
   })
   .catch(error => {
      console.log(error.message);
      process.exit(1);
   });
