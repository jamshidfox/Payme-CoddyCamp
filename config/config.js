const configs = {
    mongoHost: getConf("MONGO_HOST", "localhost"),
    mongoPort: getConf("MONGO_PORT", "27017"),
    mongoUser: getConf("MONGO_USER", "payment_service"),
    mongoPassword: getConf("MONGO_PASSWORD", "mongodb"),
    mongoDatabase: getConf("MONGO_DATABASE", "mongodb"),

    merchantID: getConf('MERCHANT_ID', "61f4e1340851c236a1b3554a"),
    merchantKey: getConf('MERCHANT_KEY', "OI90WP1fliD85KnFZK7EJVVvpJkwfl3nIBCi"),
    merchantUrl: getConf('MERCHANT_URL', 'https://checkout.test.paycom.uz/api'),

    TestMerchantID: getConf('TEST_MERCHANT_ID', "test_id"),
    TestMerchantKey: getConf('TEST_MERCHANT_KEY', "test_key"),
    TestMerchantUrl: getConf('TEST_MERCHANT_URL', 'https://checkout.test.paycom.uz/api'),

    tariffServiceHost: getConf("TARIFF_SERVICE_HOST", "localhost"),
    tariffServicePort: getConf("TARIFF_SERVICE_PORT", 9103),

    userServiceHost: getConf("USER_SERVICE_HOST", "localhost"),
    userServicePort: getConf("USER_SERVICE_PORT", 9101),

    RPCPort: getConf("RPC_PORT", 9104),
    HTTPPort: getConf("HTTP_PORT", 3000),
    Environment: getConf("ENVIRONMENT", "dev"),

}

function getConf(name, def = "") {
    if (process.env[name]) {
        return process.env[name];
    }
    return def;
}

module.exports = configs;