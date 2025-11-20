const SalesModel = require('../models/SalesModel');
const FinishedProductModel = require('../models/FinishedProductModel');

const createSale = async (req, res) => {
    const userId = req.user?.id || req.user?._id;
    const { customerName, items, paymentMethod } = req.body;
    // items = [{ productId, quantity, pricePerUnit }, ...]

    if (!items || items.length === 0) {
        return res.status(400).json({ message: "No items in cart." });
    }

    try {
        let grandTotal = 0;
        const processedItems = [];

        // --- 1. Validate Stock & Prepare Data ---
        // We iterate through every item the customer wants to buy
        for (const item of items) {
            const product = await FinishedProductModel.findById(item.productId);

            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.productId}` });
            }

            if (product.currentStock < item.quantity) {
                return res.status(400).json({ 
                    message: `Not enough stock for ${product.name}. Available: ${product.currentStock}` 
                });
            }

            // Calculate totals
            const itemTotal = item.quantity * item.pricePerUnit;
            grandTotal += itemTotal;

            // Add to list for saving later
            processedItems.push({
                productId: product._id,
                name: product.name,
                quantity: Number(item.quantity),
                pricePerUnit: Number(item.pricePerUnit),
                totalPrice: itemTotal
            });

            // --- 2. DEDUCT STOCK FROM FRIDGE ---
            product.currentStock -= Number(item.quantity);
            await product.save();
        }

        // --- 3. Save the Sales Record ---
        const newSale = new SalesModel({
            soldBy: userId,
            customerName,
            items: processedItems,
            grandTotal,
            paymentMethod
        });

        const savedSale = await newSale.save();

        res.status(201).json({
            message: "Sale successful!",
            data: savedSale
        });

    } catch (error) {
        console.error("Error processing sale:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { createSale };