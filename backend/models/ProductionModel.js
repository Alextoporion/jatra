const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productionSchema = new Schema({
    productName: { type: String, required: true }, // e.g., "Mango Blast"
    producedQuantity: { type: Number, required: true }, // e.g., 10
    unit: { type: String, required: true }, // e.g., "Cups", "Tubs"
    
    // This array stores the recipe used for this batch
    ingredientsUsed: [
        {
            ingredientId: { 
                type: Schema.Types.ObjectId, 
                ref: 'purchases', // Links to your existing PurchaseModel
                required: true 
            },
            name: { type: String }, // Saving name here makes it easier to read later
            quantityUsed: { type: Number, required: true } // How much to deduct from stock
        }
    ],
    
    createdBy: { type: Schema.Types.ObjectId, ref: 'users' },
    productionDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('productions', productionSchema);