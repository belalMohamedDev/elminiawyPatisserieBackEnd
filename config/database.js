const mongoose = require("mongoose");

//connect with db
const dbConnection = () =>
  mongoose
    .connect(process.env.DB_URL)
    .then((connect) =>
      console.log(`DataBase is Connected ${connect.connection.host}`)
    )
 

module.exports = dbConnection;
