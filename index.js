/** @format */
//Express
const express = require("express");
const app = express();
const Router = express.Router();
const port = 3000;
const bodyParser = require("body-parser");

//
const logger = require("./config/logger.js");
const mongoose = require("mongoose");

const cfg = require("./config/config");
const PaymeService = require("./services/payme");

function main() {
  let mongoDBUrl;
  if (cfg.Environment === "dev") {
    mongoDBUrl = "mongodb://localhost:27017/payment_service";
  } else {
    mongoDBUrl =
      "mongodb://" +
      cfg.mongoUser +
      ":" +
      cfg.mongoPassword +
      "@" +
      cfg.mongoHost +
      ":" +
      cfg.mongoPort +
      "/" +
      cfg.mongoDatabase;
  }
  logger.info("Connecting to db: " + mongoDBUrl);

  mongoose.connect(
    mongoDBUrl,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (err) => {
      if (err) {
        logger.error(
          "There is an error in connecting db (" +
            mongoDBUrl +
            "): " +
            err.message
        );
        process.exit();
      }
    }
  );

  mongoose.connection.once("open", function () {
    logger.info("Connected to the database");

    setTimeout(() => {}, 1000);
  });

  // let server = new grpc.Server();

  // server.addService(paymentProto.PaymentService.service, PaymeService);

  // server.bind("0.0.0.0:" + cfg.RPCPort, grpc.ServerCredentials.createInsecure());
  // server.start();
  logger.info("grpc server is running at %s", cfg.RPCPort);
}
//body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//
//Router
const AddCard = require("./Router/AddCard");

app.use("/coddy-camp", AddCard);
//
//Express Server
app.listen(port, (error) => {
  if (error) {
    console.log(`Error :\n ${error}`);
  } else {
    console.log(`Server is running on port ${port}`);
    main();
  }
});
