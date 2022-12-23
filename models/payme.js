const mongoose = require("mongoose");

let PaymeReceiptSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
        },
        state: {
            type: Number,
        },
        amount: {
            type: Number
        },
        create_time: {
            type: Number,
        },
        pay_time: {
            type: Number,
        },
        cancel_time: {
            type: Number,
        },
        purchase_id: [{
            type: String
        }]   ,
        user_id: {
            type: String
        }
    },
    {_id: false}
)

let PaymeCardSchema = new mongoose.Schema(
    {
        user_id: {
            type: String,
            required: true
        },
        number: {
            type: String,
            required: true
        },
        expire: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        },
        recurrent: {
            type: Boolean
        },
        verify: {
            type: Boolean,
            default: false
        },
        created_at: {
            type: Date,
            default: Date.now
        },
    }
)

module.exports.PaymeCard = mongoose.model("PaymeCard", PaymeCardSchema);
module.exports.Receipt = mongoose.model("Receipt", PaymeReceiptSchema);
