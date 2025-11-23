import React, { useEffect, useState } from 'react';
import UseAxiosSecure from '../hook/UseAxiosSecure';
// Removed MainLayout import since you have your own
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, Tooltip, ResponsiveContainer, CartesianGrid, YAxis, Legend } from 'recharts';
import { motion } from 'framer-motion';

export default function Dashboard() {
    const axiosSecure = UseAxiosSecure();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const colors = ["#ec4899", "#8b5cf6", "#22c55e", "#f59e0b", "#3b82f6"];
    const pieColors = ["#10B981", "#6366F1", "#F59E0B", "#EF4444"];

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await axiosSecure.get('/dashboard-stats');
                setData(res.data);
            } catch (error) {
                console.error("Failed to load dashboard", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, [axiosSecure]);

    // Tooltip for Charts
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-xl border border-white/10 text-xs shadow-2xl">
                    <p className="mb-2 font-bold text-gray-400 uppercase">{label || payload[0].name}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }} className="font-bold text-sm">
                            {entry.name}: {entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#0B1120]">
             <div className="w-12 h-12 border-t-4 border-pink-500 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0B1120] p-6 text-white font-sans selection:bg-pink-500 selection:text-white pb-24">
            
            {/* Header Section */}
            <div className="mb-8 flex justify-between items-end">
                 <div>
                    <h1 className="text-3xl font-black tracking-tight">
                        Overview<span className="text-pink-500">.</span>
                    </h1>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mt-2">
                        Stats & Performance
                    </p>
                 </div>
            </div>

            <div className="space-y-6 max-w-7xl mx-auto">

                {/* --- 1. KEY METRICS (Top Row) --- */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="col-span-2 bg-gradient-to-r from-pink-900/40 to-purple-900/40 border border-white/10 p-6 rounded-[2rem]">
                        <p className="text-pink-300 text-[10px] font-bold uppercase tracking-widest">Total Revenue</p>
                        <h2 className="text-4xl font-black text-white mt-1">tk.{data?.stats?.revenue?.toLocaleString()}</h2>
                    </motion.div>

                    <div className="bg-[#1E293B]/60 border border-white/5 p-5 rounded-[2rem]">
                        <p className="text-gray-400 text-[9px] font-bold uppercase">Net Profit</p>
                        <h3 className="text-2xl font-bold text-green-400 mt-1">tk.{data?.stats?.profit?.toLocaleString()}</h3>
                    </div>

                    <div className="bg-[#1E293B]/60 border border-white/5 p-5 rounded-[2rem]">
                        <p className="text-gray-400 text-[9px] font-bold uppercase">Orders</p>
                        <h3 className="text-2xl font-bold text-orange-400 mt-1">{data?.stats?.orders}</h3>
                    </div>
                </div>

                {/* --- 2. ECG LINE CHART (Main Trend) --- */}
                <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 shadow-2xl relative">
                    <h3 className="text-pink-500 font-bold text-xs tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span> Sales Pulse (ECG)
                    </h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data?.chartData}>
                                <CartesianGrid vertical={true} stroke="#334155" strokeDasharray="1 1" opacity={0.2} />
                                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} tickFormatter={(str) => str.slice(8)} dy={10} />
                                <YAxis tick={false} axisLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                {data?.allFlavors && data.allFlavors.map((flavor, index) => (
                                    <Line key={flavor} type="linear" dataKey={flavor} stroke={colors[index % colors.length]} strokeWidth={2} dot={{ r: 0 }} activeDot={{ r: 6 }} isAnimationActive={true} />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* --- 3. BAR CHART & PIE CHART (Side by Side) --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* BAR CHART: Top Products */}
                    <div className="bg-[#1E293B]/60 border border-white/5 rounded-[2rem] p-6">
                        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Top 5 Products</h3>
                        <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data?.topProducts}>
                                    <XAxis dataKey="_id" tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                                    <Tooltip cursor={{fill: 'transparent'}} content={<CustomTooltip />} />
                                    <Bar dataKey="quantity" radius={[4, 4, 0, 0]}>
                                        {data?.topProducts?.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* PIE CHART: Payment Methods */}
                    <div className="bg-[#1E293B]/60 border border-white/5 rounded-[2rem] p-6 flex flex-col items-center justify-center">
                        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4 self-start">Payment Mix</h3>
                        <div className="h-48 w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie 
                                        data={data?.paymentStats} 
                                        cx="50%" cy="50%" 
                                        innerRadius={40} 
                                        outerRadius={70} 
                                        paddingAngle={5} 
                                        dataKey="value"
                                    >
                                        {data?.paymentStats?.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Center Text */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <span className="text-xs font-bold text-gray-500">MIX</span>
                            </div>
                        </div>
                        {/* Legend */}
                        <div className="flex gap-4 mt-2 justify-center">
                             {data?.paymentStats?.map((entry, index) => (
                                 <div key={index} className="flex items-center gap-1">
                                     <div className="w-2 h-2 rounded-full" style={{backgroundColor: pieColors[index % pieColors.length]}}></div>
                                     <span className="text-[10px] text-gray-400 font-bold">{entry._id}</span>
                                 </div>
                             ))}
                        </div>
                    </div>

                </div>

                {/* --- 4. LOW STOCK ALERT --- */}
                {data?.lowStockItems?.length > 0 && (
                    <div className="bg-red-900/10 border border-red-500/20 rounded-[2rem] p-5 flex items-center gap-4 overflow-x-auto hide-scrollbar">
                        <div className="shrink-0 flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-red-400 text-[10px] font-bold uppercase tracking-widest">Low Stock</span>
                        </div>
                        {data.lowStockItems.map(item => (
                            <span key={item._id} className="bg-red-500/10 text-red-200 px-3 py-1 rounded-lg text-xs font-bold border border-red-500/20 whitespace-nowrap">
                                {item.name}: {item.currentStock}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}