import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";

import api from "../../api/axios";

import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import DeleteModal from "./DeleteModal";

const ProductManagement = () => {

  // LOADING
  const [loading, setLoading] =
    useState(true);

  // PRODUCTS
  const [products, setProducts] =
    useState([]);

  // SEARCH
  const [searchTerm, setSearchTerm] =
    useState("");

  // MODAL
  const [showModal, setShowModal] =
    useState(false);

  // EDIT PRODUCT
  const [editingProduct, setEditingProduct] =
    useState(null);

  // DELETE
  const [deleteId, setDeleteId] =
    useState(null);

  // PAGINATION
  const [currentPage, setCurrentPage] =
    useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  // FETCH PRODUCTS
  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const fetchProducts = async () => {

    try {

      setLoading(true);

      const { data } = await api.get(
        `/products?page=${currentPage}&limit=6`
      );

      // SAFE PRODUCTS
      const safeProducts =
        (data.products || []).filter(
          (item) => item && item._id
        );

      setProducts(safeProducts);

      setTotalPages(
        data.totalPages || 1
      );

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };

  // DELETE PRODUCT
  const handleDelete = async () => {

    try {

      await api.delete(
        `/products/${deleteId}`
      );

      setDeleteId(null);

      fetchProducts();

    } catch (error) {

      console.log(error);
    }
  };

  // SAVE PRODUCT
  const handleSave = async (
    savedProduct
  ) => {

    if (!savedProduct?._id) {
   toast.error("Invalid product");
      return;
    }

    // EDIT
    if (editingProduct) {

      setProducts((prev) =>
        prev
          .filter(
            (item) => item && item._id
          )
          .map((item) =>
            item._id ===
            savedProduct._id
              ? savedProduct
              : item
          )
      );

    }

    // ADD
    else {

      fetchProducts();
    }

    setShowModal(false);

    setEditingProduct(null);
  };

  // FILTER PRODUCTS
  const filteredProducts =
    products.filter(
      (product) =>
        product &&
        product.name
          ?.toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          )
    );

  // LOADING UI
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="h-12 w-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>

      {/* TOP BAR */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">

        {/* SEARCH */}
        <div className="relative w-full max-w-md">

          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />

          <input
            type="text"

            placeholder="Search products..."

            value={searchTerm}

            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }

            className="w-full border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* ADD PRODUCT */}
        <button
          onClick={() => {
            setEditingProduct(null);
            setShowModal(true);
          }}

          className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800"
        >
          <Plus className="h-4 w-4" />

          Add Product
        </button>
      </div>

      {/* PRODUCTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {filteredProducts?.map(
          (product) => (

            <ProductCard
              key={product._id}

              product={product}

              onEdit={() => {
                setEditingProduct(
                  product
                );

                setShowModal(true);
              }}

              onDelete={() =>
                setDeleteId(
                  product._id
                )
              }
            />
          )
        )}
      </div>

      {/* EMPTY */}
      {!loading &&
        filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-700">
              No Products Found
            </h2>
          </div>
        )}

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-3 mt-10 flex-wrap">

        {/* PREV */}
        <button
          disabled={currentPage === 1}

          onClick={() =>
            setCurrentPage(
              (prev) => prev - 1
            )
          }

          className="px-4 py-2 border rounded-lg disabled:opacity-50"
        >
          Prev
        </button>

        {/* PAGE NUMBERS */}
        {[...Array(totalPages)].map(
          (_, index) => (

            <button
              key={index}

              onClick={() =>
                setCurrentPage(
                  index + 1
                )
              }

              className={`px-4 py-2 rounded-lg border ${
                currentPage ===
                index + 1
                  ? "bg-black text-white"
                  : "bg-white"
              }`}
            >
              {index + 1}
            </button>
          )
        )}

        {/* NEXT */}
        <button
          disabled={
            currentPage === totalPages
          }

          onClick={() =>
            setCurrentPage(
              (prev) => prev + 1
            )
          }

          className="px-4 py-2 border rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* PRODUCT MODAL */}
      {showModal && (
        <ProductModal
          product={editingProduct}

          onClose={() => {
            setShowModal(false);

            setEditingProduct(null);
          }}

          onSave={handleSave}
        />
      )}

      {/* DELETE MODAL */}
      {deleteId && (
        <DeleteModal
          onConfirm={handleDelete}

          onCancel={() =>
            setDeleteId(null)
          }
        />
      )}
    </>
  );
};

export default ProductManagement;