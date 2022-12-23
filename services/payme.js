/** @format */

const logger = require("../config/logger");
const msgs = require("../config/msgs");
const consts = require("../config/consts");
const paymeMethods = require("../payme/methods");
// const grpc = require('grpc')
const PaymeStorage = require("../storage/payme");
const TransactionStorage = require("../storage/transaction");

const PaymeSubscriptionService = {
  AddNewCard: async (call, callback) => {
    logger.debug(msgs.AddCard, {
      label: "payme",
      request: call,
    });
    try {
      let paymeResponse = await paymeMethods.AddCard(call);
      let payload = {
        user_id: call.user_id,
        number: paymeResponse.data["result"]["card"]["number"],
        expire: paymeResponse.data["result"]["card"]["expire"],
        token: paymeResponse.data["result"]["card"]["token"],
        recurrent: paymeResponse.data["result"]["card"]["recurrent"],
        verify: paymeResponse.data["result"]["card"]["verify"],
      };

      let cardObj = await PaymeStorage.AddNewCard(payload);
      let card_id = cardObj._id.toString();

      await paymeMethods.SendCode(
        paymeResponse.data["result"]["card"]["token"]
      );

      callback(null, { card_id: card_id });
    } catch (err) {
      logger.error(err.message, {
        function: msgs.AddCard,
        request: call,
      });
      callback({
        code: "paymeShit",
        message: err.message,
      });
    }
  },
  SendCode: async (call, callback) => {
    logger.debug("Send code request", {
      label: "payme",
      request: call,
    });
    try {
      let cardObj = await PaymeStorage.GetCard(call);
      let paymeResponse = await paymeMethods.SendCode(cardObj.token);
      let card_id = cardObj._id.toString();
      callback(null, { card_id: card_id });
    } catch (err) {
      logger.error(err.message, {
        function: "SendVerifyCode",
        request: call,
      });
      callback({
        code: "wr",
        message: err.message,
      });
    }
  },
  VerifyCard: async (call, callback) => {
    logger.debug(msgs.VerifyCard, {
      label: "payme",
      request: call,
    });

    try {
      let cardObj = await PaymeStorage.GetCard(call);
      await paymeMethods.VerifyCode(cardObj["token"], call.code);

      cardObj.verify = true;
      cardObj.save();

      let card_id = cardObj["_id"].toString();

      callback(null, { card_id: card_id });
    } catch (err) {
      logger.error(err.message, {
        function: msgs.VerifyCard,
        request: call,
      });

      callback({
        code: "shit",
        message: err.message,
      });
    }
  },
  GetCard: async (call, callback) => {
    logger.debug(msgs.GetCard, {
      label: "payme",
      request: call,
    });
    try {
      let cardObj = await PaymeStorage.GetCard(call);
      callback(null, cardObj);
    } catch (err) {
      logger.error(err.message, {
        function: "GetCard",
        request: call,
      });
      callback({
        code: "shit",
        message: err.message,
      });
    }
  },
  CardList: async (call, callback) => {
    logger.debug(msgs.GetCardList, {
      label: "payme",
      request: call,
    });
    try {
      let cardObjects = await PaymeStorage.GetAllCard(call.user_id);

      callback(null, {
        cards: cardObjects,
      });
    } catch (err) {
      logger.error(err.message, {
        function: "CardList",
        request: call,
      });
      callback({
        code: "shit",
        message: err.message,
      });
    }
  },
  RemoveCard: async (call, callback) => {
    logger.debug(msgs.DeleteCard, {
      label: "payme",
      request: call,
    });
    try {
      await PaymeStorage.DeleteCard(call);

      callback(null, {});
    } catch (err) {
      logger.error(err.message, {
        function: "RemoveCard",
        request: call,
      });
      callback({
        code: "shit",
        message: err.message,
      });
    }
  },

  ReceiptCreate: async (call, callback) => {
    logger.debug(msgs.CreateReceipt, {
      label: "payme",
      request: call,
    });
    try {
    //   let card = await PaymeStorage.GetCard(call);

      let paymeResponse = await paymeMethods.CreateReceipts(
        parseInt(call.amount) * 100,
        call.purchase_id,
        call.purchase_type
      );

      let receipt = await PaymeStorage.CreateReceipt(
        paymeResponse.data.result["receipt"],
        call.purchase_id,
        call.user_id
      );

    //   let pay = await paymeMethods.PayReceipts(
    //     call.user_id,
    //     receipt.id,
    //     card.token
    //   );

    //   await PaymeStorage.updateReceipt(pay.data.result["receipt"]);

      let transaction_payload = {
        receipt_id: receipt._id,
        payment_type: "payme",
        purchase_type: call.purchase_type,
        created_at: new Date(),
        status: "initial",
        price: call.amount,
        product: call.name,
        user_id: call.user_id,
      };
      await TransactionStorage.Create(transaction_payload);

      callback(null, receipt);
    } catch (err) {
      logger.error(err.message, {
        function: "ReceiptCreate",
        request: call,
      });
      callback({
        code: "shit",
        message: err.message,
      });
    }
  },

  ReceiptPay: async (call, callback) => {
    logger.debug("Pay receipt request", {
      label: "payme",
      request: call,
    });
    try {
      let card = await PaymeStorage.GetCard(call);

      let paymeResponse = await paymeMethods.PayReceipts(
        call.user_id,
        call.receipt_id,
        card.token
      );

      let response = await PaymeStorage.updateReceipt(
        paymeResponse.data.result["receipt"]
      );

      await TransactionStorage.Update(call.receipt_id, card.number);

      callback(null, response);
    } catch (err) {
      logger.error(err.message, {
        function: "ReceiptCreate",
        request: call,
      });
      callback({
        code: "shit",
        message: err.message,
      });
    }
  },

  ReceiptCancel: async (call, callback) => {
    logger.debug(msgs.CancelReceipt, {
      label: "payme",
      request: call,
    });
    try {
      let paymeResponse = await paymeMethods.CancelReceipts(
        call.receipt_id
      );

      let response = await PaymeStorage.updateReceipt(
        paymeResponse.data.result["receipt"]
      );

      callback(null, response);
    } catch (err) {
      logger.error(err.message, {
        function: "ReceiptCancel",
        request: call,
      });
      callback({
        code: "shit",
        message: err.message,
      });
    }
  },

  TransactionList: async (call, callback) => {
    logger.debug(msgs.GetTransactionList, {
      label: "payme",
      request: call,
    });
    try {
      if (!call.user_id) throw new Error("user_id is missing");

      let transactions = await TransactionStorage.GetAllByUser(
        call.user_id,
        call.limit,
        call.page
      );

      callback(null, {
        transactions: transactions,
        page: call.page,
        count: transactions.length,
      });
    } catch (err) {
      logger.error(err.message, {
        function: "TransactionList",
        request: call,
      });
      callback({
        code: "shit",
        message: err.message,
      });
    }
  },

  GetAllTransactions: async (call, callback) => {
    logger.debug(msgs.GetAllTransactionsList, {
      label: "payme",
      request: call,
    });
    try {
      let {
        payment_type,
        purchase_type,
        price,
        limit,
        page,
        date_start,
        date_end,
      } = call;

      let transactions = await TransactionStorage.GetAllTransactions(
        payment_type,
        purchase_type,
        price,
        limit,
        page,
        date_start,
        date_end
      );

      callback(null, {
        transactions: transactions,
        page: call.page,
        count: transactions.length,
      });
    } catch (err) {
      logger.error(err.message, {
        function: "Get All transactions",
        request: call,
      });
      callback({
        code: "shit",
        message: err.message,
      });
    }
  },

  HealthCheck: async (call, callback) => {
    callback(null, {});
  },
};

module.exports = PaymeSubscriptionService;
