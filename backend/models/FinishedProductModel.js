const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const finishedProductSchema = new Schema({
    name: { type: String, required: true, unique: true }, // e.g., "Mango Blast"
    currentStock: { type: Number, default: 0 },
    unit: { type: String, required: true }, // e.g., "Cups"
    price: { type: Number, default: 0 }, // Useful for selling later
    lastProduced: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('finishedProducts', finishedProductSchema);