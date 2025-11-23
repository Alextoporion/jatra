const SalesModel = require('../models/SalesModel');
const FinishedProductModel = require('../models/FinishedProductModel');

const getDashboardStats = async (req, res) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // 1. OVERALL STATS
        const totalSales = await SalesModel.aggregate([
            { $group: { _id: null, totalRevenue: { $sum: "$grandTotal" }, totalProfit: { $sum: "$totalProfit" }, count: { $sum: 1 } } }
        ]);
        const stats = totalSales.length > 0 ? totalSales[0] : { totalRevenue: 0, totalProfit: 0, count: 0 };

        // 2. LINE CHART (Daily Sales ECG)
        const rawChartData = await SalesModel.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            { $unwind: "$items" },
            {
                $group: {
                    _id: { date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, item: "$items.name" },
                    totalQty: { $sum: "$items.quantity" }
                }
            },
            { $sort: { "_id.date": 1 } }
        ]);

        const formattedChartData = [];
        const itemNames = new Set(); 
        rawChartData.forEach(entry => {
            const date = entry._id.date;
            const name = entry._id.item;
            itemNames.add(name);
            let dayEntry = formattedChartData.find(d => d.date === date);
            if (!dayEntry) { dayEntry = { date }; formattedChartData.push(dayEntry); }
            dayEntry[name] = entry.totalQty;
        });

        // 3. BAR CHART DATA (Top 5 Products by Quantity)
        const topProducts = await SalesModel.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            { $unwind: "$items" },
            { $group: { _id: "$items.name", quantity: { $sum: "$items.quantity" } } },
            { $sort: { quantity: -1 } },
            { $limit: 5 }
        ]);

        // 4. PIE CHART DATA (Payment Methods: Cash vs Card)
        const paymentStats = await SalesModel.aggregate([
            { $group: { _id: "$paymentMethod", value: { $sum: 1 } } }
        ]);

        // 5. LOW STOCK
        const lowStockItems = await FinishedProductModel.find({ currentStock: { $lt: 10 } }).select('name currentStock unit').limit(5);

        res.status(200).json({
            stats: { revenue: stats.totalRevenue, profit: stats.totalProfit, orders: stats.count },
            chartData: formattedChartData,
            allFlavors: Array.from(itemNames),
            topProducts, // For Bar Chart
            paymentStats, // For Pie Chart
            lowStockItems
        });

    } catch (error) {
        console.error("Dashboard Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { getDashboardStats };