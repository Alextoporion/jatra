const PurchaseModel = require("../models/PurchaseModel");

const itemPurchase = async (req, res) => {
    try {
        // The user ID must be assigned to the variable *before* you can use it
        const createdBy = req.user.id; // Assuming user ID is available in req.user

        // These console logs are now in the correct order
        console.log("USER:", req.user);
        console.log("CREATED BY:", createdBy);

        const purchaseData = req.body;
        const itemImage = req.file ? req.file.path : null;

        // Create the new purchase object
        // We explicitly convert number fields, as 'multipart/form-data' sends them as strings
        const newPurchase = new PurchaseModel({
            ...purchaseData,
            quantity: Number(purchaseData.quantity), // Explicitly cast to Number
            pricePerUnit: Number(purchaseData.pricePerUnit), // Explicitly cast to Number
            itemImage,
            createdBy
        });

        // Save the new purchase to the database
        await newPurchase.save();

        // Send a success response
        res.status(201).json({ message: "Purchase recorded successfully", data: newPurchase });

    } catch (error) {
        // Log the actual error on the server for debugging
        console.error("Error in itemPurchase controller:", error);

        // Send a generic 500 error to the client
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = { itemPurchase };