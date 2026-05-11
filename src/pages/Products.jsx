import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import Carousel from "./Carousel";
import api from "../api/axios";

const Products = () => {

  // STATES

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const LIMIT = 8;

  // NORMALIZE CATEGORY - FIXED

  const normalizeCategory = (value) => {
    if (!value) return "";
    
    // Convert to string and trim
    let normalized = String(value).trim();
    
    // Handle "Kids" specifically - ensure it matches exactly
    if (normalized.toLowerCase() === "kids" || 
        normalized.toLowerCase() === "kid" ||
        normalized.toLowerCase() === "for kids") {
      return "Kids";
    }
    
    // Handle "For Men"
    if (normalized.toLowerCase() === "for men" || 
        normalized.toLowerCase() === "men" ||
        normalized.toLowerCase() === "male") {
      return "For Men";
    }
    
    // Handle "For Women"
    if (normalized.toLowerCase() === "for women" || 
        normalized.toLowerCase() === "women" ||
        normalized.toLowerCase() === "female") {
      return "For Women";
    }
    
    // Return with first letter capitalized for other categories
    return normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase();
  };

  // FETCH PRODUCTS

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  // FILTER PRODUCTS

  useEffect(() => {
    filterProducts();
  }, [selectedCategory, products, sortBy]);

  // API CALL

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products?page=${currentPage}&limit=${LIMIT}`);
      const data = response.data;


      // SAFE PRODUCTS
      const safeProducts = (data.products || []).filter((item) => item && item._id);
      
      // Log all categories from database
      const categories = [...new Set(safeProducts.map(p => p.category))];
   
      setProducts(safeProducts);
      setFilteredProducts(safeProducts);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };
  // FILTER + SORT - FIXED

  const filterProducts = () => {
    let filtered = Array.isArray(products) ? [...products] : [];

    // CATEGORY FILTER - FIXED

    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => {
        // Get raw category from database
        const dbCategoryRaw = product.category;
        
        // Normalize both for comparison
        const dbCategoryNorm = normalizeCategory(dbCategoryRaw);
        const selectedNorm = normalizeCategory(selectedCategory);
        
        const matches = dbCategoryNorm === selectedNorm;
        
        return matches;
      });
    }

  // SORTING

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price-high":
        filtered.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  };

  // CATEGORIES 

  const categories = [
    { id: "all", name: "All Products", icon: "🛍️" },
    { id: "For Men", name: "For Men", icon: "👔" },
    { id: "For Women", name: "For Women", icon: "👗" },
    { id: "Kids", name: "Kids", icon: "🧸" }
  ];

  // LOADING UI
  

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  // MAIN UI
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO */}
      <div className="max-w-7xl mx-auto px-4">
        <Carousel />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* CATEGORY FILTER */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setCurrentPage(1);
                }}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                  selectedCategory === category.id
                    ? "bg-black text-white shadow-lg scale-105"
                    : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
                }`}
              >
                <span className="text-xl">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* SORT */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </p>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="default">Sort by Default</option>
            <option value="price-low">Price Low to High</option>
            <option value="price-high">Price High to Low</option>
            <option value="rating">Rating High to Low</option>
            <option value="newest">Newest First</option>
          </select>
        </div>

      

        {/* EMPTY PRODUCTS */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">No products found</h3>
            <p className="text-gray-600">Try another category</p>
            <button
              onClick={() => setSelectedCategory("all")}
              className="mt-4 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              View All Products
            </button>
          </div>
        ) : (
          <>
            {/* PRODUCTS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* PAGINATION */}
            <div className="flex justify-center items-center gap-3 mt-12 flex-wrap">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-4 py-2 rounded-lg border ${
                    currentPage === index + 1 ? "bg-black text-white" : "bg-white"
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Products;