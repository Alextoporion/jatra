const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const salesSchema = new Schema({
    // Who sold it (optional, if you have multiple staff)
    soldBy: { type: Schema.Types.ObjectId, ref: 'users' },
    
    customerName: { type: String, default: "Walk-in Customer" },
    
    // List of ice creams sold in this bill
    items: [
        {
            productId: { 
                type: Schema.Types.ObjectId, 
                ref: 'finishedProducts', // Links to your "Fridge"
                required: true 
            },
            name: { type: String }, 
            quantity: { type: Number, required: true },
            pricePerUnit: { type: Number, required: true },
            totalPrice: { type: Number, required: true }
        }
    ],
    
    grandTotal: { type: Number, required: true },
    paymentMethod: { type: String, default: 'Cash' }, // Cash, Card, Online
    saleDate: { type: Date, default: Date.now }

}, { timestamps: true });

module.exports = mongoose.model('sales', salesSchema);