const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const finishedProductSchema = new Schema({
    name: { type: String, required: true, unique: true },
    currentStock: { type: Number, default: 0 },
    unit: { type: String, required: true },
    
    price: { type: Number, default: 0 }, // Selling Price (e.g., 50)
    costPrice: { type: Number, default: 0 }, // <--- NEW: Making Cost (e.g., 15)
    
    lastProduced: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('finishedProducts', finishedProductSchema);