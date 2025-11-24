import React, { useEffect, useState } from 'react';
import UseAxiosSecure from '../hook/UseAxiosSecure';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, Tooltip, ResponsiveContainer, CartesianGrid, YAxis } from 'recharts';
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

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900 text-white p-2 rounded border border-white/10 text-[10px] shadow-xl z-50">
                    <p className="font-bold text-gray-400 mb-1">{label}</p>
                    {payload.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: entry.color}}></div>
                             <span className="font-bold">{entry.value}</span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-[#0B1120]">
             <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        // MAIN CONTAINER: Strict width control
        <div className="w-full max-w-[100vw] bg-[#0B1120] min-h-screen text-white font-sans overflow-x-hidden pb-24 px-4 pt-4">
            
            {/* 1. HEADER */}
            <div className="mb-6">
                 <h1 className="text-xl font-black tracking-tight text-white">
                    Dashboard<span className="text-pink-500">.</span>
                 </h1>
                 <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">
                    Live Stats
                 </p>
            </div>

            <div className="flex flex-col gap-4 w-full">

                {/* 2. REVENUE CARD (Full Width) */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="w-full bg-gradient-to-r from-pink-600 to-purple-700 rounded-2xl p-5 shadow-lg relative overflow-hidden"
                >
                    <div className="relative z-10">
                        <p className="text-pink-200 text-[10px] font-bold uppercase tracking-widest mb-1">Total Revenue</p>
                        <h2 className="text-3xl font-black text-white">
                            <span className="text-sm opacity-70 font-normal align-top mr-1">tk.</span>
                            {data?.stats?.revenue?.toLocaleString()}
                        </h2>
                    </div>
                    {/* Circle decoration */}
                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/20 blur-2xl rounded-full"></div>
                </motion.div>

                {/* 3. SMALL STATS (2 Columns) */}
                <div className="grid grid-cols-2 gap-3 w-full">
                    {/* Profit */}
                    <div className="bg-[#1E293B] border border-white/5 p-4 rounded-2xl flex flex-col justify-between h-28">
                        <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 text-lg mb-1">💰</div>
                        <div>
                            <p className="text-gray-400 text-[9px] font-bold uppercase">Net Profit</p>
                            <h3 className="text-lg font-bold text-white">
                                {data?.stats?.profit?.toLocaleString()}
                            </h3>
                        </div>
                    </div>
                    {/* Orders */}
                    <div className="bg-[#1E293B] border border-white/5 p-4 rounded-2xl flex flex-col justify-between h-28">
                        <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400 text-lg mb-1">📦</div>
                        <div>
                            <p className="text-gray-400 text-[9px] font-bold uppercase">Orders</p>
                            <h3 className="text-lg font-bold text-white">
                                {data?.stats?.orders}
                            </h3>
                        </div>
                    </div>
                </div>

                {/* 4. ECG CHART (Full Width) */}
                <div className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-pulse"></span>
                        <h3 className="text-pink-500 font-bold text-[10px] uppercase tracking-widest">Sales Pulse</h3>
                    </div>
                    <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data?.chartData}>
                                <CartesianGrid vertical={false} stroke="#334155" strokeDasharray="1 1" opacity={0.2} />
                                <XAxis dataKey="date" hide={true} /> 
                                <YAxis hide={true} domain={['auto', 'auto']} />
                                <Tooltip content={<CustomTooltip />} cursor={{stroke: 'rgba(255,255,255,0.1)'}} />
                                {data?.allFlavors && data.allFlavors.map((flavor, index) => (
                                    <Line 
                                        key={flavor} 
                                        type="linear" 
                                        dataKey={flavor} 
                                        stroke={colors[index % colors.length]} 
                                        strokeWidth={2} 
                                        dot={false} 
                                        isAnimationActive={true} 
                                    />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 5. TOP PRODUCTS (Bar Chart) */}
                <div className="w-full bg-[#1E293B] border border-white/5 rounded-2xl p-4">
                    <h3 className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2">Top 5 Products</h3>
                    <div className="h-40 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data?.topProducts}>
                                {/* Hide X Axis text to save space on mobile, rely on tooltip */}
                                <XAxis dataKey="_id" hide={true} /> 
                                <Tooltip cursor={{fill: 'transparent'}} content={<CustomTooltip />} />
                                <Bar dataKey="quantity" radius={[4, 4, 4, 4]}>
                                    {data?.topProducts?.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                     {/* Custom Legend Below Bar Chart */}
                     <div className="flex flex-wrap gap-2 mt-2">
                        {data?.topProducts?.map((entry, index) => (
                            <div key={index} className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full" style={{backgroundColor: colors[index % colors.length]}}></div>
                                <span className="text-[9px] text-gray-400 truncate max-w-[80px]">{entry._id}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 6. PAYMENT PIE CHART */}
                <div className="w-full bg-[#1E293B] border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                     <div className="h-28 w-28 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={data?.paymentStats} cx="50%" cy="50%" innerRadius={25} outerRadius={45} paddingAngle={5} dataKey="value">
                                    {data?.paymentStats?.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="text-[9px] font-bold text-gray-500">PAY</span>
                        </div>
                    </div>
                    
                    {/* Right Side Legend */}
                    <div className="flex-1 pl-4">
                        <h3 className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2">Methods</h3>
                        <div className="flex flex-col gap-2">
                            {data?.paymentStats?.map((entry, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{backgroundColor: pieColors[index % pieColors.length]}}></div>
                                        <span className="text-[10px] font-bold text-white">{entry._id}</span>
                                    </div>
                                    <span className="text-[10px] text-gray-500 font-mono">{entry.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 7. LOW STOCK SCROLLER */}
                {data?.lowStockItems?.length > 0 && (
                    <div className="w-full mt-2">
                        <div className="flex items-center gap-2 mb-2 px-1">
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                            <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest">Low Stock</p>
                        </div>
                        <div className="flex gap-3 overflow-x-auto pb-2" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
                            {data.lowStockItems.map(item => (
                                <div key={item._id} className="min-w-[130px] bg-red-900/10 border border-red-500/20 p-3 rounded-xl flex-shrink-0">
                                    <p className="text-[10px] font-bold text-white truncate">{item.name}</p>
                                    <p className="text-[10px] font-bold text-red-400 mt-0.5">{item.currentStock} left</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}