import React, { useState, useEffect } from 'react';
import UseAxiosSecure from '../hook/UseAxiosSecure';
import { motion, AnimatePresence } from 'framer-motion';

export default function POS() {
    const axiosSecure = UseAxiosSecure();
    const [finishedProducts, setFinishedProducts] = useState([]); // All ice creams you have
    const [cart, setCart] = useState([]); // Items customer wants to buy
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [isProcessingSale, setIsProcessingSale] = useState(false);
    const [customerName, setCustomerName] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Cash');

    useEffect(() => {
        fetchFinishedProducts();
    }, [axiosSecure]);

    const fetchFinishedProducts = async () => {
        try {
            const res = await axiosSecure.get('/finished-stock');
            setFinishedProducts(res.data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingProducts(false);
        }
    };

    // --- CART LOGIC ---
    const addToCart = (product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.productId === product._id);
            if (existingItem) {
                // If item is already in cart, increment quantity
                if (existingItem.quantity + 1 > product.currentStock) {
                    alert(`Cannot add more. Only ${product.currentStock} ${product.unit} of ${product.name} left.`);
                    return prevCart;
                }
                return prevCart.map(item =>
                    item.productId === product._id
                        ? { ...item, quantity: item.quantity + 1, totalPrice: (item.quantity + 1) * item.pricePerUnit }
                        : item
                );
            } else {
                // Add new item to cart
                if (product.currentStock < 1) {
                    alert(`"${product.name}" is out of stock!`);
                    return prevCart;
                }
                return [
                    ...prevCart,
                    {
                        productId: product._id,
                        name: product.name,
                        pricePerUnit: product.price,
                        quantity: 1,
                        totalPrice: product.price,
                        unit: product.unit // To display in cart
                    }
                ];
            }
        });
    };

    const updateCartQuantity = (productId, newQuantity) => {
        setCart(prevCart => {
            const productInStock = finishedProducts.find(p => p._id === productId);
            if (!productInStock) return prevCart;

            const updatedCart = prevCart.map(item => {
                if (item.productId === productId) {
                    const quantity = Math.max(0, Number(newQuantity)); // No negative quantities
                    if (quantity > productInStock.currentStock) {
                        alert(`Cannot add more than ${productInStock.currentStock} for ${item.name}.`);
                        return { ...item, quantity: productInStock.currentStock, totalPrice: productInStock.currentStock * item.pricePerUnit };
                    }
                    return { ...item, quantity: quantity, totalPrice: quantity * item.pricePerUnit };
                }
                return item;
            }).filter(item => item.quantity > 0); // Remove if quantity becomes 0

            return updatedCart;
        });
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.productId !== productId));
    };

    const calculateGrandTotal = () => {
        return cart.reduce((total, item) => total + item.totalPrice, 0);
    };

    // --- SALE PROCESSING ---
    const handleProcessSale = async () => {
        if (cart.length === 0) {
            alert("Cart is empty!");
            return;
        }

        const grandTotal = calculateGrandTotal();

        // Prepare items for backend (only essential fields)
        const saleItems = cart.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            pricePerUnit: item.pricePerUnit
        }));

        const payload = {
            customerName: customerName || "Walk-in Customer",
            items: saleItems,
            grandTotal: grandTotal,
            paymentMethod: paymentMethod
        };

        setIsProcessingSale(true);
        try {
            const res = await axiosSecure.post('/create-sale', payload);
            if (res.status === 201) {
                alert("Sale completed successfully!");
                setCart([]); // Clear cart
                setCustomerName(''); // Clear customer name
                setPaymentMethod('Cash'); // Reset payment method
                fetchFinishedProducts(); // Refresh stock
            }
        } catch (error) {
            console.error("Sale error:", error);
            // Display specific error message from backend if available
            alert(error.response?.data?.message || "Failed to process sale.");
        } finally {
            setIsProcessingSale(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            {/* --- Left Section: Product Grid (Scrollable) --- */}
            <div className="flex-1 p-4 md:p-6 overflow-y-auto max-h-[60vh] md:max-h-screen">
                <h1 className="text-3xl font-extrabold text-blue-600 mb-6 text-center">
                    🛒 Point of Sale
                </h1>
                
                {loadingProducts ? (
                    <div className="text-center py-10">Loading Products...</div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-16"> {/* Added pb-16 for mobile */}
                        {finishedProducts.length > 0 ? finishedProducts.map(product => (
                            <motion.button
                                key={product._id}
                                onClick={() => addToCart(product)}
                                whileTap={{ scale: 0.95 }}
                                className={`bg-white rounded-xl shadow-md p-3 flex flex-col items-center justify-center text-center cursor-pointer 
                                            ${product.currentStock === 0 ? 'opacity-60 grayscale' : 'hover:shadow-lg active:scale-98 transition-all'}`}
                                disabled={product.currentStock === 0}
                            >
                                <div className="text-3xl mb-1">
                                    {product.name.includes('Mango') ? '🥭' :
                                     product.name.includes('Chocolate') ? '🍫' :
                                     product.name.includes('Vanilla') ? '🍦' :
                                     product.name.includes('Strawberry') ? '🍓' :
                                     '🍨'}
                                </div>
                                <h3 className="font-semibold text-gray-800 text-sm md:text-base">{product.name}</h3>
                                <p className="text-xs text-gray-500">₹{product.price}</p>
                                <p className={`text-xs font-bold ${product.currentStock < 5 ? 'text-red-500' : 'text-green-600'}`}>
                                    {product.currentStock} {product.unit}
                                </p>
                            </motion.button>
                        )) : (
                            <div className="col-span-full text-center text-gray-500 py-10">
                                No finished ice cream products available.
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* --- Right Section: Cart Summary & Checkout (Fixed at bottom on mobile) --- */}
            <div className="fixed bottom-0 left-0 w-full md:relative md:w-96 md:max-w-md bg-white border-t-4 border-blue-500 md:border-t-0 md:border-l-4 shadow-2xl p-4 md:p-6 flex flex-col z-10 md:min-h-screen">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Order</h2>
                
                <AnimatePresence>
                    <div className="flex-1 overflow-y-auto max-h-[30vh] md:max-h-[unset] mb-4 space-y-3">
                        {cart.length === 0 ? (
                            <motion.p 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="text-gray-500 text-center py-8"
                            >
                                Cart is empty. Add some ice cream!
                            </motion.p>
                        ) : (
                            cart.map(item => (
                                <motion.div 
                                    key={item.productId}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="flex items-center justify-between bg-blue-50 p-3 rounded-lg shadow-sm"
                                >
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-800">{item.name}</p>
                                        <p className="text-xs text-gray-600">tk.{item.pricePerUnit} / {item.unit}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button 
                                            onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                                            className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-lg font-bold"
                                        >-</button>
                                        <input 
                                            type="number" 
                                            value={item.quantity} 
                                            onChange={(e) => updateCartQuantity(item.productId, e.target.value)}
                                            className="w-12 text-center border-b border-blue-300 bg-transparent text-gray-800 font-medium" 
                                        />
                                        <button 
                                            onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                                            className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-lg font-bold"
                                        >+</button>
                                    </div>
                                    <div className="ml-4 text-right">
                                        <p className="font-bold text-gray-900">tk.{item.totalPrice.toFixed(2)}</p>
                                    </div>
                                    <button 
                                        onClick={() => removeFromCart(item.productId)}
                                        className="ml-2 text-red-500 hover:text-red-700"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </motion.div>
                            ))
                        )}
                    </div>
                </AnimatePresence>

                <div className="border-t border-gray-200 pt-4 mt-auto">
                    <div className="flex justify-between items-center text-lg font-bold text-gray-900 mb-3">
                        <span>Grand Total:</span>
                        <span>tk.{calculateGrandTotal().toFixed(2)}</span>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name (Optional)</label>
                        <input 
                            type="text" 
                            value={customerName} 
                            onChange={e => setCustomerName(e.target.value)}
                            placeholder="e.g. John Doe"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-400 outline-none"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                        <select 
                            value={paymentMethod} 
                            onChange={e => setPaymentMethod(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-400 outline-none"
                        >
                            <option value="Cash">Cash</option>
                            <option value="Card">Card</option>
                            <option value="Online">Online Payment</option>
                        </select>
                    </div>

                    <motion.button
                        onClick={handleProcessSale}
                        disabled={cart.length === 0 || isProcessingSale}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 bg-blue-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-500/30
                                   hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isProcessingSale ? (
                             <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            'Complete Sale'
                        )}
                       
                    </motion.button>
                </div>
            </div>
        </div>
    );
}