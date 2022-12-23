/** @format */

const PaymeSubscriptionService = require("../services/payme");
// const grpc = require("grpc");
// const readline = require('readline').createInterface({
//     input: process.stdin,
//     output: process.stdout
// })
const CARD = "8600 4954 7331 6478";
const EXPIRE = "03/99";
const AMOUNT = 20000;
const USER_ID = "K4TX8jSkwA4visa8chalkHA";
const CODE = "666666";

async function PaymeCardProcess(client) {
  let payload = {
    card_number: CARD,
    card_expire: EXPIRE,
    user_id: USER_ID,
  };

  let response = await addCard(client, payload);
  console.log(response);
  let card_id = response.card_id;

  response = await verifyCard(client, {
    user_id: USER_ID,
    card_id: card_id,
    code: CODE,
  });
  console.log(response);
  response = await cardList(client, {
    user_id: USER_ID,
  });
  console.log(response);
  response = await getCard(client, {
    card_id: card_id,
    user_id: USER_ID
  });
  console.log(response);
  response = await receiptCreate(client, {
    user_id: USER_ID,
    purchase_id: "purchase_id",
    purchase_type: "subscription",
    amount: AMOUNT,
  });
  console.log(response);
  let receipt_id = response._id;

  response = await payReceipt(client, {
    card_id: card_id,
    user_id: USER_ID,
    receipt_id: receipt_id,
  });
  console.log(response);
}

async function payReceipt(client, payload) {
  return new Promise((resolve, reject) => {
    client.ReceiptPay(payload, (err, response) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve(response);
    });
  });
}

async function receiptCreate(client, payload) {
  return new Promise((resolve, reject) => {
    client.ReceiptCreate(payload, (err, response) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve(response);
    });
  });
}

async function addCard(client, payload) {
  return new Promise((resolve, reject) => {
    client.AddNewCard(payload, (err, response) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve(response);
    });
  });
}

async function verifyCard(client, payload) {
  return new Promise((resolve, reject) => {
    client.VerifyCard(payload, (err, response) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve(response);
    });
  });
}

async function cardList(client, payload) {
  return new Promise((resolve, reject) => {
    client.CardList(payload, (err, response) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve(response);
    });
  });
}

async function getCard(client, payload) {
  return new Promise((resolve, reject) => {
    client.GetCard(payload, (err, response) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve(response);
    });
  });
}

module.exports = PaymeCardProcess;
