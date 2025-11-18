import React from "react";

const AdminHome = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm overflow-hidden">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Welcome Back, Admin 👋
      </h2>
      <p className="text-gray-600">
        This is your upgraded WordPress-style dashboard. Use the sidebar to
        navigate between sections, view analytics, or manage users.
      </p>
    </div>
  );
};

export default AdminHome;
