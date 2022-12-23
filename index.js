const logger = require("./config/logger.js");
const mongoose = require("mongoose");
// const grpc = require("grpc");
// const protoLoader = require("@grpc/proto-loader");
const cfg = require("./config/config");
const PaymeService = require("./services/payme");


// const PROTO_PATH = __dirname + "/local_protos/payment_service/payment_service.proto";
// const packageDefinition = protoLoader.loadSync(
//     PROTO_PATH, {
//         keepCase: true,
//         longs: String,
//         enums: String,
//         defaults: true,
//         oneofs: true
//     });
// const paymentProto = grpc.loadPackageDefinition(packageDefinition).payments

function main() {

    let mongoDBUrl
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
        mongoDBUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        (err) => {
            if (err) {
                logger.error("There is an error in connecting db (" +
                    mongoDBUrl + "): " + err.message);
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

main();