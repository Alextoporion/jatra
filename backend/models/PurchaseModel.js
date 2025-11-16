const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ingredientSchema = new Schema({
    name:{ type: String, required: true, unique: true},
    unit:{ type: String, required: true },
    quantityInStock:{ type: Number, default: 0 },
    quantity:{ type: Number, required: true },
    pricePerUnit:{ type: Number, required: true },
    supplier:{ type: String, required: true },
    itemImage:{ type: String },
    purchaseDate:{ type: Date, default: Date.now },
    createdBy:{ type: Schema.Types.ObjectId, ref: 'users', required: true }
}, { timestamps: true
})
const PurchaseModel= mongoose.model('purchases', ingredientSchema);
module.exports = PurchaseModel;