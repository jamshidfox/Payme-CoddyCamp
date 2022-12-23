const {PaymeCard} = require("../models/payme")
const {Receipt} = require("../models/payme")
const mongoose = require('mongoose')

const PaymeStorage = {
    AddNewCard: async (data) => {
        if (!data['user_id']) throw Error("User id is required")
        try {
            let card = new PaymeCard(data)
            return await card.save();
        } catch (err) {
            throw new Error(err.message);
        }
    },
    UpdateCard: async (data) => {
        if (!data['token']) throw Error("Card token is required")
        try {
            let card = await PaymeCard.updateOne({
                card_token: data['token'],
            }, {
                $set: data
            })
            if (!card) throw Error('No card is found')
            return card
        } catch (err) {
            throw new Error(err.message);
        }
    },
    DeleteCard: async (data) => {
        if (!data['card_id']) throw Error("Card id is required")
        if (!data['user_id']) throw Error("User id is required")
        try {
            let card = await PaymeCard.deleteOne({
                _id: data['card_id'],
                user_id: data['user_id']
            })
            if (!card) throw Error('No card is found')
            return card
        } catch (err) {
            throw new Error(err.message);
        }
    },
    GetCard: async (data) => {
        if (!data['card_id']) throw Error("Card id is required")
        if (!data['user_id']) throw Error("User id is required")
        try {
            let card = await PaymeCard.findOne({
                _id: data['card_id'],
                user_id: data['user_id']
            })
            if (!card) throw Error('No card is found')
            return card
        } catch (err) {
            throw new Error(err.message);
        }
    },
    GetAllCard: async (user_id) => {
        if (!user_id) throw Error("User id is required")
        try {
            let cards = await PaymeCard.find({
                user_id: user_id,
                verify: true
            }).lean()
            if (!cards) throw Error('No card is found')
            return cards
        } catch (err) {
            throw new Error(err.message);
        }
    },

    CreateReceipt: async (data, purchase_id, user_id) => {
        try {
            let r = new Receipt({
                _id: data._id,
                create_time: data.create_time,
                pay_time: data.pay_time,
                cancel_time: data.cancel_time,
                amount: data.amount,
                state: data.state,
                purchase_id: purchase_id,
                user_id: user_id
            })
            return await r.save()
        } catch (err) {
            throw new Error(err.message);
        }
    },

    updateReceipt: async (data) => {
        try {
            let result = await Receipt.findOne({_id: data._id})
            result.create_time = data.create_time
            result.pay_time = data.pay_time
            result.cancel_time = data.cancel_time
            result.state = data.state
            result.save()

            return result
        } catch (err) {
            throw new Error(err.message);
        }
    },

    getReceipt: async (data, state) => {
        if (!data.purchase_id) throw Error("purchase_id is required")
        if (!data.receipt_id) throw Error("receipt_id is required")
        try {
            let receipt = await Receipt.findOne({
                _id: data.receipt_id,
                receipt_state: {
                    $in: state
                },
                purchase_id: data.purchase_id
            })
            if (!receipt) throw Error('No receipt is found')
            return receipt
        } catch (err) {
            throw new Error(err.message);
        }
    },
}

module.exports = PaymeStorage