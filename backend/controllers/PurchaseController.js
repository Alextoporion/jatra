const PurchaseModel = require('../models/PurchaseModel'); // Adjust path as needed

/**
 * @description Add a new ingredient purchase or update stock for an existing one
 */
const itemPurchase = async (req, res) => {
    const userId = req.user?.id || req.user?._id;
    console.log('see user id', userId)

    if (!userId) {
        return res.status(403).json({ message: "Forbidden: No user token provided." });
    }

    const { name, unit, quantity, pricePerUnit, supplier } = req.body;
    const itemImage = req.file ? req.file.path : null;

    if (!name || !unit || !quantity || !pricePerUnit || !supplier) {
        return res.status(400).json({ message: "Please fill all required fields." });
    }

    try {
        // Check if ingredient already exists
        let ingredient = await PurchaseModel.findOne({ name: name });

        if (ingredient) {
            // ---------- UPDATE EXISTING INGREDIENT ----------

            // SAFETY FIX: Prevent undefined stock on old items
            ingredient.quantityInStock = (ingredient.quantityInStock || 0) + Number(quantity);

            // Update purchase quantity for the current purchase event
            ingredient.quantity = Number(quantity);

            // Update other fields
            ingredient.pricePerUnit = pricePerUnit;
            ingredient.supplier = supplier;
            ingredient.purchaseDate = Date.now();
            ingredient.itemImage = itemImage || ingredient.itemImage;

            // Last updated by user
            ingredient.createdBy = userId;

        } else {
            // ---------- CREATE NEW INGREDIENT ----------
            ingredient = new PurchaseModel({
                name,
                unit,
                quantity: Number(quantity),           // amount purchased now
                quantityInStock: Number(quantity),    // initial stock
                pricePerUnit,
                supplier,
                itemImage,
                createdBy: userId,
                purchaseDate: Date.now()
            });
        }

        const savedIngredient = await ingredient.save();

        res.status(201).json({
            message: "Purchase successful",
            data: savedIngredient
        });

    } catch (error) {
        console.error("Error in itemPurchase controller:", error);

        if (error.code === 11000) {
            return res.status(400).json({
                message: "An ingredient with this name already exists."
            });
        }

        res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * @description Get all purchased items
 */
const purchaseList = async (req, res) => {
    try {
        const purchases = await PurchaseModel.find()
            .populate('createdBy', 'username email')
            .sort({ quantityInStock: 1 }); // smallest stock first

        res.status(200).json({ data: purchases });

    } catch (error) {
        console.error("Error in purchaseList controller:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = {
    itemPurchase,
    purchaseList
};
