/** @format */

const axios = require("axios");
const config = require("../config/config");

const MERCHANT_ID = config.merchantID;
const MERCHANT_KEY = config.merchantKey;
const URL = config.merchantUrl;
// const MERCHANT_ID = config.TestMerchantID
// const MERCHANT_KEY = config.TestMerchantKey
// const URL = config.TestMerchantUrl

const X_AUTH = `${MERCHANT_ID}:${MERCHANT_KEY}`;

let Functions = {
  AddCard: async (call) => {
    let response = await axios.post(
      URL,
      {
        id: 123,
        method: "cards.create",
        params: {
          card: {
            number: call["card_number"],
            expire: call["card_expire"],
          },
          save: true,
        },
      },
      {
        headers: {
          "X-Auth": MERCHANT_ID,
        },
      }
    );
    if ("error" in response.data)
      throw Error(response.data["error"]["message"]);
    return response;
  },

  SendCode: async (token) => {
    let response = await axios.post(
      URL,
      {
        id: 123,
        method: "cards.get_verify_code",
        params: {
          token: token,
        },
      },
      {
        headers: {
          "X-Auth": MERCHANT_ID,
        },
      }
    );
    if ("error" in response.data)
      throw Error(response.data["error"]["message"]);
    return response;
  },

  VerifyCode: async (token, code) => {
    console.log(code)
    let response = await axios.post(
      URL,
      {
        id: 123,
        method: "cards.verify",
        params: {
          token: token,
          code: code,
        },
      },
      {
        headers: {
          "X-Auth": MERCHANT_ID,
        },
      }
    );
    if ("error" in response.data)
      throw Error(response.data["error"]["message"]);
    return response;
  },

  CheckCard: async (token) => {
    let paymeResponse = await axios.post(
      URL,
      {
        id: 321,
        method: "cards.check",
        params: {
          token: token,
        },
      },
      {
        headers: {
          "X-Auth": MERCHANT_ID,
        },
      }
    );
    if ("error" in paymeResponse.data)
      throw Error(paymeResponse.data["error"]["message"]);
    return paymeResponse;
  },

  RemoveCard: async (token) => {
    let response = await axios.post(
      URL,
      {
        id: 123,
        method: "cards.remove",
        params: {
          token: token,
        },
      },
      {
        headers: {
          "X-Auth": MERCHANT_ID,
        },
      }
    );
    if ("error" in response.data) Error(response.data["error"]["message"]);
    return response;
  },

  CreateReceipts: async (
    amount,
    purchase_id,
    purchase_type = "subscription"
  ) => {
    if (!amount) throw Error("Amount is required");
    if (!purchase_id) throw Error("purchase_id is required");

    let response = await axios.post(
      URL,
      {
        id: 343,
        method: "receipts.create",
        params: {
          amount: amount,
          account: {
            purchase_id: purchase_id,
            purchase_type: purchase_type,
          },
        },
      },
      {
        headers: {
          "X-Auth": X_AUTH,
        },
      }
    );
    if ("error" in response.data)
      throw Error(response.data["error"]["message"]);
    return response;
  },

  PayReceipts: async (user_id, receipt_id, token) => {
    let response = await axios.post(
      URL,
      {
        id: 431,
        method: "receipts.pay",
        params: {
          id: receipt_id,
          token: token,
          payer: {
            user_id: user_id,
          },
        },
      },
      {
        headers: {
          "X-Auth": X_AUTH,
        },
      }
    );
    if ("error" in response.data)
      throw Error(response.data["error"]["message"]);
    return response;
  },

  CancelReceipts: async (receipt_id) => {
    let response = await axios.post(
      URL,
      {
        id: 343,
        method: "receipts.cancel",
        params: {
          id: receipt_id,
        },
      },
      {
        headers: {
          "X-Auth": X_AUTH,
        },
      }
    );
    if ("error" in response.data)
      throw Error(response.data["error"]["message"]);
    return response;
  },

  CheckReceipts: async (account, receipt_id) => {
    return await axios.post(
      URL,
      {
        id: 123,
        method: "receipts.check",
        params: {
          id: receipt_id,
        },
      },
      {
        headers: {
          "X-Auth": X_AUTH,
        },
      }
    );
  },

  SendReceipts: async (account, receipt_id, phone) => {
    return await axios.post(
      URL,
      {
        id: 1,
        method: "receipts.send",
        params: {
          id: receipt_id,
          phone: phone,
        },
      },
      {
        headers: {
          "X-Auth": X_AUTH,
        },
      }
    );
  },
};

module.exports = Functions;
