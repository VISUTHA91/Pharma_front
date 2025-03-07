import React, { useState } from "react";
import { MdEdit } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import { FcPlus } from "react-icons/fc";
import { MdRemoveRedEye } from "react-icons/md";
import { deleteproduct, fetchProducts } from "../../Api/apiservices";
import { useEffect } from "react";
import { getCategory } from "../../Api/apiservices";
import { createProduct } from "../../Api/apiservices";
import { updateProduct } from "../../Api/apiservices";
import PaginationComponent from "../../Components/PaginationComponent";
import * as XLSX from "xlsx";
import { fetchSuppliers } from "../../Api/apiservices";
import { uploadParsedData } from '../../Api/apiservices';
import { fetchProductbyID } from '../../Api/apiservices';
import { FaSearch } from "react-icons/fa";
import { FaFileExcel } from "react-icons/fa";
import { toast } from "react-toastify";
import { getCategorywithoutpagination } from "../../Api/apiservices";

function ProductCreation() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [limit, setLimit] = useState([]);
  const [formData, setFormData] = useState({
    product_name: "",
    generic_name: "",
    brand_name: "",
    product_quantity: 0,
    product_category: "",
    product_price: "",
    product_discount: "",
    supplier_price: "",
    product_description: "",
    product_batch_no: "",
    expiry_date: "",
    MFD: "",
    supplier: "",
    GST: "",
    stock_status: "Available",
  });
// Product List
  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProducts(currentPage, limit);
        setLimit(data.limit);
        console.log("Product Data:",data.limit);
        setTotalPages(data.totalPages);
        setCurrentPage(data.page)
        setProducts(data.data);
      } catch (err) {
        console.error("Fetch products error:", err.response?.data || err.message);
        setError(err.response?.data?.error || "Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, [currentPage]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleFormnameChange = (e) => {
    const { name, value } = e.target;
  
    // Allow alphabets and alphabets with numbers, but not only numbers
    if (/^(?!\d+$)[A-Za-z0-9]*$/.test(value)) {
      setFormData({ ...formData, [name]: value });
    }
  };
  


// Categories Fetch From Backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const staticCategories = await getCategorywithoutpagination();
        setCategory(staticCategories.data);
        console.log("Static Categories:", staticCategories.data);
      } catch (error) {
        console.error("Error setting static categories:", error.message || error);
      }
    };
    fetchCategories();
  }, []);
  useEffect(() => {
    const getSuppliers = async () => {
      const data = await fetchSuppliers();
      setSuppliers(data); 
    };
    getSuppliers();
  }, []);

  useEffect(() => {
    if (showModal) {
    }
  }, [showModal, formData]);
  useEffect(() => {
  }, [formData]);

  const handleEdit = async (productId) => {
    setIsEditing(true);
    setEditingProductId(productId);
    // console.log("Editing Product ID:", productId); // Debugging log
    try {
      const response = await fetchProductbyID(productId);
      const product = response.data;
      setFormData({
        product_name: product.product_name || "",
        generic_name: product.generic_name || "",
        brand_name: product.brand_name || "",
        product_quantity: product.product_quantity || 0,
        product_category: product.product_category || 0,
        product_price: product.product_price || "",
        product_discount: product.product_discount || "",
        supplier_price: product.supplier_price || "",
        product_description: product.product_description || "",
        product_batch_no: product.product_batch_no || "",
        expiry_date: product.expiry_date || "",
        MFD: product.MFD || "",
        supplier: product.supplier_name || "",
        GST: product.GST || "",
        stock_status: product.stock_status || "Available",
      });
      setShowModal(true);
    } catch (error) {
      toast.error("Error Fetching Product Details:", error);
    }
  };

   const handleFormSubmit = async (e) => {
    // e.preventDefault(); // Prevents default form submission
    try {
      if (selectedProduct) {
        // console.log("Edited ProductID Befor Sending API", selectedProduct.product_id)
        await updateProduct(selectedProduct.product_id, formData);
        toast.success("Product Updated Successfully!");
      } else {
        await createProduct(formData);
        toast.success("Product Created Successfully!");
      }
    } catch (error) {
      toast.error("Failed to save Product Please Try Again");
    }
  };
  const resetForm = () => {
    setFormData({
      product_name: "",
      generic_name: "",
      brand_name: "",
      product_quantity: 0,
      product_category: "",
      product_price: "",
      product_discount: "",
      supplier_price: "",
      product_description: "",
      product_batch_no: "",
      expiry_date: "",
      MFD: "",
      supplier: "",
      GST: "",
      stock_status: "Available",
    });
    setEditingProductId(null);
    setIsEditing(false);
  };
  const handleView = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file); // Append the file to FormData
    try {
      const response = await uploadParsedData(formData);
      // console.log("File uploaded successfully:", response);
      toast.success("File Uploaded SucessFully");
    } catch (error) {
      // console.error("Error uploading data:", error);
      toast.error("Error Uploading");
    }
  };
  const handleClick = () => {
    document.getElementById("fileInput").click();
  };
  const handleDelete = async (productId) => {
    try {
      await deleteproduct(productId);
      toast.success("Product deleted successfully!");
      // Optionally, update the UI by refetching categories
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );
    } catch (error) {
      console.error("Failed to delete Product:", error);
      toast.error("Failed to delete Product:");
    }
  };
    const [query, setQuery] = useState("");
    const handleSearch = () => {
      if (query.trim() !== "") {
        onSearch(query);
      }
    };

  return (
    <div className="m-1">
      <div className="  w-[95%]">
        <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Product List</h1>
         <div className="flex items-center">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="CategoryName or ProductName"
                className="px-1 py-1 w-64 focus:outline-none rounded-l"
              />
              <button
                onClick={handleSearch}
                className="bg-[#028090] hover:bg-[#027483] text-white px-2 py-2 flex rounded-r"
              >
                <FaSearch />
              </button>
              </div>
     <div className="flex gap-2">
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }} className="flex items-center text-xl text-white border-black rounded-lg px-2 py-1 gap-1 bg-cyan-700 mb-2"
          >
            <FcPlus size={28} className=''title="Add Product" />
          </button>
          <button
            onClick={handleClick}
            className="flex items-center text-xl text-white border-black rounded-lg px-2 py-1 gap-1 bg-cyan-700 mb-2"
          >
            <FaFileExcel  size={26} title="Import to Excel"/>
            <input
              id="fileInput"
              type="file"
              accept=".xlsx,.xls"
              name="file"
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />
          </button>
          </div>
        </div>
      </div>
      <div className="items-center  mb-0">
      <table className="table-fixed w-[96%] bg-white rounded-lg shadow-md text-left mb-1">
        <thead className="bg-[#027483] text-white">
          <tr>
            <th className="py-2 px-4 w-14">S.No</th>
            <th className="py-2 px-4 truncate">Name</th>
            <th className="py-2 px-4">Brand Name</th>
            <th className="py-2 px-4 truncate">Category</th>
            <th className="py-2 px-4">Quantity</th>
            <th className="py-2 px-4">Exp.Date</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody className="">
          {products && products.map((product, index) => (
            <tr
              key={product.id}
              className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"
                } hover:bg-gray-200 h-[90%] overflow-auto scrollbar-hidden`}
            >
              <td className="py-2 px-4">{index + 1}</td>
              <td className="py-2 px-4 overflow-hidden truncate">{product.product_name}</td>
              <td className="py-2 px-4">{product.brand_name}</td>
              <td className="py-2 px-4  truncate">{product.product_category}</td>
              <td className="py-2 px-4">{product.product_quantity}</td>
              <td className="py-2 px-4">
                {product.expiry_date ? product.expiry_date.split("T")[0] : "N/A"}
              </td>
              <td className="py-1 px-4">
                <button
                  className="text-cyan-700 "
                  onClick={() => handleView(product)}
                >
                  <MdRemoveRedEye size={20} />
                </button>
                <button
                  className="text-cyan-700 ml-2"
                  onClick={() => handleEdit(product.id)}
                >
                  <MdEdit size={20} />
                </button>
                <button
                  className="text-cyan-700 ml-2"
                  onClick={() => handleDelete(product.id)}
                >
                  <MdDeleteForever size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <PaginationComponent
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage} />
      </div>
      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50  flex justify-center z-50">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl p-6 max-h-[90vh] overflow-y-auto scroll-bar-hide mt-10">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >✕</button>
            <h2 className="text-xl font-bold mb-4">
              {isEditing ? "Edit Product" : "Add Product"}
            </h2>
            <form onSubmit={handleFormSubmit} className="space-y-6 ">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Category</label>
                  <select
                    name="product_category"
                    value={formData.product_category || ''}
                    onChange={handleFormChange}
                    required
                    className="w-full border rounded p-2"
                  >
                    <option value={formData.product_category}>{formData.product_category}</option>
                    {Array.isArray(category) && category.map((cat) => (
                      <option key={cat.id} value={cat.category_name}>
                        {cat.category_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">Name</label>
                  <input
                    type="text"
                    name="product_name"
                    value={formData.product_name}
                    onChange={handleFormnameChange}
                    required
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Generic Name</label>
                  <input
                    type="text"
                    name="generic_name"
                    value={formData.generic_name}
                    onChange={handleFormnameChange}
                    required
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Brand Name</label>
                  <input
                    type="text"
                    name="brand_name"
                    value={formData.brand_name}
                    onChange={handleFormnameChange}
                    required
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Quantity</label>
                  <input
                    type="number"
                    name="product_quantity"
                    value={formData.product_quantity}
                    onChange={handleFormChange}
                    required
                    className="w-full border rounded p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">MRP Price</label>
                  <input
                    type="number"
                    name="product_price"
                    value={formData.product_price}
                    onChange={handleFormChange}
                    required
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Discount Percentage</label>
                  <input
                    type="number"
                    name="product_discount"
                    value={formData.product_discount}
                    onChange={handleFormChange}
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Supplier Price</label>
                  <input
                    type="number"
                    name="supplier_price"
                    value={formData.supplier_price}
                    onChange={handleFormChange}
                    required
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Description</label>
                  <textarea
                    name="product_description"
                    value={formData.product_description}
                    onChange={handleFormnameChange}
                    rows="3"
                    className="w-full border rounded p-2"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium">Batch No</label>
                  <input
                    type="text"
                    name="product_batch_no"
                    value={formData.product_batch_no}
                    onChange={handleFormnameChange}
                    required
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Manufacturing Date</label>
                  <input
                    type="date"
                    name="MFD"
                    value={formData.MFD ? formData.MFD.split("T")[0] : ""} // Convert ISO to "yyyy-MM-dd"
                    onChange={handleFormChange}
                    required
                    max={new Date().toISOString().split("T")[0]} // Restrict future dates
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Expiry Date</label>
                  <input
                    type="date"
                    name="expiry_date"
                    value={formData.expiry_date ? formData.expiry_date.split("T")[0] : ""} // Convert ISO to "yyyy-MM-dd"

                    onChange={handleFormChange}
                    required
                    min={new Date().toISOString().split("T")[0]} // Restrict past dates
                    className="w-full border rounded p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Supplier Name</label>
                  <select
                    name="supplier"
                    value={formData.supplier || " "}
                    onChange={handleFormChange}
                    required
                    className="w-full border rounded p-2"
                  >
                    <option value={formData.supplier}>{formData.supplier}</option>
                    {suppliers.map((supp) => (
                      <option key={supp.supplier_id} value={supp.supplier_id}>
                        {supp.company_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">GST %</label>
                  <select
                    name="GST"
                    value={parseFloat(formData.GST) || ""}  // Convert "2.00" to 2
                    onChange={handleFormChange}
                    required
                    className="w-full border rounded p-2"
                  >
                    <option value="0">0%</option>
                    <option value="5">5%</option>
                    <option value="12">12%</option>
                    <option value="18">18%</option>
                    <option value="28">28%</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">Availability Status</label>
                  <select
                    name="stock_status"
                    value={formData.stock_status}
                    onChange={handleFormChange}
                    required
                    className="w-full border rounded p-2"
                  >
                     {/* {isEditing ?
                    (<div><option value="Available">Available</option>
                    <option value="Unavailable">Unavailable</option></div>) :
                    (<div><option value="Available">Available</option></div>)} */}
                    <option value="Available">Available </option>
                    <option value="UnAvailable">UnAvailable </option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#027483] text-white px-4 py-2 rounded hover:bg-cyan-700">
                  {isEditing ? "Update" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>)}
      {/* View Modal */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-2/3 max-w-4xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center bg-cyan-700 text-white px-6 py-4 rounded-t-xl">
              <h2 className="text-2xl font-semibold">Product Details</h2>
            </div>
            {/* Modal Content */}
            <div className="p-6 space-y-4 text-gray-800 ">
              <div className="grid grid-cols-2 gap-4">
                <p>
                  <strong className="font-semibold">Name:</strong> {selectedProduct.product_name}
                </p>
                <p>
                  <strong className="font-semibold">Generic Name:</strong> {selectedProduct.generic_name}
                </p>
                <p>
                  <strong className="font-semibold">Supplier Name:</strong> {selectedProduct.supplier}
                </p>
                <p>
                  <strong className="font-semibold">Brand Name:</strong> {selectedProduct.brand_name}
                </p>
                <p>
                  <strong className="font-semibold">Category:</strong> {selectedProduct.product_category}
                </p>
                <p>
                  <strong className="font-semibold">MFD:</strong> {selectedProduct.MFD ? selectedProduct.MFD.split("T")[0] : "N/A"}
                </p>
                <p>
                  <strong className="font-semibold">Exp.Date:</strong> {selectedProduct.expiry_date ? selectedProduct.expiry_date.split("T")[0] : "N/A"}
                </p>
                <p>
                  <strong className="font-semibold">Quantity:</strong> {selectedProduct.product_quantity}
                </p>
                <p>
                  <strong className="font-semibold">Batch No:</strong> {selectedProduct.product_batch_no}
                </p>
                <p>
                  <strong className="font-semibold">MRP Price:</strong> ₹{selectedProduct.product_price}
                </p>
                <p>
                  <strong className="font-semibold">Discount:</strong> {selectedProduct.product_discount}%
                </p>
                <p>
                  <strong className="font-semibold">Supplier Price:</strong> ₹{selectedProduct.supplier_price}
                </p>
              </div>
              <div>
                <p>
                  <strong className="font-semibold">Description:</strong>
                </p>
                <p className="bg-gray-100 p-3 rounded-md text-sm">{selectedProduct.product_description}</p>
              </div>
            </div>
            <div className="flex justify-end items-center px-6 py-4 bg-gray-100 rounded-b-xl">
              <button
                onClick={closeModal}
                className="bg-cyan-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-cyan-800 transition duration-200">
                Close
              </button>
            </div>
          </div>
        </div>)}
    </div>);
}
export default ProductCreation;

{/* <button
          onClick={() => {
            resetForm();
            setShowCreateForm(true);
          }}
          className="bg-[#027483] text-white px-8 py-2 rounded hover:bg-cyan-700"
        >
           <FcPlus size={28} />Add 
        </button> */}


// const handleEdit = (product) => {
//   console.log("Editing Product Data:", product); // Debugging log
//   setIsEditing(true);
//   setEditingProductId(product.id);
//   setFormData({
//     product_name: product.product_name || "",
//     generic_name: product.generic_name || "",
//     brand_name: product.brand_name || "",
//     product_quantity: product.product_quantity || 0,
//     product_category: product.product_category ? String(product.product_category) : "", // Ensure it's a string
//     product_price: product.product_price || "",
//     product_discount: product.product_discount || "",
//     supplier_price: product.supplier_price || "",
//     product_description: product.product_description || "",
//     product_batch_no: product.product_batch_no || "",
//     expiry_date: product.expiry_date || "",
//     MFD: product.MFD || "",
//     supplier: product.supplier ? String(product.supplier) : "", // Ensure it's a string
//     GST: product.GST ? String(product.GST) : "0", // Ensure it's a string
//     stock_status: product.stock_status || "Available",
//   });
//   setShowModal(true);
//   console.log("showModal state after setting:", showModal);

// };