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

const deletePurchase = async (req, res) => {
    try{
        const { id } = req.params;
        const userId = req.user?.id || req.user?._id;

        if (!userId) {
            return res.status(403).json({ message: "Forbidden: No user token provided." });
        }
        const deletedPurchase = await PurchaseModel.findByIdAndDelete(id);
        if(!deletedPurchase){
            return res.status(404).json({ message: "Purchase item not found." });
        }
        res.status(200).json({ message: "Purchase item deleted successfully.", data: deletedPurchase });
    }catch(error){
        console.error("Error in deletePurchase controller:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const updatePurchase = async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
        return res.status(403).json({ message: "Forbidden" });
    }

    try {
        const item = await PurchaseModel.findById(id);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        // 1. Extract data. 
        // IMPORTANT: In Frontend we used formData.append("quantityInStock", ...) 
        // so we MUST extract 'quantityInStock' here.
        const { name, unit, quantityInStock, pricePerUnit, supplier } = req.body;

        console.log("Received for update:", req.body); // <--- DEBUGGING LOG

        // 2. Update fields
        if (name) item.name = name;
        if (unit) item.unit = unit;
        if (supplier) item.supplier = supplier;

        // 3. Handle Numbers (Convert String to Number)
        // We check if it is NOT undefined, because 0 is a valid stock.
        if (quantityInStock !== undefined && quantityInStock !== "undefined") {
             item.quantityInStock = Number(quantityInStock);
        }
        
        if (pricePerUnit !== undefined && pricePerUnit !== "undefined") {
             item.pricePerUnit = Number(pricePerUnit);
        }

        // 4. Handle Image
        if (req.file) {
            item.itemImage = req.file.path;
        }

        const updatedItem = await item.save();

        res.status(200).json({
            message: "Item updated successfully",
            data: updatedItem
        });

    } catch (error) {
        console.error("Error updating purchase:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


module.exports = {
    itemPurchase,
    purchaseList,
    deletePurchase,
    updatePurchase
};
