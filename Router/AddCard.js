/** @format */

const express = require("express");
const Router = express.Router();
const payme_test = require("../tests/payme_test");
const client = require("../services/payme");

Router.post("/add-card", async (req, res) => {
  const {
    card_number: CARD,
    expire_date: EXPIRE,
    user_id: USER_ID,
    amount: AMOUNT,
  } = req.body;

  const data = {
    CARD: CARD,
    EXPIRE: EXPIRE,
    USER_ID: USER_ID,
    AMOUNT: AMOUNT,
  };
  await payme_test(client, data);
  res.send("Successfully added");
});

module.exports = Router;