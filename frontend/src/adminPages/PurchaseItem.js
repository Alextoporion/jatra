import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import UseAxiosSecure from '../hook/UseAxiosSecure';

const ClipboardIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-pink-500"
  >
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
    <path d="M12 11h4"></path>
    <path d="M12 16h4"></path>
    <path d="M8 11h.01"></path>
    <path d="M8 16h.01"></path>
  </svg>
);

const PurchaseItem = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [formMessage, setFormMessage] = useState(null);
  const axiosSecure = UseAxiosSecure();

  // FIX APPLIED HERE (convert numeric values)
  const onSubmit = async (data) => {
    setFormMessage(null);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("unit", data.unit);
    formData.append("quantity", Number(data.quantity));        // FIX
    formData.append("pricePerUnit", Number(data.pricePerUnit)); // FIX
    formData.append("supplier", data.supplier);

    if (data.itemImage && data.itemImage[0]) {
      formData.append("itemImage", data.itemImage[0]);
    }

    try {
      const response = await axiosSecure.post('/purchase', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.status === 201) {
        setFormMessage({
          type: 'success',
          text: 'Purchase successful! Ingredient added.'
        });
        reset();
      } else {
        setFormMessage({
          type: 'error',
          text: response.data.message || 'An error occurred.'
        });
      }

    } catch (error) {
      console.error("Error submitting purchase:", error);
      setFormMessage({
        type: 'error',
        text: 'An error occurred. Please try again.'
      });
    }
  };

  return (
    <div className="font-sans min-h-screen w-full bg-pink-50 md:p-8 md:flex md:items-center md:justify-center">
      <div className="w-full max-w-3xl bg-white p-6 md:p-10 md:rounded-2xl md:shadow-xl min-h-screen md:min-h-0">

        <div className="flex items-center gap-4 mb-6 md:mb-8">
          <ClipboardIcon />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            New Ingredient Purchase
          </h1>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {formMessage && (
            <div
              className={`p-3 rounded-lg text-center font-medium ${
                formMessage.type === 'success'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {formMessage.text}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Name */}
            <div className="md:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Ingredient Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="e.g., Madagascar Vanilla Beans"
                {...register("name", { required: "Ingredient name is required" })}
                className={`w-full p-3 rounded-lg border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 ${
                  errors.name ? "ring-red-500" : "focus:ring-pink-400"
                } transition`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            {/* Unit */}
            <div>
              <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                Unit
              </label>
              <input
                type="text"
                id="unit"
                placeholder="e.g., kg, liter, box"
                {...register("unit", { required: "Unit is required" })}
                className={`w-full p-3 rounded-lg border ${
                  errors.unit ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 ${
                  errors.unit ? "ring-red-500" : "focus:ring-pink-400"
                } transition`}
              />
              {errors.unit && <p className="text-red-500 text-xs mt-1">{errors.unit.message}</p>}
            </div>

            {/* Quantity */}
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Quantity Purchased
              </label>
              <input
                type="number"
                id="quantity"
                placeholder="e.g., 25"
                {...register("quantity", {
                  required: "Quantity is required",
                  valueAsNumber: true,
                  min: { value: 0.01, message: "Must be a positive amount" }
                })}
                className={`w-full p-3 rounded-lg border ${
                  errors.quantity ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 ${
                  errors.quantity ? "ring-red-500" : "focus:ring-pink-400"
                } transition`}
              />
              {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>}
            </div>

            {/* Price per unit */}
            <div>
              <label htmlFor="pricePerUnit" className="block text-sm font-medium text-gray-700 mb-1">
                Price Per Unit ($)
              </label>
              <input
                type="number"
                id="pricePerUnit"
                placeholder="e.g., 4.50"
                step="0.01"
                {...register("pricePerUnit", {
                  required: "Price is required",
                  valueAsNumber: true,
                  min: { value: 0.01, message: "Price must be positive" }
                })}
                className={`w-full p-3 rounded-lg border ${
                  errors.pricePerUnit ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 ${
                  errors.pricePerUnit ? "ring-red-500" : "focus:ring-pink-400"
                } transition`}
              />
              {errors.pricePerUnit && <p className="text-red-500 text-xs mt-1">{errors.pricePerUnit.message}</p>}
            </div>

            {/* Supplier */}
            <div>
              <label htmlFor="supplier" className="block text-sm font-medium text-gray-700 mb-1">
                Supplier
              </label>
              <input
                type="text"
                id="supplier"
                placeholder="e.g., Local Farms Co."
                {...register("supplier", { required: "Supplier name is required" })}
                className={`w-full p-3 rounded-lg border ${
                  errors.supplier ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 ${
                  errors.supplier ? "ring-red-500" : "focus:ring-pink-400"
                } transition`}
              />
              {errors.supplier && <p className="text-red-500 text-xs mt-1">{errors.supplier.message}</p>}
            </div>

            {/* Image */}
            <div className="md:col-span-2">
              <label htmlFor="itemImage" className="block text-sm font-medium text-gray-700 mb-1">
                Item Image
              </label>
              <input
                type="file"
                id="itemImage"
                accept="image/*"
                {...register("itemImage", { required: "Item image is required" })}
                className={`w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg 
                  file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-600 
                  hover:file:bg-pink-100 transition ${
                    errors.itemImage ? "ring-2 ring-red-500 rounded-lg" : ""
                  }`}
              />
              {errors.itemImage && <p className="text-red-500 text-xs mt-1">{errors.itemImage.message}</p>}
            </div>

          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full p-3.5 rounded-lg bg-pink-500 text-white font-bold text-lg 
                hover:bg-pink-600 focus:outline-none focus:ring-2 
                focus:ring-pink-500 focus:ring-offset-2 transition-transform 
                transform hover:-translate-y-1 shadow-lg"
            >
              Add Purchase
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default PurchaseItem;
