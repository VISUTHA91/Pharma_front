import React, { useEffect, useState } from "react";
import { fetchExpense } from "../../Api/apiservices";
import { addExpense } from "../../Api/apiservices";
import PaginationComponent from "../../Components/PaginationComponent";
import { toast } from "react-toastify";
import { MdDeleteForever } from "react-icons/md";
import { deleteexpense } from "../../Api/apiservices";



const Expense = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading , setLoading] = useState([]);
  const [error , setError] = useState([]);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  
     useEffect(() => {
          const expenselist = async () => {
            try {
              const data = await fetchExpense(currentPage, limit);
              setExpenses(data.data.data);
              setLimit(data.data.limit);
              setTotalPages(data.data.totalPages);
              setCurrentPage(data.data.currentPage)
            } catch (err) {
              setError("Failed to fetch invoices");
            } finally {
              setLoading(false);
            }
          };
          expenselist();
        }, [currentPage]);
  const [modalOpen, setModalOpen] = useState(false);  
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    date: "",
    description: "",
  });
  const [year, month, day] = formData.date.split("-");
  const formattedDate = `${day}-${month}-${year}`;


  
  // const handleInputCategoryChange = (e) => {
  //   const { name, value } = e.target;
  //   if (/^[A-Za-z]*$/.test(value)) {
  //     setFormData({ ...formData, [name]: value });
  //   }
  // };
  const handleInputCategoryChange = (e) => {
    const { name, value } = e.target;
  
    // Regular expression to allow only alphabets and numbers
    // Ensures the first character is NOT a special character
    if (/^[A-Za-z0-9][A-Za-z0-9\s]*$/.test(value) || value === "") {
      setFormData({ ...formData, [name]: value });
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    // Allow only numbers (digits 0-9), prevent spaces, alphabets, and special characters
    if (/^\d*$/.test(value)) {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleDateInputChange = (e) => {
    let { name, value } = e.target;
  
    const formattedDate = new Date(value).toISOString().split("T")[0];
    value = formattedDate;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 const handleFormSubmit = async (e) => {
  e.preventDefault(); // Prevents the page from reloading
    try {
      const newExpense = { ...formData, id: expenses.length + 1 ,date: formattedDate };
      console.log(newExpense);
      const savedExpense = await addExpense(newExpense); // API call
      setExpenses((prevExpenses) => [...prevExpenses, savedExpense]); // Update state with API response
      setFormData({ category: "", amount: "", date: "", description: "" });
      setModalOpen(false);
        toast.success("Expense Created Successfully!");
              setTimeout(() => {
                // window.location.reload();
              }, 1500);
    } catch (error) {
      console.error("Failed to add expense:", error);
    }
  };

   const handleDelete = async (expenseId) => {
     const confirmDeletion = async () => {
       try {
         await deleteexpense(expenseId);
         toast.success("Deleted successfully!");
         setExpenses((prevProducts) =>
           prevProducts.filter((product) => product.id !== expenseId)
         );
       } catch (error) {
        //  console.error("Failed to delete Product:", error);
         toast.error("Failed to Delete");
       }
     };
     const ConfirmToast = ({ closeToast }) => (
       <div>
         <p>Are you sure you want to delete this category?</p>
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




  return (
    <div className="p-4 h-screen">
            <div className="flex justify-between items-center mb-1 ">
      <h1 className="text-2xl font-bold">Expense Tracker</h1>
        <PaginationComponent
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage} />
        <button
          onClick={() => setModalOpen(true)}
          className="bg-cyan-700 text-white px-4 py-2 rounded hover:bg-cyan-900"
        >
          Add New Expense
        </button>
      </div>
      <table className="table-auto w-full border-collapse border border-gray-300 text-left">
        <thead>
          <tr className="bg-cyan-700 text-white">
            <th className="border border-gray-300 px-4 py-2">S.No</th>
            <th className="border border-gray-300 px-4 py-2">Category</th>
            <th className="border border-gray-300 px-4 py-2">Amount</th>
            <th className="border border-gray-300 px-4 py-2">Date</th>
            <th className="border border-gray-300 px-4 py-2">Description</th>
            <th className="border border-gray-300 px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense, index) => (
            <tr key={expense.id}>
              <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
              <td className="border border-gray-300 px-4 py-2">{expense.category}</td>
              <td className="border border-gray-300 px-4 py-2">{expense.amount}</td>
              <td className="border border-gray-300 px-4 py-2"> {expense.date
    ? new Date(expense.date).toLocaleDateString('en-GB')
    : ""}</td>
              <td className="border border-gray-300 px-4 py-2">{expense.description}</td>
              <td className="border border-gray-300 px-4 py-2"><button
                                  className="text-cyan-700 ml-2"
                                  onClick={() => handleDelete(expense.id)}
                                >
                                  <MdDeleteForever size={20} />
                                </button>
                                </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Add New Expense</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Reason</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputCategoryChange}
                  className="border border-gray-300 rounded w-full px-3 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  // onChange={handleInputChange}
                  onChange={(e) => {
                    if (e.target.value.length <= 8) {
                      handleInputChange(e);
                    }
                  }}
                  className="border border-gray-300 rounded w-full px-3 py-2"
                  onKeyDown={(e) => {
                    if (e.key === "0" && e.target.value.length === 0) {
                      e.preventDefault(); // Prevent typing "0" as the first character
                    }
                  }}
                  required
                  // maxLength={5}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleDateInputChange}
                  max={new Date().toISOString().split("T")[0]} // Restricts selection to today or past dates

                  className="border border-gray-300 rounded w-full px-3 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputCategoryChange}
                  className="border border-gray-300 rounded w-full px-3 py-2"
                  required
                ></textarea>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expense;