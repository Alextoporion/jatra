const SalesModel = require('../models/SalesModel');
const FinishedProductModel = require('../models/FinishedProductModel');

const createSale = async (req, res) => {
    const userId = req.user?.id || req.user?._id;
    const { customerName, items, paymentMethod } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ message: "No items in cart." });
    }

    try {
        let grandTotal = 0;
        let totalProfit = 0; // <--- We will track this
        const processedItems = [];

        for (const item of items) {
            const product = await FinishedProductModel.findById(item.productId);

            if (!product) return res.status(404).json({ message: `Product not found: ${item.productId}` });
            if (product.currentStock < item.quantity) {
                return res.status(400).json({ message: `Not enough stock for ${product.name}` });
            }

            // Financial Calculations
            const itemRevenue = item.quantity * item.pricePerUnit;
            
            // Profit = (Selling Price - Cost Price) * Quantity
            // If costPrice is missing (old items), assume 0 cost (100% profit) or handle carefully
            const productCost = product.costPrice || 0;
            const itemProfit = (item.pricePerUnit - productCost) * item.quantity;

            grandTotal += itemRevenue;
            totalProfit += itemProfit;

            processedItems.push({
                productId: product._id,
                name: product.name,
                quantity: Number(item.quantity),
                pricePerUnit: Number(item.pricePerUnit),
                totalPrice: itemRevenue
            });

            // Deduct Stock
            product.currentStock -= Number(item.quantity);
            await product.save();
        }

        const newSale = new SalesModel({
            soldBy: userId,
            customerName,
            items: processedItems,
            grandTotal,
            totalProfit, // <--- Saving the Profit
            paymentMethod
        });

        const savedSale = await newSale.save();
        res.status(201).json({ message: "Sale successful!", data: savedSale });

    } catch (error) {
        console.error("Error processing sale:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Keep getSalesHistory as is
const getSalesHistory = async (req, res) => {
    try {
        const sales = await SalesModel.find().populate('soldBy', 'username').sort({ createdAt: -1 });
        res.status(200).json({ data: sales });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { createSale, getSalesHistory };