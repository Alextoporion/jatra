import React, { useState, useEffect } from 'react';
import UseAxiosSecure from '../hook/UseAxiosSecure';
import { motion } from 'framer-motion';

export default function AddProduction() {
    const axiosSecure = UseAxiosSecure();
    
    const [inventory, setInventory] = useState([]);

    // Form State
    const [productName, setProductName] = useState('');
    const [producedQuantity, setProducedQuantity] = useState('');
    const [unit, setUnit] = useState('Cups');
    
    // --- NEW: Selling Price State ---
    const [sellingPrice, setSellingPrice] = useState(''); 
    
    // Dynamic Ingredient List
    const [recipeItems, setRecipeItems] = useState([
        { ingredientId: '', quantityUsed: '' } 
    ]);

    useEffect(() => {
        axiosSecure.get('/purchased-item')
            .then(res => setInventory(res.data.data))
            .catch(err => console.error(err));
    }, [axiosSecure]);

    const addRow = () => {
        setRecipeItems([...recipeItems, { ingredientId: '', quantityUsed: '' }]);
    };

    const removeRow = (index) => {
        const list = [...recipeItems];
        list.splice(index, 1);
        setRecipeItems(list);
    };

    const handleIngredientChange = (index, field, value) => {
        const list = [...recipeItems];
        list[index][field] = value;
        setRecipeItems(list);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            productName,
            producedQuantity,
            unit,
            sellingPrice, // --- NEW: Send price to backend ---
            ingredientsUsed: recipeItems
        };

        try {
            const res = await axiosSecure.post('/add-production', payload);
            if(res.status === 201){
                alert('Production Added & Price Updated!');
                // Reset form
                setProductName('');
                setProducedQuantity('');
                setSellingPrice(''); // Reset price
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

                    <div className="flex gap-3 mb-4">
                        <div className="w-1/2">
                            <label className="block text-sm font-bold text-gray-600 mb-2">Qty Made</label>
                            <input 
                                type="number" 
                                placeholder="10"
                                className="w-full p-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-pink-400 outline-none"
                                value={producedQuantity}
                                onChange={e => setProducedQuantity(e.target.value)}
                                required
                            />
                        </div>
                        <div className="w-1/2">
                            <label className="block text-sm font-bold text-gray-600 mb-2">Unit</label>
                            <select 
                                className="w-full p-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-pink-400 outline-none"
                                value={unit}
                                onChange={e => setUnit(e.target.value)}
                            >
                                <option>Cups</option>
                                <option>Tubs</option>
                                <option>Liters</option>
                                <option>Cones</option>
                            </select>
                        </div>
                    </div>

                    {/* --- NEW: SELLING PRICE FIELD --- */}
                    <div>
                        <label className="block text-sm font-bold text-green-600 mb-2">Selling Price (Per Unit)</label>
                        <input 
                            type="number" 
                            placeholder="e.g. 150"
                            className="w-full p-3 rounded-xl bg-green-50 border border-green-100 focus:ring-2 focus:ring-green-400 outline-none text-green-800 font-bold"
                            value={sellingPrice}
                            onChange={e => setSellingPrice(e.target.value)}
                            required
                        />
                        <p className="text-xs text-gray-400 mt-1">This will update the price in the POS system.</p>
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
                        + Add Ingredient
                    </button>
                </div>

                {recipeItems.map((item, index) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={index} 
                        className="bg-white p-4 rounded-2xl shadow-md border-l-4 border-pink-500 relative"
                    >
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

                            <div>
                                <label className="text-xs text-gray-400 font-semibold uppercase">Quantity Used</label>
                                <input 
                                    type="number"
                                    placeholder="Qty"
                                    className="w-full mt-1 p-2 bg-gray-50 rounded-lg outline-none border border-gray-200"
                                    value={item.quantityUsed}
                                    onChange={(e) => handleIngredientChange(index, 'quantityUsed', e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </motion.div>
                ))}

                <button 
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-pink-500/30 mt-6 active:scale-95 transition-transform"
                >
                    🚀 Produce & Update Price
                </button>

            </form>
        </div>
    );
}