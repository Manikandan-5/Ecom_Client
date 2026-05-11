import { useState } from "react";
import { Package, Users } from "lucide-react";

import ProductManagement from "../components/products/ProductManagement";
import UserManagement from "../components/users/UserManagement";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("products");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-black to-gray-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-300 mt-1">
            Manage products and users
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-6 py-3 font-medium flex items-center gap-2 ${
              activeTab === "products"
                ? "border-b-2 border-black text-black"
                : "text-gray-500"
            }`}
          >
            <Package className="h-5 w-5" />
            Products
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`px-6 py-3 font-medium flex items-center gap-2 ${
              activeTab === "users"
                ? "border-b-2 border-black text-black"
                : "text-gray-500"
            }`}
          >
            <Users className="h-5 w-5" />
            Users
          </button>
        </div>

        {activeTab === "products" ? (
          <ProductManagement />
        ) : (
          <UserManagement />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;