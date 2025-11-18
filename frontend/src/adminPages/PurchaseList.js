import React from "react";
import { motion } from "framer-motion";

import { useEffect, useState } from "react";
// import useAxiosSecure from "../hooks/useAxiosSecure";
import UseAxiosSecure from "../hook/UseAxiosSecure";

export default function PurchaseList() {
  // Fetching from backend
  const axiosSecure = UseAxiosSecure();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axiosSecure.get("/purchased-item");
        console.log('see the items',res)
        setPurchases(res.data.data || []);
      } catch (err) {
        console.error("Fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-5xl mx-auto p-4"
    >
      <h1 className="text-3xl font-bold text-center mb-6 text-pink-600 drop-shadow-sm">
        🍦 Purchase Stock List
      </h1>

      <div className="bg-white rounded-2xl shadow-lg overflow-x-auto p-4">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin w-10 h-10 border-4 border-pink-400 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <table className="min-w-[700px] w-full">
            <thead>
              <tr className="bg-pink-100">
                <th className="p-3 text-left text-pink-700">Image</th>
                <th className="p-3 text-left text-pink-700">Item Name</th>
                <th className="p-3 text-left text-pink-700">Unit</th>
                <th className="p-3 text-left text-pink-700">In Stock</th>
                <th className="p-3 text-left text-pink-700">Price / Unit</th>
                <th className="p-3 text-left text-pink-700">Supplier</th>
              </tr>
            </thead>

            <tbody>
              {purchases.map((item, idx) => (
                <tr key={idx} className="border-b hover:bg-pink-50 transition-all">
                  <td className="p-3">
                    <img
                      src={item.itemImage || "/placeholder.png"}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover shadow"
                    />
                  </td>
                  <td className="p-3 font-medium">{item.name}</td>
                  <td className="p-3">{item.unit}</td>
                  <td className="p-3 text-green-600 font-semibold">{item.quantityInStock}</td>
                  <td className="p-3">₹ {item.pricePerUnit}</td>
                  <td className="p-3">{item.supplier}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
}