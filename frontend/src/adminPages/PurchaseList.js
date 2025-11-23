import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Import AnimatePresence for modal exit
import UseAxiosSecure from "../hook/UseAxiosSecure";

export default function PurchaseList() {
  const axiosSecure = UseAxiosSecure();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- NEW: State for Edit Modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [axiosSecure]);

  const fetchData = async () => {
    try {
      const res = await axiosSecure.get("/purchased-item");
      setPurchases(res.data.data || []);
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this?")) return; // Simple safety check
    try {
      const res = await axiosSecure.delete(`/delete-purchase/${id}`);
      if (res.status === 200) {
        setPurchases(purchases.filter((item) => item._id !== id));
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  // --- 1. OPEN MODAL & FILL DATA ---
  const handleEdit = (item) => {
    setEditData({
      id: item._id,
      name: item.name,
      quantityInStock: item.quantityInStock,
      pricePerUnit: item.pricePerUnit,
      unit: item.unit,
      supplier: item.supplier,
      previewImage: item.itemImage, // To show current image
      newImage: null, // To store new file if uploaded
    });
    setIsModalOpen(true);
  };

  // --- 2. HANDLE FORM INPUTS ---
  const handleInputChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditData({
        ...editData,
        newImage: file,
        previewImage: URL.createObjectURL(file), // Show preview immediately
      });
    }
  };

  // --- 3. SUBMIT UPDATE TO BACKEND ---
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", editData.name);
      formData.append("quantityInStock", editData.quantityInStock);
      formData.append("pricePerUnit", editData.pricePerUnit);
      formData.append("unit", editData.unit);
      formData.append("supplier", editData.supplier);
      if (editData.newImage) {
        formData.append("image", editData.newImage); // Match your multer field name
      }

      // Call the API
      const res = await axiosSecure.put(`/update-purchase/${editData.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200) {
        // Close modal and refresh list
        setIsModalOpen(false);
        fetchData(); // Re-fetch to show updated data
      }
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update item");
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-5xl mx-auto p-2 md:p-4"
    >
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 text-pink-600 drop-shadow-sm">
        🍦 Stock List
      </h1>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-10">
             <div className="animate-spin w-10 h-10 border-4 border-pink-400 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-pink-100 text-pink-700 text-xs md:text-base uppercase tracking-wider">
                <th className="hidden md:table-cell p-3 text-left">Image</th>
                <th className="p-2 md:p-3 text-left">Item</th>
                <th className="hidden md:table-cell p-3 text-left">Unit</th>
                <th className="p-2 md:p-3 text-left">Stock</th>
                <th className="p-2 md:p-3 text-left">Price</th>
                <th className="hidden md:table-cell p-3 text-left">Supplier</th>
                <th className="p-2 md:p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-xs md:text-base">
              {purchases.map((item) => (
                <tr key={item._id} className="border-b hover:bg-pink-50 transition-all">
                  <td className="hidden md:table-cell p-3">
                    <img src={item.itemImage || "/placeholder.png"} alt={item.name} className="w-12 h-12 rounded-xl object-cover shadow" />
                  </td>
                  <td className="p-2 md:p-3 font-medium">
                    {item.name}
                    <div className="md:hidden text-[10px] text-gray-400">({item.unit})</div>
                  </td>
                  <td className="hidden md:table-cell p-3">{item.unit}</td>
                  <td className="p-2 md:p-3 text-green-600 font-bold">{item.quantityInStock}</td>
                  <td className="p-2 md:p-3">{item.pricePerUnit} Tk</td>
                  <td className="hidden md:table-cell p-3">{item.supplier}</td>
                  <td className="p-2 md:p-3 text-center">
                    <div className="flex flex-col md:flex-row gap-1 md:gap-2 justify-center items-center">
                      <button 
                        onClick={() => handleEdit(item)} 
                        className="w-full md:w-auto py-1 px-2 bg-indigo-500 text-white text-[10px] md:text-sm font-medium rounded shadow hover:bg-indigo-600"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(item._id)} 
                        className="w-full md:w-auto py-1 px-2 bg-red-500 text-white text-[10px] md:text-sm font-medium rounded shadow hover:bg-red-600"
                      >
                        Del
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* --- BEAUTIFUL EDIT MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="bg-pink-600 p-4 flex justify-between items-center">
                <h2 className="text-white text-lg font-bold">✏️ Edit Item</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white text-2xl leading-none">&times;</button>
              </div>

              {/* Form Content - Scrollable */}
              <div className="p-6 overflow-y-auto">
                <form onSubmit={handleUpdateSubmit} className="space-y-4">
                  
                  {/* Image Preview */}
                  <div className="flex justify-center mb-4">
                    <div className="relative w-24 h-24">
                       <img 
                         src={editData.previewImage || "/placeholder.png"} 
                         alt="Preview" 
                         className="w-full h-full object-cover rounded-full border-4 border-pink-100 shadow-sm"
                       />
                       <label className="absolute bottom-0 right-0 bg-gray-800 text-white p-1 rounded-full cursor-pointer shadow-lg hover:bg-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                          </svg>
                          <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                       </label>
                    </div>
                  </div>

                  {/* Input Fields */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                    <input type="text" name="name" value={editData.name} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none transition" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                        <input type="number" name="quantityInStock" value={editData.quantityInStock} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none" />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                        <select name="unit" value={editData.unit} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none">
                            <option value="KG">KG</option>
                            <option value="Ltr">Ltr</option>
                            <option value="Pcs">Pcs</option>
                            <option value="Box">Box</option>
                        </select>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                        <input type="number" name="pricePerUnit" value={editData.pricePerUnit} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                        <input type="text" name="supplier" value={editData.supplier} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none" />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition">
                        Cancel
                    </button>
                    <button type="submit" disabled={updateLoading} className="flex-1 py-3 bg-pink-600 text-white font-semibold rounded-xl hover:bg-pink-700 transition shadow-lg disabled:opacity-50">
                        {updateLoading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>

                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}