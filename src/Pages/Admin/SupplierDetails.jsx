import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { fetchSupplierInvoiceList } from "../../Api/apiservices";
import { createsupplierinvoice } from "../../Api/apiservices";
import { createSupplierPayment } from "../../Api/apiservices";
import { supplierById } from "../../Api/apiservices";
import { categoryListBySupplierId } from "../../Api/apiservices";
// import { fetchSupplierDetails} from '../../Api/apiservices';
import { useNavigate } from "react-router-dom";


Modal.setAppElement("#root");

const SupplierDetails = ({ selectedSupplier }) => {
  const [supplierData, setSupplierData] = useState([]);
  const [supplierInfo, setSupplierInfo] = useState([]);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const { supplierId } = useParams(); // Get supplierId from URL
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [placeholder, setPlaceholder] = useState("Enter Invoice Date (DD/MM/YYYY)"); // Custom placeholder
  const navigate = useNavigate();


  const [invoiceForm, setInvoiceForm] = useState({
    supplierId: supplierId || "",
    supplierBillNo: "",
    description: "",
    totalAmount: "",
    invoiceDate: "",
    dueDate: "",
  });
  const [paymentForm, setPaymentForm] = useState({
    invoiceId: "",
    paymentAmount: "",
    paymentDate: "",
  });

  useEffect(() => {
    console.log("Supplier ID in above", supplierId);
    if (!supplierId) return;
    const fetchCategories = async () => {
      try {
        const data = await categoryListBySupplierId(supplierId);
        setCategories(data.data);
        console.log("categories...........", data.data);
      } catch (err) {
        // setError(error); // Log error message
      }
    };
    fetchCategories(); // Call the function
  }, [supplierId]); // Call the function when supplierId changes

  useEffect(() => {
    console.log("Supplier ID in above", supplierId);
    if (!supplierId) return;
    const fetchSupplier = async () => {
      try {
        const data = await fetchSupplierInvoiceList(supplierId);
        setSupplier(data.data);
        console.log("SupplierDetails", data);
      } catch (err) {
        // setError("Failed to fetch supplier details");
        // toast.error(error);

      } finally {
        setLoading(false);
      }
    };
    fetchSupplier();
  }, [supplierId]);

  // const fetchSupplierDetails = async (supplierId) => {
  //   try {
  //     const response = await axios.get(`/api/supplier/${supplierId}/invoices`);
  //     setSupplierData(response.data);
  //   } catch (error) {
  //     console.error("Error fetching supplier details:", error);
  //   }
  // };


  useEffect(() => {
    console.log("Supplier ID in below", supplierId);
    if (!supplierId) return;
    const fetchSupplierById = async () => {
      try {
        const response = await supplierById(supplierId);
        setSupplierInfo(response.data);
        console.log("SupplierDetails Info", response.data);
      } catch (err) {
        setError("Failed to fetch supplier.");
      } finally {
        setLoading(false);
      }
    };
    if (supplierId) {
      fetchSupplierById();
    }
  }, [supplierId]);

  const handleInvoiceChange = (e) => {
    setInvoiceForm({ ...invoiceForm, [e.target.name]: e.target.value });
  };
//   const handleInvoiceBillChange = (e) => {
//     let value = e.target.value;

//     // Remove special characters (only allow letters and numbers)
//     value = value.replace(/[^a-zA-Z0-9]/g, "");

//     // Allow first character as an alphabet but require at least one number
//     if (/^[a-z0-9][a-zA-Z]*$/.test(value) && !/\d/.test(value)) {
//         return; // Do nothing if it has only alphabets without a number
//     }

//     // Update state while preserving other form fields
//     setInvoiceForm({ ...invoiceForm, [e.target.name]: value });
// };



  const handlePaymentChange = (e) => {
    setPaymentForm({ ...paymentForm, [e.target.name]: e.target.value });
  };

  const handleInvoiceSubmit = async (e) => {
    e.preventDefault();
    const { supplierBillNo } = invoiceForm;
    if (!/\d/.test(supplierBillNo)) {
        toast.info("Supplier Bill No must contain at least one number!"); // Replace with modal if needed
        return;
    }
    try {
      const response = await createsupplierinvoice(invoiceForm);
      setIsInvoiceModalOpen(true);
      toast.success("Invoice created successfully!");
      setIsPaymentModalOpen(true);
      setPaymentForm({ ...paymentForm, invoiceId: response.invoiceId });
    } catch (error) {
      console.error("Error saving invoice:", error);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSupplierPayment(paymentForm);
      setIsPaymentModalOpen(false);
      toast.success("Payment saved successfully!");
      // fetchSupplierInvoiceList(selectedSupplier.id); // Refresh data
      setTimeout(() => {
        navigate(0);
      }, 1000);
    } catch (error) {
      toast.error("Error saving payment:", error);
      // window.location.reload();
    }

  };

  const handleRowClick = (status, invoiceId) => {
    console.log("Clicked status:", status, "Invoice ID:", invoiceId);
    if (status === "Pending") {
      setIsPaymentModalOpen(true); // Open payment modal
      setSelectedInvoiceId(invoiceId);  // If you need to store the invoiceId for further actions
      setPaymentForm({ ...paymentForm, invoiceId: invoiceId });
    }
  };

  return (
    <div className="p-1">
      {supplierInfo ? (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-2 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">{supplierInfo?.company_name}</h2>

          <div className="grid grid-cols-3 gap-4 text-gray-700">
            <div>
              <p><span className="font-medium">Email:</span> {supplierInfo?.email}</p>
              <p><span className="font-medium">Phone:</span> {supplierInfo?.phone_number}</p>
              <p><span className="font-medium">GST:</span> {supplierInfo?.supplier_gst_number}</p>
            </div>
            <div>
              <p><span className="font-medium">Address:</span> {supplierInfo?.address},{supplierInfo?.postal_code}</p>
              {/* <p><span className="font-medium">City:</span> {supplierInfo?.city}</p>
              <p><span className="font-medium">State:</span> {supplierInfo?.state}</p> */}
            </div>
            <div>
              <h3 className="text-lg font-semibold ">Categories : </h3>
              {Array.isArray(categories?.data) ? (
                categories.data.map((cat) => (
                  <div key={cat}>
                    <p>{cat}</p>
                  </div>
                ))
              ) : (
                <>No Data</>
              )}
            </div>

          </div>
        </div>
      ) : (<>NO Data
      </>)}
      {/* </div> */}
      <button
        className="bg-[#027483] text-white px-2 py-2 rounded mb-4"
        onClick={() => setIsInvoiceModalOpen(true)}>
        Create Invoice
      </button>
      {/* <div className=" h-[50vh] overflow-x-auto"> */}
      <div className="h-[50vh] overflow-x-auto scroll-none">

        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-[#027483]">
            <tr>
              {[
                "Invoice ID",
                "Bill No",
                " Invoice Date",
                "Total Bill Amount",
                "Paid Amount",
                "Balance",
                "Due Date",
                "Payment Date",
                "Status",
              ].map((header) => (
                <th key={header} className="border p-2  text-white">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(supplier) ? (
              supplier.map((item) => (
                <tr key={item.invoiceId} className="border">
                  {/* <td className="px-2">{item.company_name}</td> */}
                  <td className="p-2">{item.invoice_id}</td>
                  <td className="p-2">{item.supplier_bill_no}</td>
                  <td className="p-2">{item.invoice_bill_date ? new Date(item.invoice_bill_date).toLocaleDateString("en-GB") : "N/A"}</td>
                  <td className="p-2">{item.bill_amount}</td>
                  <td className="p-2">{item.total_paid}</td>
                  <td className="p-2">{item.balance_bill_amount}</td>
                  {/* <td className="p-2">{item.due_date ? item.due_date.split("T")[0] : "N/A"}</td> */}
                  <td className="p-2">{item.due_date
                    ? new Date(item.due_date).toLocaleDateString("en-GB") // Converts to DD/MM/YYYY
                    : "N/A"}</td>
                  <td className="p-2">{item.created_at ? new Date(item.created_at).toLocaleDateString("en-GB") : "N/A"}</td>
                  {/* <td className="p-2 cursor-pointer" onClick={() => handleRowClick(item.status, item.invoice_id)}>
              {item.status}
              </td> */}
                  <td
                    className={`p-2 cursor-pointer font-bold ${item.status === "Pending" ? "text-red-500" : "text-green-500"
                      }`}
                    onClick={() => handleRowClick(item.status, item.invoice_id)}
                  >
                    {item.status}
                  </td>
                </tr>
              ))
            ) : (<tr><td colSpan="9" className="p-2 text-center">No data found</td></tr>)}
          </tbody>
        </table>
      </div>
      {/* Invoice Modal */}
      <Modal isOpen={isInvoiceModalOpen} onRequestClose={() => setIsInvoiceModalOpen(false)} className="p-5 bg-white rounded shadow-lg min-w-[50%] max-w-md mx-auto mt-2">
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-lg font-bold">Create Supplier Invoice</h2>
          <button
            onClick={() => setIsInvoiceModalOpen(false)}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleInvoiceSubmit} className="space-y-2">
          <lable className="hidden">Supplier Id</lable>
          <input type="text" name="supplierId" value={invoiceForm.supplierId} readOnly className="w-full border p-2 rounded hidden" />
          <input type="text" name="supplierBillNo" placeholder="Bill No(max 10 char)" onChange={handleInvoiceChange}
            onInput={(e) => (e.target.value = e.target.value.replace(/[^a-zA-Z0-9]/g, ""))}
            className="w-full border p-2 rounded" required maxLength={10} />
          <input type="text" 
          name="Product Name"
           onChange={handleInvoiceChange} 
           className="w-full border p-2 rounded"
           required 
           maxLength={250} 
           placeholder="Description (max 250 char)"
          onInput={(e) => {
            if (e.target.value.length === 1 && /[^a-zA-Z0-9]/.test(e.target.value)) {
              e.target.value = "";
            }
          }} 
          onKeyDown={(e) => {
            if (["+", "-"].includes(e.key)) {
              e.preventDefault();
            }
          }}/>
          <input type="number" name="totalAmount" placeholder="Total Bill Amount" onChange={handleInvoiceChange} className="w-full border p-2 rounded"
            onInput={(e) => {
              if (e.target.value.startsWith("0")) {
                e.target.value = ""; // Clear input if first character is "0"
              }
              if (e.target.value.length > 8) {
                e.target.value = e.target.value.slice(0, 8); // Limit input to 8 digits
              }
            }} 
            onKeyDown={(e) => {
              if (["+", "-"].includes(e.key)) {
                e.preventDefault();
              }
              if (e.key === "ArrowDown" && e.target.value <= 0) {
                e.preventDefault();
              }
            }}
            required />
          <label htmlFor="dueDate" className="block text-gray-700 font-sm">
            Invoice Date
          </label>
          <input type="date" name="invoiceDate" onChange={handleInvoiceChange} className="w-full border p-2 rounded" required placeholder="CurrentDate" max={new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString().split("T")[0]}  
           onKeyDown={(e) => e.preventDefault()} // Prevent typing/editing
          />
          <label htmlFor="dueDate" className="block text-gray-700 font-sm mb-1">
            Due Date
          </label>
          <input type="date" name="dueDate" onChange={handleInvoiceChange} className="w-full border p-2 rounded" required   min={new Date().toISOString().split("T")[0]} onKeyDown={(e) => e.preventDefault()} // Prevent typing/editing

          />
          <button type="submit" className="w-full bg-[#027483] text-white p-2 rounded">Submit</button>
        </form>
      </Modal>
      {/* Payment Modal */}
      <Modal isOpen={isPaymentModalOpen} onRequestClose={() => setIsPaymentModalOpen(false)} className="p-5 bg-white rounded shadow-lg max-w-md mx-auto mt-10 mr-56">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold mb-4">Pending Payment Form</h2>
          <button
            // onClick={() => setIsPaymentModalOpen(false)
            //   setIsInvoiceModalOpen(false)
            // }
            onClick={() => {
              setIsPaymentModalOpen(false);
              setIsInvoiceModalOpen(false);
            }}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handlePaymentSubmit} className="space-y-3">
        <label htmlFor="paymentAmount" className="block text-gray-700 font-sm">
            Amount
          </label>
          <input type="number" name="paymentAmount" placeholder="Amount" onChange={handlePaymentChange} className="w-full border p-2 rounded" 
          onInput={(e) => {
            if (e.target.value.startsWith("0")) {
              e.target.value = ""; // Clear input if first character is "0"
            }
            if (e.target.value.length > 8) {
              e.target.value = e.target.value.slice(0, 8); // Limit input to 8 digits
            }
          }}
          onKeyDown={(e) => {
            if (["+", "-"].includes(e.key)) {
              e.preventDefault();
            }
           
          }} 
          min={1}
          />
          <label htmlFor="paymentDate" className="block text-gray-700 font-sm">
            Payment Date
          </label>
          <input type="date" name="paymentDate" onChange={handlePaymentChange} className="w-full border p-2 rounded" 
          onKeyDown={(e) => e.preventDefault()} // Prevent typing/editing
          />
          <button type="submit" className="w-full bg-[#027483] text-white p-2 rounded">Submit Payment</button>
        </form>
      </Modal>
    </div>
  );
};
export default SupplierDetails;