/** @format */

const logger = require("./config/logger");
const mongoose = require("mongoose");
const payme_test = require("./tests/payme_test");
const client = require("./services/payme");
// const grpc = require("grpc");
// const protoLoader = require("@grpc/proto-loader");
const cfg = require("./config/config");
// const protoLoader = require("@grpc/proto-loader");
// const grpc = require("grpc");

// const PROTO_PATH = __dirname + "/protos/payment_service/payment_service.proto";
// const packageDefinition = protoLoader.loadSync(
//     PROTO_PATH,
//     {
//         keepCase: true,
//         longs: String,
//         enums: String,
//         defaults: true,
//         oneofs: true
//     });
// const paymentProto = grpc.loadPackageDefinition(packageDefinition).payments

// let client = new paymentProto.PaymentService(
//   "localhost:6061",
//   grpc.credentials.createInsecure()
// );

async function main() {
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

  await payme_test(client);
}

main();
