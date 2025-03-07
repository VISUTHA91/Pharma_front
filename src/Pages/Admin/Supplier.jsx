import React, { useState, useEffect } from 'react';
import { MdEdit } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import { FcPlus } from "react-icons/fc";
import { MdRemoveRedEye } from "react-icons/md";
import { updateSupplier } from '../../Api/apiservices';
import { createSupplier } from '../../Api/apiservices';
import { deleteSupplier } from '../../Api/apiservices';
import PaginationComponent from '../../Components/PaginationComponent';
import { fetchSupplierpagination } from '../../Api/apiservices';
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';


function Supplier() {
  const [suppliers, setSuppliers] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading , setLoading] = useState([]);
  const [error , setError] = useState([]);
   const [currentPage, setCurrentPage] = useState(1); // Track current page
    const [totalPages, setTotalPages] = useState([]);
    const [limit,setLimit] = useState([]);


  const [formData, setFormData] = useState({
    name: "",
    phoneNo: "",
    email: "",
    address: "",
    gstNo: "",
    status: "Active",
  });
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const navigate = useNavigate();

   
  
  useEffect(() => {
          const getSuppliers = async () => {
            try {
              const data = await fetchSupplierpagination(currentPage, limit);
              setLimit(data.limit);
        setTotalPages(data.totalPages);
        setCurrentPage(data.page)
              setSuppliers(data.data);
            } catch (err) {
              setError(err.message || "Failed to load products.");
              toast.error(err.message || "Failed to load products.");
            } finally {
              setLoading(false);
            }
          };
          getSuppliers();
        }, [currentPage]);

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleFormnameChange = (e) => {
    const { name, value } = e.target;
    // Allow alphabets and alphanumeric values but NOT only numbers
    if (/^(?!\d+$)[a-zA-Z0-9 ]*$/.test(value) || value === "") {
      setFormData({ ...formData, [name]: value });
    }
  };
  const handleFormnumberChange = (e) => {
    const { name, value } = e.target;
    // Allow only numbers and ensure it does not exceed 10 digits
    if (/^\d{0,10}$/.test(value)) {
      setFormData({ ...formData, [name]: value });
    }
  };
  
  

  // Handle Edit action (populate the form with the selected supplier's data)
  const handleEdit = (supplier) => {
    setFormData(supplier);
    setSelectedSupplier(supplier);
    setShowCreateForm(true);
  };

  // Handle Submit action (Add or Update)
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (selectedSupplier) {
  //     // Update existing supplier
  //     const updatedSuppliers = suppliers.map((sup) =>
  //       sup.supplier_id === selectedSupplier.id ? { ...sup, ...formData } : sup
  //     );
  //     setSuppliers(updatedSuppliers);
  //   } else {
  //     // Add new supplier
  //     const newSupplier = { ...formData, id: suppliers.length + 1 };
  //     setSuppliers([...suppliers, newSupplier]);
  //   }

  //   // Reset form and hide the form
  //   setFormData({
  //     supplier_name: "",
  //     phone_number: "",
  //     email: "",
  //     address: "",
  //     supplier_gst_number: "",
  //     status: "Active",
  //   });
  //   setShowCreateForm(false);
  //   setSelectedSupplier(null);
  // };

  const handleSubmit = async (e) => {
    // e.preventDefault();
    try {
      if (selectedSupplier) {
        // Update existing supplier via API
        await updateSupplier(selectedSupplier.supplier_id, formData);
  
        // Update local state after API call
        const updatedSuppliers = suppliers.map((sup) =>
          sup.supplier_id === selectedSupplier.supplier_id ? { ...sup, ...formData } : sup
        );
        setSuppliers(updatedSuppliers);
      } else {
        // Create a new supplier via API
        const response = await createSupplier(formData);
  
        // Update local state with new supplier from API response
        setSuppliers([...suppliers, response]);
      }
  
      toast.success("Supplier saved successfully!");
  
      // Reset form and hide the form
      setFormData({
        supplier_name: "",
        phone_number: "",
        email: "",
        address: "",
        supplier_gst_number: "",
        status: "Active",
      });
      setShowCreateForm(false);
      setSelectedSupplier(null);
    } catch (error) {
      toast.error("Failed to save supplier. Please try again.");
      console.error("Error in handleSubmit:", error);
    }
  };

  // Handle Delete action
  const handleDelete = async (supplierId) => {
    console.log("supplierId in function",supplierId)
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      try {
        await deleteSupplier(supplierId);
        const updatedSuppliers = suppliers.filter((sup) => sup.supplier_id !== supplierId);
        setSuppliers(updatedSuppliers);
        toast.success("Supplier deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete supplier. Please try again.");
      }
    }
  };
  const handleView = (supplier_id) => {
    console.log("Selected Supplier:", supplier_id);  // Debugging
    if (!suppliers || !supplier_id) {
      console.error("Supplier ID is missing!");
      return;
    }
    // navigate(`supplierdetails/${supplier_id}`);
  };
  

  const closeModal = () => {
    setShowModal(false);
    setSelectedSupplier(null);
  };

  return (
    <div className="">
      <div className="flex justify-between mr-6">
        <h1 className="text-2xl font-bold">Supplier Details</h1>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center text-xl text-white border-black rounded-lg px-2 py-1 gap-1 bg-cyan-700 mb-2"
          >
            <FcPlus size={28} className='' /> Add 
          </button>
      </div>
      <div className="lg:flex lg:flex-col sm:flex-col w-[100%] gap-2">
        <div className=" overflow-hidden">
          {suppliers.length > 0 && (
            <table className="w-[98%] ">
              <thead>
                <tr className="bg-[#027483] text-white text-left ">
                  <th className="p-2">S.No</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Phone No</th>
                  <th className="p-2">Location</th>
                  <th className="p-2">GST No</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((supplier,index) => (
                   <tr
                   key={supplier.supplier_id}
                   className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"
                     } hover:bg-gray-200`}
                 >
                   <td className ="py-2 px-4">{index + 1}</td>
                    <td className="px-2 py-1">{supplier.company_name}</td> 
                    <td className="px-2 py-1">{supplier.phone_number}</td>
                    <td className="px-2 py-1">{supplier.city},{supplier.state}</td>
                    <td className="px-2 py-1">{supplier.supplier_gst_number}</td>
                    <td className="px-2 py-1">{supplier.status}</td>
                    <td className="px-2 py-1 flex gap-2">
                    {/* <td className="p-2">{supplier.address}</td> */}
                    <NavLink
                     to={`./${supplier.supplier_id}`}
                        className="text-cyan-700 "
                        // onClick={() => handleView(supplier.supplier_id)}
                        >
                        <MdRemoveRedEye size={20} />
                      </NavLink>
                      <button
                        className="text-cyan-700 ml-2"
                        onClick={() => handleEdit(supplier)}
                      >
                        <MdEdit size={20} />
                      </button>
                      <button
                        className="text-cyan-700 ml-2"
                        onClick={() => handleDelete(supplier.supplier_id)}
                      >
                        <MdDeleteForever size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <PaginationComponent
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage} /> 
{showCreateForm && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
    <div className="relative bg-white shadow-lg rounded-lg w-full max-w-2xl sm:mx-auto p-6 sm:p-8 animate-fade-in">
      {/* Modal Header */}
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
          {selectedSupplier ? "Edit Supplier" : "Add Supplier"}
        </h2>
        <button
          onClick={() => setShowCreateForm(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Modal Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleFormnameChange}
              required
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone No
            </label>
            <input
              type="number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleFormnumberChange}
              required
              maxLength={10} // Ensures only 10 characters can be entered
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleFormChange}
              required
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleFormChange}
              required
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              GST No
            </label>
            <input
              type="text"
              name="supplier_gst_number"
              value={formData.supplier_gst_number}
              onChange={handleFormChange}
              required
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleFormChange}
              required
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            >
              <option value="Active">Active</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => setShowCreateForm(false)}
            className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-cyan-700 text-white font-medium rounded-lg shadow hover:bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2"
          >
            {selectedSupplier ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}

      </div>
    </div>
  );
}

export default Supplier;
