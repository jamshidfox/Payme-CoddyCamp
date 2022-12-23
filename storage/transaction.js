const mongoose = require('mongoose')
const { Transaction } = require("../models/transaction")
const {Receipt, PaymeCard} = require("../models/payme");
// const {UserService, getUserInfo } = require("../services/grpc_client/client");

const TransactionStorage = {
    Create: async (data) => {
        try {
            let transaction = new Transaction(data)
            transaction.price = data.price
            return await transaction.save();
        } catch (err) {
            throw new Error(err.message);
        }
    },

    Update: async (id, card_number) => {
        try{
            let result = await Transaction.findOne({receipt_id: id})
            result.status = "success"
            result.card_number = card_number
            result.save()

            return result
        } catch (err) {
            throw new Error(err.message);
        }
    },

    GetAllByUser:  async (user_id, limit, page) => {
        if (!user_id) throw Error("User id is required")
        try {
            let transactions = await Transaction.find({
                user_id: user_id,
            }).limit(limit).skip((page - 1) * limit).lean()

            if (!transactions) throw Error('No transaction is found')
            return transactions
        } catch (err) {
            throw new Error(err.message);
        }
    },

    GetAllTransactions: async (payment_type,purchase_type,price,limit, page, date_start, date_end) => {
        try {
            let userIDs = []
            let userInfoIndex = new Map()
            let andAttribute =[{}]

            if (payment_type.length) {
                andAttribute.push({payment_type:new RegExp(payment_type,"i")})
            }

            if (purchase_type.length) {
                andAttribute.push({purchase_type:new RegExp(purchase_type,"i")})
            }

            if (price) {
                andAttribute.push({price:price})
            }

            if (date_start.length) {
                andAttribute.push({created_at:{$gte:new Date(date_start)}})
            }

            if (date_end.length) {
                andAttribute.push({created_at:{$lte:new Date(date_end)}})
            }
            
            if (date_end.length && date_start.length) {
                andAttribute.push({
                    created_at: {
                        $lte: new Date(date_end),
                        $gte: new Date(date_start)
                    }
                })
            }

            let transactions = await Transaction.find({
                $and:andAttribute}).limit(limit).skip((page - 1) * limit).lean()

            if (!transactions) throw Error('No transactions are found')

            transactions.forEach(item => userIDs.push(item.user_id))

            let userInfoAccIDs = "id"

            if (userInfoAccIDs.objects.length) {
                userInfoAccIDs.objects.forEach((obj,i) => userInfoIndex.set(obj.id,i))
            }

            for (let i = 0; i < transactions.length; i++){
                if (userInfoIndex.get(userIDs[i])) {

                    let { id, fullname, phone_number,
                        profile_photo,dob } = userInfoAccIDs.objects[userInfoIndex.get(userIDs[i])]

                    transactions[i].user_info = {id,fullname,phone_number,profile_photo,dob}
                }
            }

            return transactions
        } catch (err) {
            throw new Error(err.message)
        }
    }
}

module.exports = TransactionStorage