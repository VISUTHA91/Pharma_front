import React from 'react'
import { MdEdit } from "react-icons/md";
import { FcPlus } from "react-icons/fc";
import { useState, useEffect } from 'react';
import { MdDeleteForever } from "react-icons/md";
import { getCategory } from '../../Api/apiservices';
import { createCategory } from '../../Api/apiservices';
import { updateCategory } from '../../Api/apiservices';
import { deleteCategory } from '../../Api/apiservices';
import * as XLSX from "xlsx";
import PaginationComponent from '../../Components/PaginationComponent';
import { FaSearch } from "react-icons/fa";
import { toast } from 'react-toastify';
import { MdRemoveRedEye } from "react-icons/md";

// import { Tooltip } from "@/components/ui/tooltip";

function AdminCategory() {
    const [categories, setCategories] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [categoryName, setCategoryName] = useState("");
    const [category_description, setCategory_description] = useState("");
    const [showEditModal, setShowEditModal] = useState(false); // For modal visibility
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [limit,setLimit] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Track current page
    const [totalPages, setTotalPages] = useState([]);  
      const [showModal, setShowModal] = useState(false);
    
        
    useEffect(() => {
        const fetchCategories =async () => {
          try {
            const staticCategories = await getCategory(currentPage, limit);
            setLimit(staticCategories.limit);
            setTotalPages(staticCategories.totalPages);
            setCurrentPage(staticCategories.page)
            setCategories(staticCategories.data);
            console.log("Fetched categories",staticCategories);

          } catch (error) {
            console.error("Error setting static categories:", error.message || error);
          }
        };
        fetchCategories();
      }, [currentPage]);
      
      const toggleFormVisibility = () => {
        console.log("Form visibility before toggle:", isFormVisible);
        setIsFormVisible(!isFormVisible);
      };      
          const handleSubmit = async (e) => {
            try {
              const newCategory = {
                category_name: categoryName,
                description:category_description, // Include description if needed
              };
              const response = await createCategory(newCategory); // API call
              setCategories((prev) => [...prev, response]); // Update UI with API response
              setCategoryName("");
              setDescription("");
              setShowCreateForm(false); // Close form
              toast.success("Category created successfully:", response);
              window.location.reload();
            } catch (error) {
              console.error("Error creating category:", error);
              toast.error("Error Creating Category : ",error)
            }
          };
          const handleEditSubmit = async (e) => {
            e.preventDefault();
            console.log("Selected Category",selectedCategory.category_id);
            try {
              const updatedData = { 
                category_name: categoryName, // Ensure correct key
                description : category_description
              };
              console.log("Final Data Sent to API:", updatedData); // Debugging
              console.log(" ID Sent to API:", selectedCategory.category_id); // Debugging
              await updateCategory(selectedCategory.category_id, updatedData);
              // alert("Category updated successfully!");
              toast.success("Category Updated Sucessfully !");
              setShowEditModal(false);
              // window.location.reload();
            } catch (error) {
              console.error("Error updating category:", error);
              alert("Failed to update category!");
              toast.error("Failed to Update Category !");
            }
          };
           const [query, setQuery] = useState("");
              const handleSearch = () => {
                if (query.trim() !== "") {
                  onSearch(query);
                }
              };
          const handleDelete = async (categoryId) => {
            const isConfirmed = window.confirm("Are you sure you want to delete this category?");
            if (!isConfirmed) return; 
            try {
              await deleteCategory(categoryId);
              toast.success("Category Deleted Sucessfully!");
              setCategories(categories.filter(category => category.id !== categoryId));
              window.location.reload();
            } catch (error) {
              // console.error("Error deleting category:", error);
              // alert("Failed to delete category!");
              toast.error("Error : ",error);
            }
          };   
          const handleOpenEditModal = (category) => {
            if (!category) return;
            console.log("Category Data in Modal:", category); // Debugging
            setCategoryName(category.category_name || ""); // Ensure correct key
            setCategory_description(category.category_description || "");
            setSelectedCategory(category);
            setShowEditModal(true);
          };
          useEffect(() => {
            if (showEditModal && selectedCategory) {
              setCategoryName(selectedCategory.category_name);
              setCategory_description(selectedCategory.category_description);
            }
          }, [showEditModal, selectedCategory]);
          const handleView = (product) => {
            setSelectedCategory(product);
            setShowModal(true);
          };
          const closeModal = () => {
            setShowModal(false);
            setSelectedCategory(null);
          };
  return (
<div className="m-2">
  <div className="flex justify-between items-center w-[96%]">
    <h1 className="text-xl font-bold ml-2">Category Details</h1>
      <div className="flex items-center">
                {/* <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="CategoryName"
                    className="px-1 py-1 w-64 focus:outline-none rounded-l"
                  /> */}

                  {/* <button
                    onClick={handleSearch}
                    className="bg-[#028090] hover:bg-[#027483] text-white px-2 py-2 flex rounded-r"
                  >
                    <FaSearch />
                  </button> */}
                  </div>
                  {/* <Tooltip content="Add Category"> */}

    <div className='relative'>
      <button
        onClick={() => setShowCreateForm(!showCreateForm)}
        className="flex items-end text-xl text-white border-black rounded-lg px-2 py-1 gap-1 bg-[#019493]"
      >
        <FcPlus size={28} title="Add New Category"/>
      </button>
      {/* <span className="absolute bottom-full mb-1 hidden group-hover:block text-sm bg-gray-800 text-white py-1 px-2 rounded shadow-lg">
          Add Customer
        </span> */}
        </div>
      {/* </Tooltip> */}

  </div>
  <table className="table-fixed w-[96%] bg-white  justify-center rounded-lg shadow-md text-left mb-1 mt-1 ">
  <thead className="bg-[#027483] text-white">
    <tr className=''>
      <th className="py-2 px-4 w-14">S.No</th>
      <th className="py-2 px-4 truncate">Category Name</th>
      <th className="py-2 px-4 truncate ">Description</th>
      <th className="py-2 px-28">Actions</th>
    </tr>
  </thead>
  <tbody>
    {categories && categories.map((category, index) => (
      <tr
        key={category.id}
        className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} hover:bg-gray-200`}
      >
        <td className="py-2 px-4">{index + 1}</td>
        <td className="py-2 px-4 overflow-hidden truncate">{category.category_name}</td>
        <td className="py-2 px-4 overflow-hidden truncate">{category.category_description}</td>
        <td className="py-2 px-28 flex gap-4">
        <button
                  className="text-cyan-700 "
                  onClick={() => handleView(category)}
                >
                  <MdRemoveRedEye size={20} />
                </button>
          <button
            className="text-cyan-700"
            onClick={() => handleOpenEditModal(category)} >
            <MdEdit size={20} />
          </button>
          <button
            className="text-cyan-700 ml-2"
            onClick={() => handleDelete(category.id)}
          >
            <MdDeleteForever size={20} />
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
    {showEditModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-4 rounded-lg w-1/2 h-68">
      <h2 className="text-xl font-bold">Edit Category</h2>
      <form onSubmit= {handleEditSubmit}>
      <label
            className="block text-gray-700 text-sm font-bold "
            htmlFor="description"
          >
            Category Name
          </label>
        <input
  type="text"
  value={categoryName}
  onChange={(e) => {
    const value = e.target.value;
    if (/^(?!\d+$)[a-zA-Z0-9]*$/.test(value)) {
      setCategoryName(value);
    }
  }}
  className="mt-2 p-2 border rounded w-full"
/>

           <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="description"
          >
            Description
          </label>
          <input
            type="text"
            id="category_description"
            value={category_description}
            // onChange={(e) => setDescription(e.target.value)}
            onChange={(e) => {
              const value = e.target.value;
              if (/^(?!\d+$)[a-zA-Z0-9]*$/.test(value)) {
                setCategory_description(value);
              }
            }}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() =>setShowEditModal(false)}
            className="bg-gray-400 text-white  mt-4  px-4 py-2 rounded"
          >
            Cancel
          </button>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Save
        </button>
        </div>
      </form>
    </div>
  </div>
)}
    {showCreateForm && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg w-1/2 shadow-lg">
      <h1 className="text-center text-2xl mb-2 bg-[#019493] text-white rounded-lg p-2">
        Create Category
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Category Name
          </label>
          <input
            type="text"
            id="category_name"
            value={categoryName}
            // onChange={(e) => setCategoryName(e.target.value)}
            onChange={(e) => {
              const value = e.target.value;
              // Ensure at least one alphabet is present while allowing numbers and spaces
              if (/^(?=.*[A-Za-z])[A-Za-z0-9\s]*$/.test(value)) {
                setCategoryName(value);
              }
            }}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
            required
          /> </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Description
          </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => {
              const value = e.target.value;
              if (/^(?=.*[A-Za-z])[A-Za-z0-9\s]*$/.test(value)) {
              // if (/^(?!\d+$)[a-zA-Z0-9]*$/.test(value)) {
                setDescription(value);
              }
            }}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setShowCreateForm(false)}
            className="bg-gray-400 text-white font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
)}
{/* View Modal */}
{showModal && selectedCategory && (
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
                  <strong className="font-semibold"> Category Name :</strong> {selectedCategory.category_name}
                </p>
                <p>
                  <strong className="font-semibold">Category ID :</strong> {selectedCategory.cat_auto_gen_id
                  }
                </p>
                {/* {selectedCategory.products && selectedCategory.products.length > 0 && (
  <p>
    <strong className="font-semibold">Products:</strong>{" "}
    {selectedCategory.products.map((product, index) => (
      <span key={index}>
        {product.product_name}
        {index !== selectedCategory.products.length - 1 && ", "} 
      </span>
    ))}
  </p>
)} */}

{selectedCategory.products && selectedCategory.products.length > 0 && (
  <div>
    <strong className="font-semibold">Products:</strong>
    <ul className="ml-16">
      {selectedCategory.products.map((product, index) => (
        <li key={index}>{product.product_name}</li>
      ))}
    </ul>
  </div>
)}

                <p>
                  <strong className="font-semibold">Created Date :</strong> {selectedCategory.category_created_at ? selectedCategory.category_created_at.split("T")[0] : "N/A"}
                </p>
              
              </div>
              <div>
                <p>
                  <strong className="font-semibold">Description :</strong>
                </p>
                <p className="bg-gray-100 p-3 rounded-md text-sm">{selectedCategory.category_description}</p>
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
<PaginationComponent
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage} />
  </div>
    )
}
export default AdminCategory