const ProductionModel = require('../models/ProductionModel');
const PurchaseModel = require('../models/PurchaseModel');
const FinishedProductModel = require('../models/FinishedProductModel');

const addProduction = async (req, res) => {
    const userId = req.user?.id || req.user?._id;
    const { productName, producedQuantity, unit, ingredientsUsed, sellingPrice } = req.body;

    if (!productName || !ingredientsUsed || ingredientsUsed.length === 0) {
        return res.status(400).json({ message: "Please provide details." });
    }

    try {
        let totalBatchCost = 0; // Track cost of all ingredients used

        // --- 1. Deduct Ingredients & Calculate Cost ---
        await Promise.all(ingredientsUsed.map(async (item) => {
            const ingredient = await PurchaseModel.findById(item.ingredientId);
            if (ingredient) {
                // Deduct Stock
                const newStock = (ingredient.quantityInStock || 0) - Number(item.quantityUsed);
                ingredient.quantityInStock = newStock < 0 ? 0 : newStock;
                await ingredient.save();

                // CALCULATE COST: Price of Ingredient * Amount Used
                // Example: Milk (50rs) * 2 Liters = 100rs cost
                const ingredientCost = (ingredient.pricePerUnit || 0) * Number(item.quantityUsed);
                totalBatchCost += ingredientCost;
            }
        }));

        // Calculate Cost Per Unit (e.g., Batch Cost 100 / 10 Cups = 10rs per cup)
        const costPerUnit = totalBatchCost / Number(producedQuantity);


        // --- 2. Add to "Finished Product" (Fridge) ---
        let finishedItem = await FinishedProductModel.findOne({ name: productName });

        if (finishedItem) {
            // LOGIC: Weighted Average Cost (Optional but accurate) 
            // Or simple update. We will use simple update for "Easiest Way" as requested.
            // We update the cost to the latest batch cost.
            finishedItem.currentStock = (finishedItem.currentStock || 0) + Number(producedQuantity);
            finishedItem.costPrice = costPerUnit; // <--- Update Cost Price
            if(sellingPrice) finishedItem.price = Number(sellingPrice);
            finishedItem.lastProduced = Date.now();
            await finishedItem.save();
        } else {
            await FinishedProductModel.create({
                name: productName,
                currentStock: Number(producedQuantity),
                unit: unit,
                price: Number(sellingPrice) || 0,
                costPrice: costPerUnit // <--- Save Cost Price
            });
        }

        // --- 3. Save History ---
        const newProduction = new ProductionModel({
            productName,
            producedQuantity,
            unit,
            ingredientsUsed,
            createdBy: userId
        });
        await newProduction.save();

        res.status(201).json({ message: "Production added & Cost calculated!" });

    } catch (error) {
        console.error("Error in addProduction:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Keep your getFinishedStock function as is
const getFinishedStock = async (req, res) => {
    try {
        const stock = await FinishedProductModel.find().sort({ currentStock: -1 });
        res.status(200).json({ data: stock });
    } catch (error) {
        res.status(500).json({ message: "Error fetching stock" });
    }
};

module.exports = { addProduction, getFinishedStock };