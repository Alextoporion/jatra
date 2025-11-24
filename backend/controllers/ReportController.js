const SalesModel = require('../models/SalesModel');
const { sendEmail } = require('../services/EmailService');


const submitDailyReport = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id; // The employee submitting it

        // 1. Get Today's Date Range (Start of day to End of day)
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        // 2. Fetch Sales for Today
        const todaysSales = await SalesModel.find({
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        });

        if (todaysSales.length === 0) {
            return res.status(400).json({ message: "No sales found for today to report." });
        }

        // 3. Calculate Totals
        let totalRevenue = 0;
        let totalProfit = 0;
        let cashCollected = 0;
        let onlineCollected = 0;
        let totalItemsSold = 0;

        todaysSales.forEach(sale => {
            totalRevenue += sale.grandTotal;
            totalProfit += (sale.totalProfit || 0); // Handle old data
            
            // Count items
            sale.items.forEach(item => totalItemsSold += item.quantity);

            // Payment Split
            if (sale.paymentMethod === 'Cash') {
                cashCollected += sale.grandTotal;
            } else {
                onlineCollected += sale.grandTotal;
            }
        });

        // 4. Create the HTML Email Content
        const dateString = new Date().toDateString();
        
        const emailHtml = `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #ec4899;">🍦 Daily Sales Report</h2>
                <p><strong>Date:</strong> ${dateString}</p>
                <p><strong>Submitted By:</strong> Staff ID: ${userId}</p>
                
                <hr style="border: 1px solid #eee; margin: 20px 0;">
                
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Total Revenue:</strong></td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; color: #2563eb; font-size: 18px;">tk. ${totalRevenue.toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Net Profit:</strong></td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; color: #16a34a; font-weight: bold;">tk. ${totalProfit.toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Total Orders:</strong></td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${todaysSales.length}</td>
                    </tr>
                     <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Items Sold:</strong></td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${totalItemsSold}</td>
                    </tr>
                </table>

                <h3 style="margin-top: 20px;">💵 Cash Drawer Status</h3>
                <ul style="list-style: none; padding: 0;">
                    <li style="padding: 5px 0;">Cash Collected: <strong>tk. ${cashCollected.toLocaleString()}</strong></li>
                    <li style="padding: 5px 0;">Online/Card: <strong>tk. ${onlineCollected.toLocaleString()}</strong></li>
                </ul>

                <p style="font-size: 12px; color: #888; margin-top: 30px;">This is an automated report from your Ice Cream Shop App.</p>
            </div>
        `;

        // 5. Send the Email
        // Replace with the actual Owner/Manager email address
        const ownerEmail = "alexberman357@gmail.com"; 
        
        await sendEmail(ownerEmail, `End of Day Report - ${dateString}`, emailHtml);

        res.status(200).json({ message: "Daily report submitted and email sent successfully!" });

    } catch (error) {
        console.error("Report Error:", error);
        res.status(500).json({ message: "Failed to send report." });
    }
};

module.exports = { submitDailyReport };