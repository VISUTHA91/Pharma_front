import React, { useEffect, useState } from "react";
import { fetchExpense } from "../../Api/apiservices";
import { addExpense } from "../../Api/apiservices";
import PaginationComponent from "../../Components/PaginationComponent";
import { toast } from "react-toastify";


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


  
  const handleInputCategoryChange = (e) => {
    const { name, value } = e.target;
    if (/^[A-Za-z]*$/.test(value)) {
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

 const handleFormSubmit = async (e) => {
    try {
      const newExpense = { ...formData, id: expenses.length + 1 ,date: formattedDate };
      const savedExpense = await addExpense(newExpense); // API call
      setExpenses((prevExpenses) => [...prevExpenses, savedExpense]); // Update state with API response
      setFormData({ category: "", amount: "", date: "", description: "" });
      setModalOpen(false);
    } catch (error) {
      console.error("Failed to add expense:", error);
    }
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
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense, index) => (
            <tr key={expense.id}>
              <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
              <td className="border border-gray-300 px-4 py-2">{expense.category}</td>
              <td className="border border-gray-300 px-4 py-2">{expense.amount}</td>
              <td className="border border-gray-300 px-4 py-2">{expense.created_at?.split("T")[0]|| ""}</td>
              <td className="border border-gray-300 px-4 py-2">{expense.description}</td>
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
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded w-full px-3 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
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