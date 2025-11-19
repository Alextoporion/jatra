import React, { useEffect, useState } from 'react';
import UseAxiosSecure from '../hook/UseAxiosSecure';
import { motion } from 'framer-motion';

export default function FinishedStock() {
    const axiosSecure = UseAxiosSecure();
    const [stock, setStock] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStock();
    }, [axiosSecure]);

    const fetchStock = async () => {
        try {
            const res = await axiosSecure.get('/finished-stock');
            setStock(res.data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-4">
            <h1 className="text-3xl font-bold text-center mb-8 text-purple-600">
                🍦 Ice Cream Freezer
            </h1>

            {loading ? (
                <div className="text-center">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {stock.map((item, index) => (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            key={item._id} 
                            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-purple-100 relative"
                        >
                            {/* Status Badge */}
                            <div className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-bold ${
                                item.currentStock < 5 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                            }`}>
                                {item.currentStock < 5 ? 'LOW STOCK' : 'AVAILABLE'}
                            </div>

                            <div className="p-6">
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl mb-4">
                                    🍧
                                </div>
                                <h2 className="text-xl font-bold text-gray-800">{item.name}</h2>
                                <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold mt-1">
                                    Selling Price: ₹{item.price || 0}
                                </p>

                                <div className="mt-6 flex items-end justify-between border-t pt-4">
                                    <div>
                                        <p className="text-xs text-gray-400">In Stock</p>
                                        <p className="text-3xl font-extrabold text-purple-600">
                                            {item.currentStock}
                                            <span className="text-base font-medium text-gray-400 ml-1">{item.unit}</span>
                                        </p>
                                    </div>
                                    {/* Optional: Add a Sell Button later */}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    
                    {stock.length === 0 && (
                        <div className="col-span-full text-center py-10 text-gray-500">
                            No ice cream produced yet. Go to production!
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}