const mongoose = require("mongoose");

let TransactionSchema = new mongoose.Schema(
    {
        receipt_id: {
            type: String,
        },
        payment_type: {
            type: String,
        },
        purchase_type: {
            type: String //movie/tariff
        },
        created_at: {
            type: Date,
        },
        card_number: {
            type: String,
        },
        status: {
            type: String,
        },
        price: {
            type: Number,
        },
        product: {
            type: String
        },
        user_id: {
            type: String
        },
    }
)

module.exports.Transaction = mongoose.model("Transaction", TransactionSchema);
