import React, { useState } from "react";
import { updateStaff } from "../../Api/apiservices";
import * as apiCalls from "../../Api/apiservices";
import { register } from "../../Api/apiservices";
import { getStaffList } from "../../Api/apiservices";
import { deleteStaff } from "../../Api/apiservices";
import { useEffect } from "react";
import { MdEdit, MdDeleteForever } from "react-icons/md";
import PaginationComponent from "../../Components/PaginationComponent";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FaUnlock, FaUserAlt } from "react-icons/fa";
import { toast } from "react-toastify";



const Registration = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [showPassword, setShowPassword] = useState(false);
  const [showconfirmPassword, setShowconfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    contact_number: "",
    email: "",
    password: "",
    confirm_password: "",
    user_id_proof: "",
    role: "staff",
    address_details: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [error, setError] = useState();
  const [passwordError, setPasswordError] = useState("");


  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
    if (!isModalVisible) {
      // resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      username: "",
      contact_number: "",
      email: "",
      password: "",
      confirm_password: "",
      user_id_proof: "",
      role: "staff",
      address_details: "",
    });
    setEditIndex(null);
  };

  useEffect(() => {
    const fetchStaffList = async (page, limit) => {
      try {
        const data = await getStaffList();
        setLimit(data.limit);
        setTotalPages(data.totalPages);
        setCurrentPage(data.page)
        setStaffList(data); // Update the staff list state
        // console.log(",.,,,.,.,",data)
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        setError('Failed to load staff data'); // Handle any errors
        setLoading(false);
      }
    };

    fetchStaffList(); // Call the fetch function
  }, [currentPage]);



  const handlenumberChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handlenameChange = (e) => {
    const { name, value } = e.target;
    // Allow alphabets and alphabets with numbers, but not only numbers
    if (/^(?!\d+$)[A-Za-z0-9]*$/.test(value)) {
    setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleemailChange = (e) => {
    const { name, value } = e.target;
  
    // Email validation regex pattern
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // Allow only valid email format  
    if (emailPattern.test(value) || value === "") {
      setFormData((prev) => ({ ...prev, [name]: value }));

    }
  };
  // const handlePasswordChange = (e) => {
  //   const { name, value } = e.target;

  //   // Allow only up to 8 characters
  //   if (value.length > 8) return;

  //   // Regex: Exactly 8 characters, must contain only letters (A-Z, a-z) and numbers (0-9), no special characters
  //   const passwordPattern = /^[A-Za-z0-9]{8}$/;

  //   setFormData((prev) => ({ ...prev, [name]: value }));

  //   if (!passwordPattern.test(value)) {
  //     setPasswordError(
  //       "Password must be exactly 8 characters and contain only letters and numbers."
  //     );
  //   } else {
  //     setPasswordError(""); // Clear error when valid
  //   }
  // };
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    // Regex: Only letters (A-Z, a-z) and numbers (0-9), no special characters
    const passwordPattern = /^[A-Za-z0-9]+$/;

    // Update state regardless of validation
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Show error message only if length exceeds 8
    if (value.length > 8) {
      setPasswordError("Password must be exactly 8 characters long.");
    } else if (!passwordPattern.test(value)) {
      setPasswordError("Password can only contain letters and numbers.");
    } else {
      setPasswordError(""); // Clear error when valid
    }
  };

  


  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   console.log("Form submitted:", formData);
  //   try {
  //     if (editIndex !== null) {
  //       const updatedStaff = await updateStaff(formData.id, formData);
  //       // console.log("Staff updated successfully", updatedStaff);
  //       if (response.status === 400) {
  //         // console.log("Staff updated successfully", response.data);
  //         alert(response.message);
  //       }
  //     } else {
  //       const response = await register(formData);
  //       if (response.status === 201) {
  //         // console.log("New staff added successfully", response.data);
  //         localStorage.setItem("authToken", response.data.token); // Storing token if needed
  //         // window.location.reload();
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error while submitting staff data:", error);
  //   }
  //   toggleModal();
  // };


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    try {
      if (editIndex !== null) {
        const updatedStaff = await updateStaff(formData.id, formData);
        if (updatedStaff.status === 400) { // Use updatedStaff, not response
          alert(updatedStaff.message);
          toast.success(updatedStaff.message);
        }
      } else {
        const response = await register(formData);
        if (response.status === 201) {
          localStorage.setItem("authToken", response.data.token);
        }
      }
    } catch (error) {
      console.error("Error while submitting staff data:", error);
      toast.error("Error while submitting staff data:",error);
      if (error.response?.status === 401) {
        // alert("Session expired. Please log in again.");
        toast.info("Session expired. Please log in again!");

        localStorage.removeItem("authToken");
        // window.location.href = "/Signin";
        window.location.reload();

      } else {
        // alert(error.response?.data?.message || "An error occurred");
        toast.error(error.response?.data?.message || "An error occurred");
      }
    }
    toggleModal();
  };

  const handleEdit = (staffId) => {
    console.log("Edit function", staffList.users)
    const selectedStaff = staffList.users.find(staff => staff.id === staffId);
    if (selectedStaff) {
      setFormData({ ...selectedStaff });
      setEditIndex(staffId);
      toggleModal();
    }
  };

  // const handleDelete = (id) => {
  //   setStaffList((prev) => prev.filter((_, i) => i !== id));
  // };
  const handleDelete = async (staffId) => {
    try {
      // Confirm before deleting
      if (window.confirm("Are you sure you want to delete this staff member?")) {
        await deleteStaff(staffId); // Call API
        setStaffList((prev) => prev.filter((staff) => staff.id !== staffId));
        toast.success("Staff deleted successfully");
        window.location.reload();
      }
    } catch (error) {
      toast.error("Failed to delete staff:", error);
    }
  };

  return (
    <div className="  rounded-lg">
      {/* Add New Staff Button */}
      <div className="mb-4 flex justify-between items-center w-[96%]">
        <h3 className="text-2xl font-semibold text-gray-700">Staff List</h3>
        <PaginationComponent
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage} />
        <button
          onClick={toggleModal}
          className="bg-[#019493] text-white py-3 px-6 rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-700"
        >
          Add New Staff
        </button>
      </div>

      {/* <table className="min-w-full border border-gray-300 shadow-sm rounded-lg overflow-hidden">
  <thead className="bg-[#019493] text-white ">
    <tr>
      <th className="px-6 py-3 text-left text-sm font-medium">Name</th>
      <th className="px-6 py-3 text-left text-sm font-medium">Email</th>
      <th className="px-6 py-3 text-left text-sm font-medium">Contact No</th>
      <th className="px-6 py-3 text-left text-sm font-medium">Role</th>
      <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
    </tr>
  </thead>
  <tbody className="divide-y divide-gray-200">
    {staffList.users && staffList.users.map((staff, id) => (
      <tr
        key={staff.id}
        className="hover:bg-gray-50 transition-colors duration-200"
      >
        <td className="px-6 py-4 text-sm text-gray-700">{staff.username}</td>
        <td className="px-6 py-4 text-sm text-gray-700">{staff.email}</td>
        <td className="px-6 py-4 text-sm text-gray-700">{staff.contact_number}</td>
        <td className="px-6 py-4 text-sm text-gray-700">{staff.role}</td>
        <td className="px-6 py-4 space-x-2">
          <button
            onClick={() => handleEdit(staff.id)}
            className="bg-yellow-500 text-white px-3 py-2 text-sm rounded-lg hover:bg-yellow-600 shadow-sm"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(staff.id)}
            className="bg-red-500 text-white px-3 py-2 text-sm rounded-lg hover:bg-red-600 shadow-sm"
          >
            Delete
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table> */}
      <div className="overflow-x-auto">
        <table className="table-fixed w-[96%] bg-white rounded-lg shadow-md text-left">
          <thead className="bg-[#027483] text-white">
            <tr>
              <th className="py-2 px-4 w-14">S.No</th>
              <th className="py-2 px-4 truncate">Name</th>
              <th className="py-2 px-4 truncate">Email</th>
              <th className="py-2 px-4">Contact No</th>
              <th className="py-2 px-4">Role</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffList.users &&
              staffList.users.map((staff, index) => (
                <tr
                  key={staff.id}
                  className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"
                    } hover:bg-gray-200 h-[90%] overflow-auto scrollbar-hidden`}
                >
                  <td className="py-2 px-4">{index + 1}</td>
                  <td className="py-2 px-4 truncate">{staff.username}</td>
                  <td className="py-2 px-4 truncate">{staff.email}</td>
                  <td className="py-2 px-4">{staff.contact_number}</td>
                  <td className="py-2 px-4">{staff.role}</td>
                  <td className="py-2 px-4 flex space-x-2">
                    <button
                      className="text-cyan-700"
                      onClick={() => handleEdit(staff.id)}
                    >
                      <MdEdit size={20} />
                    </button>
                    <button
                      className="text-cyan-700"
                      onClick={() => handleDelete(staff.id)}
                    >
                      <MdDeleteForever size={20} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>


      {/* Modal */}
      {isModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[60%]">
            <h2 className="text-2xl font-semibold text-center mb-4">
              {editIndex !== null ? "Edit Staff" : "Add New Staff"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="flex flex-wrap gap-4">

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="description"
                  >
                    Name
                  </label>

                  <input
                    type="text"
                    name="username"
                    required
                    value={formData.username}
                    onChange={handlenameChange}
                    placeholder="Name"
                    className="flex-1 min-w-[200px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-700"
                  />
                </div>

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="description"
                  >
                    Contact number
                  </label>
                  <input
                    type="text"
                    name="contact_number"
                    value={formData.contact_number}
                    onChange={handlenumberChange}
                    required
                    placeholder="Contact No"
                    className="flex-1 min-w-[200px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-700"
                    pattern="[0-9]{10}"
                    maxLength="10" // Ensures only numbers are allowed
                    onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                  />
                </div>

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="description"
                  >
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleemailChange}
                    required
                    placeholder="Email"
                    className="flex-1 min-w-[200px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-700"
                  />
                </div>

                <div className="relative">

                  <div className="mb-4 relative">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="description"
                    >
                      Password
                    </label>

                    <input
        type={showPassword ? "text" : "password"}
        name="password"
        value={formData.password}
        onChange={handlePasswordChange}
        placeholder="Password"
        required
        className="flex-1 min-w-[200px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-700 pr-10"
      />
         
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    {passwordError && (
                  <p className="text-red-500 text-sm mt-1 w-full flex absolute">{passwordError}</p>
      )}
                  </div>
                </div>

                <div className="relative">

                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="description"
                    >
                      Confirm Password
                    </label>

                    <input
                      type={showconfirmPassword ? "text" : "password"}
                      name="confirm_password"
                      value={formData.confirm_password}
                      onChange={handlePasswordChange}
                      required
                      placeholder="ConfirmPassword"
                      className="flex-1 min-w-[200px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-700"
                    />
                    <button
                      type="button"
                      onClick={() => setShowconfirmPassword(!showconfirmPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400"
                    >
                      {showconfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="description"
                  >
                    ID Proof
                  </label>
                  <input
                    type="numbers"
                    name="user_id_proof"
                    value={formData.user_id_proof}
                    onChange={handleChange}
                    required
                    placeholder="Aadhar ID"
                    className="flex-1 min-w-[200px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-700"
                    pattern="[0-9]{12}"
                    maxLength="12"// Ensures only numbers are allowed
                    onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                  />
                </div>

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="description"
                  >
                    Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    className="flex-1 min-w-[150px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-700"
                  >
                    {/* <option value="" className="w-42">Select</option> */}
                    <option value="staff" className="w-42">Staff</option>
                    {/* <option value="admin"className="w-32">Admin</option> */}
                    {/* <option value="manager">Manager</option> */}
                  </select>
                </div>

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="description"
                  >
                    Address
                  </label>
                  <textarea
                    name="address_details"
                    value={formData.address_details}
                    onChange={handleChange}
                    placeholder="Address"
                    required
                    className="flex-1 min-w-[200px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-700"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  type="button"
                  onClick={toggleModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#019493] text-white px-4 py-2 rounded-md hover:bg-cyan-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Registration;