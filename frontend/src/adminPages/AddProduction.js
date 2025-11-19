import React, { useState, useEffect } from 'react';
import UseAxiosSecure from '../hook/UseAxiosSecure';
import { motion } from 'framer-motion';

export default function AddProduction() {
    const axiosSecure = UseAxiosSecure();
    
    // 1. Store the list of available ingredients from DB
    const [inventory, setInventory] = useState([]);

    // 2. Form State
    const [productName, setProductName] = useState('');
    const [producedQuantity, setProducedQuantity] = useState('');
    const [unit, setUnit] = useState('Cups');
    
    // 3. Dynamic Ingredient List (The Recipe)
    // We start with one empty row
    const [recipeItems, setRecipeItems] = useState([
        { ingredientId: '', quantityUsed: '' } 
    ]);

    // --- Fetch Inventory on Load ---
    useEffect(() => {
        axiosSecure.get('/purchased-item')
            .then(res => setInventory(res.data.data))
            .catch(err => console.error(err));
    }, [axiosSecure]);

    // --- Helper: Add a new ingredient row ---
    const addRow = () => {
        setRecipeItems([...recipeItems, { ingredientId: '', quantityUsed: '' }]);
    };

    // --- Helper: Remove a row ---
    const removeRow = (index) => {
        const list = [...recipeItems];
        list.splice(index, 1);
        setRecipeItems(list);
    };

    // --- Helper: Handle Input Change for Ingredients ---
    const handleIngredientChange = (index, field, value) => {
        const list = [...recipeItems];
        list[index][field] = value;
        setRecipeItems(list);
    };

    // --- Submit to Backend ---
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Format data for backend
        const payload = {
            productName,
            producedQuantity,
            unit,
            ingredientsUsed: recipeItems
        };

        try {
            const res = await axiosSecure.post('/add-production', payload);
            if(res.status === 201){
                alert('Production Added & Stock Adjusted!');
                // Reset form
                setProductName('');
                setProducedQuantity('');
                setRecipeItems([{ ingredientId: '', quantityUsed: '' }]);
            }
        } catch (error) {
            console.error(error);
            alert('Something went wrong');
        }
    };

    return (
        <div className="max-w-lg mx-auto p-4 pb-20">
            <h1 className="text-3xl font-bold text-pink-600 mb-6 text-center">
                🥣 Make Ice Cream
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* --- SECTION 1: PRODUCT INFO --- */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-pink-100">
                    <label className="block text-sm font-bold text-gray-600 mb-2">Product Name</label>
                    <input 
                        type="text" 
                        placeholder="e.g. Mango Blast"
                        className="w-full p-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-pink-400 outline-none mb-4"
                        value={productName}
                        onChange={e => setProductName(e.target.value)}
                        required
                    />

                    <div className="flex gap-3">
                        <div className="w-2/3">
                            <label className="block text-sm font-bold text-gray-600 mb-2">Quantity Made</label>
                            <input 
                                type="number" 
                                placeholder="10"
                                className="w-full p-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-pink-400 outline-none"
                                value={producedQuantity}
                                onChange={e => setProducedQuantity(e.target.value)}
                                required
                            />
                        </div>
                        <div className="w-1/3">
                            <label className="block text-sm font-bold text-gray-600 mb-2">Unit</label>
                            <select 
                                className="w-full p-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-pink-400 outline-none"
                                value={unit}
                                onChange={e => setUnit(e.target.value)}
                            >
                                <option>Cups</option>
                                <option>Tubs</option>
                                <option>Liters</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* --- SECTION 2: INGREDIENTS USED --- */}
                <div className="flex justify-between items-center mt-6 mb-2">
                    <h3 className="font-bold text-gray-700">Recipe Ingredients</h3>
                    <button 
                        type="button"
                        onClick={addRow}
                        className="text-xs bg-pink-100 text-pink-600 px-3 py-1.5 rounded-full font-bold"
                    >
                        + Add Another
                    </button>
                </div>

                {/* Dynamic List of Ingredients */}
                {recipeItems.map((item, index) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={index} 
                        className="bg-white p-4 rounded-2xl shadow-md border-l-4 border-pink-500 relative"
                    >
                        {/* Remove Button (X) */}
                        {recipeItems.length > 1 && (
                            <button 
                                type="button"
                                onClick={() => removeRow(index)}
                                className="absolute top-2 right-2 text-gray-300 hover:text-red-500 font-bold p-2"
                            >
                                ✕
                            </button>
                        )}

                        <div className="grid grid-cols-1 gap-3">
                            {/* Select Ingredient */}
                            <div>
                                <label className="text-xs text-gray-400 font-semibold uppercase">Select Ingredient</label>
                                <select 
                                    className="w-full mt-1 p-2 bg-gray-50 rounded-lg outline-none border border-gray-200"
                                    value={item.ingredientId}
                                    onChange={(e) => handleIngredientChange(index, 'ingredientId', e.target.value)}
                                    required
                                >
                                    <option value="">-- Choose --</option>
                                    {inventory.map(inv => (
                                        <option key={inv._id} value={inv._id}>
                                            {inv.name} (Stock: {inv.quantityInStock} {inv.unit})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Quantity Used */}
                            <div>
                                <label className="text-xs text-gray-400 font-semibold uppercase">Quantity Used</label>
                                <input 
                                    type="number"
                                    placeholder="How much used?"
                                    className="w-full mt-1 p-2 bg-gray-50 rounded-lg outline-none border border-gray-200"
                                    value={item.quantityUsed}
                                    onChange={(e) => handleIngredientChange(index, 'quantityUsed', e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </motion.div>
                ))}

                {/* --- SUBMIT BUTTON --- */}
                <button 
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-pink-500/30 mt-6 active:scale-95 transition-transform"
                >
                    🚀 Produce Batch
                </button>

            </form>
        </div>
    );
}