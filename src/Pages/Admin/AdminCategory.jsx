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
// import { toast } from 'react-toastify';
import { MdRemoveRedEye } from "react-icons/md";
import { getCategoryById } from '../../Api/apiservices';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { confirmToast } from 'react-confirm-toast';


function AdminCategory() {
  const [categories, setCategories] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [category_description, setCategory_description] = useState("");
  const [description, setDescription] = useState("");
  const [showEditModal, setShowEditModal] = useState(false); // For modal visibility
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [limit, setLimit] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [totalPages, setTotalPages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [viewCategory, setViewCategory] = useState(false);
  const navigate = useNavigate();



  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const staticCategories = await getCategory(currentPage, limit);
        setLimit(staticCategories.limit);
        setTotalPages(staticCategories.totalPages);
        setCurrentPage(staticCategories.page)
        setCategories(staticCategories.data);
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
    e.preventDefault();
    try {
      console.log("Category:", categoryName);
      console.log("Description:", description);
      const newCategory = {
        category_name: categoryName,
        description: description,
      };
      const response = await createCategory(newCategory); 
      setCategories((prev) => [...prev, response]); 
      setCategoryName("");
      setDescription("");
      setShowCreateForm(false);
      toast.success("Category Created successfully:", response);
      setTimeout(() => {
        navigate(0);
      }, 2500);
    } catch (error) {
      toast.error("Error Creating Category : ", error)
    }
  };
 
  const [query, setQuery] = useState("");
  const handleSearch = () => {
    if (query.trim() !== "") {
      onSearch(query);
    }
  };

  // const handleDelete = async (categoryId) => {
  //   const isConfirmed = window.confirm("Are you sure you want to delete this category?");
  //   if (!isConfirmed) return;
  //   try {
  //     await deleteCategory(categoryId);
  //     setCategories(categories.filter(category => category.id !== categoryId));
  //     toast.success("Category Deleted Sucessfully!");
  //     setTimeout(() => {
  //       navigate(0); 
  //     }, 1500);
  //   } catch (error) {
  //     toast.error("Error : ", error);
  //   }
  // };



  // const handleDelete = async (categoryId) => {
  //   confirmToast({
  //     message: 'Are you sure you want to delete this category?',
  //     onConfirm: async () => {
  //       try {
  //         await deleteCategory(categoryId);
  //         setCategories((categories) =>
  //           categories.filter((category) => category.id !== categoryId)
  //         );
  //         toast.success('Category Deleted Successfully!');
  //         setTimeout(() => {
  //           navigate(0);
  //         }, 1500);
  //       } catch (error) {
  //         toast.error(`Error: ${error.message}`);
  //       }
  //     },
  //     onCancel: () => {
  //       toast.info('Deletion cancelled.');
  //     },
  //     confirmText: 'Yes',
  //     cancelText: 'No',
  //   });
  // };

  // const handleDelete = async (categoryId) => {
  //   const confirmDeletion = () => {
  //     deleteCategory(categoryId)
  //       .then(() => {
  //         setCategories((categories) =>
  //           categories.filter((category) => category.id !== categoryId)
  //         );
  //         toast.success('Category Deleted Successfully!');
  //         setTimeout(() => {
  //           navigate(0);
  //         }, 1500);
  //       })
  //       .catch((error) => {
  //         toast.error(`Error: ${error.message}`);
  //       });
  //   };
  
  //   const CancelButton = ({ closeToast }) => (
  //     <button
  //       onClick={closeToast}
  //       className="bg-gray-500 text-white px-3 py-1 rounded"
  //     >
  //       No
  //     </button>
  //   );

  //   toast.warn(
  //     <div>
  //       <p>Are you sure you want to delete this category?</p>
  //       <div className="flex gap-2 mt-2">
  //         <button
  //           onClick={() => {
  //             confirmDeletion();
  //             toast.dismiss();
  //           }}
  //           className="bg-red-500 text-white px-3 py-1 rounded"
  //         >
  //           Yes
  //         </button>
  //         <CancelButton />
  //       </div>
  //     </div>,
  //     {
  //       autoClose: false,
  //       closeOnClick: false,
  //       closeButton: false,
  //     }
  //   );
  // };
  
  
  const handleDelete = async (categoryId) => {
    const confirmDeletion = async () => {
      try {
        await deleteCategory(categoryId);
        setCategories((categories) =>
          categories.filter((category) => category.id !== categoryId)
        );
        toast.success('Category Deleted Successfully!');
        setTimeout(() => {
          navigate(0);
        }, 1500);
      } catch (error) {
        toast.error(`Error: ${error.message}`);
      }
    };
  
    const ConfirmToast = ({ closeToast }) => (
      <div>
        <p>Are you sure you want to Delete this Category?</p>
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button
            onClick={() => {
              confirmDeletion();
              closeToast();
            }}
            style={{ backgroundColor: '#d9534f', color: '#fff', padding: '5px 10px', borderRadius: '5px' }}
          >
            Yes
          </button>
          <button
            onClick={closeToast}
            style={{ backgroundColor: '#5bc0de', color: '#fff', padding: '5px 10px', borderRadius: '5px' }}
          >
            No
          </button>
        </div>
      </div>
    );
  
    toast.warn(<ConfirmToast />, {
      autoClose: false,
      closeOnClick: false,
      closeButton: false,
    });
  };




  const handleOpenEditModal = (category) => {
    if (!category) return;
    setCategoryName(category.category_name ||""); 
    setCategory_description(category.description || "");
    setSelectedCategory(category);
    setShowEditModal(true);
  };

  useEffect(() => {
    if (showEditModal && selectedCategory) {
      setCategoryName(selectedCategory.category_name);
      setCategory_description(selectedCategory.description);
    }
  }, [showEditModal]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        category_name: categoryName,
        description: category_description
      };
      await updateCategory(selectedCategory.id, updatedData);
      setShowEditModal(false);
      toast.success("Category Updated Sucessfully !");
      setTimeout(() => {
        navigate(0); 
      }, 1500);
    } catch (error) {
      toast.error("Failed to Update Category !");
    }
  };
  const handleView = async (categoryId) => {
    try {
      const response = await getCategoryById(categoryId);
      setShowModal(true);
      setViewCategory(response)
    }
    catch (error) {
      toast.error("Error : ", error);
    }
  };
  const closeModal = () => {
    setShowModal(false);
    setSelectedCategory(null);
  };
  console.log("Categories.....",categories);

  return (
    <div className="m-2">
      <div className="flex justify-between items-center w-[96%]">
        <h1 className="text-xl font-bold ml-2">Category List</h1>
        <div className="flex items-center">
          {/* <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="CategoryName"
                    className="px-1 py-1 w-64 focus:outline-none rounded-l"
                  /> 
                   <button
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
            <FcPlus size={28} title="Add New Category" />
          </button>
        </div>
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
          { categories && categories.length > 0 ? (
           categories.map((category, index) => (
            <tr
              key={category.id}
              className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} hover:bg-gray-200`}
            >
              <td className="py-2 px-4">{index + 1}</td>
              <td className="py-2 px-4 overflow-hidden truncate">{category.category_name}</td>
              <td className="py-2 px-4 overflow-hidden truncate">{category.description}</td>
              <td className="py-2 px-28 flex gap-4">
                <button
                  className="text-cyan-700 "
                  onClick={() => handleView(category.id)}
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
          ))) :(<tr>
            <td colSpan="4" className="text-center py-4 text-gray-500">
              No data found.
            </td>
          </tr>)}
        </tbody>
      </table>
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg w-1/2 h-68">
            <h2 className="text-xl font-bold">Edit Category</h2>
            <form onSubmit={handleEditSubmit}>
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
                    const regex = /^(?=.*[A-Za-z])[A-Za-z0-9][A-Za-z0-9\s.&-]{0,23}$/;
                    if (value === "" || regex.test(value)) {
                      setCategoryName(value);
                    }
                  }}
                className="mt-2 p-2 border rounded w-full"
                maxLength={50}
                minLength={3}
                placeholder='Name(25 characters Only)'
                required
              />
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="category_description"
                >
                  Description
                </label>
                <input
                  type="text"
                  id="category_description"
                  value={category_description}
                  placeholder='Description(250 characters Only)'
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || /^(?=.*[A-Za-z])[A-Za-z0-9](?:[A-Za-z0-9\s.-]*[A-Za-z0-9.]?)?$/.test(value)) {
                      setCategory_description(value);
                    }
                  }}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 text-top focus:outline-none focus:shadow-outline"
                  required
                  maxLength={250}
                />
              </div>
              <div className="flex justify-between">
                <button
                type="button"
                onClick={() => {
                  setShowEditModal(false);
                  setTimeout(() => {
                    navigate(0);
                  }, 100); 
                }}
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
                  onChange={(e) => {
                    const value = e.target.value;
                    const regex = /^(?=.*[A-Za-z])[A-Za-z0-9][A-Za-z0-9\s.&-]{0,23}$/;
                    if (value === "" || regex.test(value)) {
                      setCategoryName(value);
                    }
                  }}
                  placeholder='Name(50 characters Only)'                  
                  className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                  required
                  maxLength={50}
                  minLength={3}
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
                    if (value === "" || /^(?=.*[A-Za-z])[A-Za-z0-9](?:[A-Za-z0-9\s.-]*[A-Za-z0-9.]?)?$/.test(value)) {
                      setDescription(value);
                    }
                  }}
                  className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                  required
                  maxLength={250}
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setTimeout(() => {
                      // window.location.reload();
                      navigate(0); // Soft refresh of the current page
                    }, 100); // Small delay to ensure state updates before reload
                  }}
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
      {showModal && viewCategory && categories &&  (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-2/3 max-w-4xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center bg-cyan-700 text-white px-6 py-4 rounded-t-xl">
              <h2 className="text-2xl font-semibold">Product Details</h2>
            </div>
            <div className="p-6 space-y-4 text-gray-800 ">
          
                    {categories?.data && (
          (() => {
            const categoryDetails = categories?.data?.find(cat => cat.cat_auto_gen_id === viewCategory.cat_auto_gen_id);
            return categoryDetails ? (
              <>
                <p><strong>Category Name:</strong> {categoryDetails.category_name}</p>
                <p><strong>Category ID:</strong> {categoryDetails.cat_auto_gen_id}</p>
                <p><strong>Created Date:</strong> {categoryDetails.created_at ? categoryDetails.created_at.split("T")[0] : "N/A"}</p>
                <p><strong>Description:</strong></p>
                <p className="bg-gray-100 p-3 rounded-md text-sm">{categoryDetails.description}</p>
              </>
            ) : (
              <p className="text-red-500">Category details not found</p>
            );
          })()
        )}
             
              {viewCategory.data && viewCategory.data.length > 0 && (
                  <div>
                    <strong className="font-semibold">Products:</strong>
                    <ul className="ml-16">
                      {viewCategory.data.map((product, index) => (
                        <li key={index}>{product.product_name} - {product.product_quantity}</li>
                      ))}
                    </ul>
                  </div>
                )}
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

  {/* {categories && categories.map((category, index) => (
              <div className="grid grid-cols-2 gap-4"   
              key={category.id}
              >
                <p>
                  <strong className="font-semibold"> Category Name :</strong> {category.category_name}
                </p>
                <p>
                  <strong className="font-semibold">Category ID :</strong> {category.cat_auto_gen_id
                  }
                </p>
                <p>
                  <strong className="font-semibold">Created Date :</strong> {category.created_at ? category.created_at.split("T")[0] : "N/A"}
                </p>
                <div>
                <p>
                  <strong className="font-semibold">Description :</strong>
                </p>
                <p className="bg-gray-100 p-3 rounded-md text-sm">{category.description}</p>
              </div>
              </div>
            ))} */}