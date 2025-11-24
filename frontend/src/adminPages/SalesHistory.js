import React, { useEffect, useState } from 'react';
import UseAxiosSecure from '../hook/UseAxiosSecure';
import { motion } from 'framer-motion';

export default function SalesHistory() {
    const axiosSecure = UseAxiosSecure();
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Summary States
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [todaysRevenue, setTodaysRevenue] = useState(0);
    const [totalProfit, setTotalProfit] = useState(0);

    useEffect(() => {
        fetchSales();
    }, [axiosSecure]);

    const fetchSales = async () => {
        try {
            const res = await axiosSecure.get('/sales-history');
            const data = res.data.data || [];
            setSales(data);
            calculateSummaries(data);
        } catch (err) {
            console.error("Failed to fetch sales", err);
        } finally {
            setLoading(false);
        }
    };

    const calculateSummaries = (data) => {
        // 1. Total Revenue
        const revenue = data.reduce((acc, curr) => acc + (curr.grandTotal || 0), 0);
        setTotalRevenue(revenue);

        // 2. Total Profit (Handle undefined profit for old sales)
        const profit = data.reduce((acc, curr) => acc + (curr.totalProfit || 0), 0);
        setTotalProfit(profit);

        // 3. Today's Sales
        const todayStr = new Date().toDateString();
        const todayTotal = data.reduce((acc, curr) => {
            const saleDate = new Date(curr.createdAt).toDateString();
            return saleDate === todayStr ? acc + (curr.grandTotal || 0) : acc;
        }, 0);

        setTodaysRevenue(todayTotal);
    };

    // Helper: Time format (e.g., "2:30 PM")
    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: 'numeric', minute: '2-digit'
        });
    };

    // Helper: Date format (e.g., "Nov 24")
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
            
            {/* --- MOBILE HEADER & SUMMARY (App Like) --- */}
            <div className="bg-blue-600 text-white p-6 pt-8 rounded-b-[2.5rem] shadow-xl md:rounded-none md:bg-transparent md:text-gray-800 md:shadow-none md:pt-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-xl md:text-3xl font-bold mb-6 flex items-center gap-2">
                        <span className="md:hidden">📈</span> Sales Report
                        
                    </h1>

                    {/* Summary Cards Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
                        
                        {/* Total Revenue Card */}
                        <div className="col-span-2 md:col-span-1 bg-white/10 backdrop-blur-md md:bg-white md:border-l-4 md:border-blue-500 p-4 rounded-2xl md:shadow-sm border border-white/20 md:border-gray-100">
                            <p className="text-blue-100 md:text-gray-500 text-xs font-medium uppercase">Total Revenue</p>
                            <h2 className="text-3xl font-bold mt-1 md:text-blue-600">tk.{totalRevenue.toLocaleString()}</h2>
                        </div>

                        {/* Today's Sales Card */}
                        <div className="bg-white/10 backdrop-blur-md md:bg-white md:border-l-4 md:border-emerald-500 p-4 rounded-2xl md:shadow-sm border border-white/20 md:border-gray-100">
                            <p className="text-emerald-100 md:text-gray-500 text-xs font-medium uppercase">Today</p>
                            <h2 className="text-xl md:text-3xl font-bold mt-1 md:text-emerald-600">tk.{todaysRevenue.toLocaleString()}</h2>
                        </div>

                        {/* Profit Card */}
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 md:from-violet-600 md:to-purple-700 p-4 rounded-2xl shadow-lg text-white relative overflow-hidden">
                            <p className="text-indigo-100 text-xs font-medium uppercase">Net Profit</p>
                            <h2 className="text-xl md:text-3xl font-bold mt-1">tk.{totalProfit.toLocaleString()}</h2>
                            <div className="absolute -right-2 -bottom-2 text-white/20 text-5xl rotate-12">🚀</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- TRANSACTIONS LIST --- */}
            <div className="max-w-4xl mx-auto px-4 mt-6 md:mt-8">
                <h3 className="text-lg font-bold text-gray-700 mb-4 px-1">Recent Transactions</h3>

                {loading ? (
                    <div className="flex flex-col gap-3">
                        {[1,2,3].map(i => <div key={i} className="h-20 bg-gray-200 rounded-xl animate-pulse"></div>)}
                    </div>
                ) : sales.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 bg-white rounded-2xl shadow-sm">
                        <p>No sales yet</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {sales.map((sale, index) => (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                key={sale._id} 
                                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between active:scale-[0.98] transition-transform"
                            >
                                {/* Left: Icon & Date */}
                                <div className="flex items-center gap-3 md:gap-4">
                                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-lg md:text-xl font-bold shrink-0
                                        tk.{sale.paymentMethod === 'Cash' ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'}`}>
                                        {sale.paymentMethod === 'Cash' ? '💵' : '💳'}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-sm md:text-base">
                                            {sale.customerName === "Walk-in Customer" ? "Walk-in Sale" : sale.customerName}
                                        </h4>
                                        <p className="text-xs text-gray-400">
                                            {formatDate(sale.createdAt)} • {formatTime(sale.createdAt)}
                                        </p>
                                        {/* Mobile Item Count */}
                                        <p className="text-[10px] text-gray-500 mt-0.5 md:hidden">
                                            {sale.items.length} Items Sold
                                        </p>
                                    </div>
                                </div>

                                {/* Right: Money & Profit */}
                                <div className="text-right">
                                    <p className="text-base md:text-lg font-bold text-gray-800">
                                        +tk.{sale.grandTotal}
                                    </p>
                                    {sale.totalProfit > 0 ? (
                                        <p className="text-[10px] md:text-xs font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded inline-block mt-1">
                                            Profit: ₹{sale.totalProfit.toFixed(0)}
                                        </p>
                                    ) : (
                                        <p className="text-[10px] text-gray-300 mt-1">Old Data</p>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}