const ProductionModel = require('../models/ProductionModel');
const PurchaseModel = require('../models/PurchaseModel');
const FinishedProductModel = require('../models/FinishedProductModel'); // <--- IMPORT THIS

const addProduction = async (req, res) => {
    const userId = req.user?.id || req.user?._id;
    const { productName, producedQuantity, unit, ingredientsUsed, sellingPrice } = req.body;

    if (!productName || !ingredientsUsed || ingredientsUsed.length === 0) {
        return res.status(400).json({ message: "Please provide details." });
    }

    try {
        // --- 1. Deduct Ingredients from Stock ---
        await Promise.all(ingredientsUsed.map(async (item) => {
            const ingredient = await PurchaseModel.findById(item.ingredientId);
            if (ingredient) {
                const newStock = (ingredient.quantityInStock || 0) - Number(item.quantityUsed);
                ingredient.quantityInStock = newStock < 0 ? 0 : newStock;
                await ingredient.save();
            }
        }));

        // --- 2. Add to "Finished Product" Stock (The Fridge) ---
        // Check if this ice cream already exists in the fridge
        let finishedItem = await FinishedProductModel.findOne({ name: productName });

        if (finishedItem) {
            // If exists, just add the new quantity
            finishedItem.currentStock = (finishedItem.currentStock || 0) + Number(producedQuantity);
            finishedItem.lastProduced = Date.now();
            if(sellingPrice) finishedItem.price = Number(sellingPrice); // Update price if provided
            await finishedItem.save();
        } else {
            // If new, create it
            await FinishedProductModel.create({
                name: productName,
                currentStock: Number(producedQuantity),
                unit: unit,
                price: Number(sellingPrice) || 0
            });
        }

        // --- 3. Save the History Log ---
        const newProduction = new ProductionModel({
            productName,
            producedQuantity,
            unit,
            ingredientsUsed,
            createdBy: userId
        });
        const savedProduction = await newProduction.save();

        res.status(201).json({
            message: "Production successful! Fridge updated.",
            data: savedProduction
        });

    } catch (error) {
        console.error("Error in addProduction:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// --- NEW: Get the Finished Stock List ---
const getFinishedStock = async (req, res) => {
    try {
        const stock = await FinishedProductModel.find().sort({ currentStock: -1 });
        res.status(200).json({ data: stock });
    } catch (error) {
        res.status(500).json({ message: "Error fetching stock" });
    }
};

module.exports = { addProduction, getFinishedStock };