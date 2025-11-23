const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const salesSchema = new Schema({
    soldBy: { type: Schema.Types.ObjectId, ref: 'users' },
    customerName: { type: String, default: "Walk-in Customer" },
    
    items: [
        {
            productId: { type: Schema.Types.ObjectId, ref: 'finishedProducts', required: true },
            name: { type: String }, 
            quantity: { type: Number, required: true },
            pricePerUnit: { type: Number, required: true },
            totalPrice: { type: Number, required: true }
        }
    ],
    
    grandTotal: { type: Number, required: true }, // Revenue
    totalProfit: { type: Number, default: 0 },    // <--- NEW: Real Profit
    
    paymentMethod: { type: String, default: 'Cash' },
    saleDate: { type: Date, default: Date.now }

}, { timestamps: true });

module.exports = mongoose.model('sales', salesSchema);