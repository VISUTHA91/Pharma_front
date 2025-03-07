import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { fetchSupplierInvoiceList } from "../../Api/apiservices";
import { createsupplierinvoice } from "../../Api/apiservices";
import { createSupplierPayment } from "../../Api/apiservices";
import { supplierById } from "../../Api/apiservices";
import {categoryListBySupplierId} from "../../Api/apiservices";
// import { fetchSupplierDetails} from '../../Api/apiservices';

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
    console.log("Supplier ID in above",supplierId); // Check if supplierId is available
    if (!supplierId) return;                
    const fetchCategories = async () => {    // Fetch supplier invoice list           
      try {
        const data = await categoryListBySupplierId(supplierId);
        setCategories(data.data);                               
        console.log("categories...........",data.data); // Log the data
      } catch (err) {
        setError(error); // Log error message
      } 
    };
    fetchCategories(); // Call the function
  }, [supplierId]); // Call the function when supplierId changes

  useEffect(() => {
    console.log("Supplier ID in above",supplierId);
    if (!supplierId) return;
    const fetchSupplier = async () => {
      try {
        const data = await fetchSupplierInvoiceList(supplierId);
        setSupplier(data.data);
        console.log("SupplierDetails",data);
      } catch (err) {
        setError("Failed to fetch supplier details");
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
    console.log("Supplier ID in below",supplierId);
    if (!supplierId) return;
    const fetchSupplierById = async () => {
      try {
        const response = await supplierById(supplierId);
        setSupplierInfo(response.data);
        console.log("SupplierDetails Info",response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch supplier.");
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

  const handlePaymentChange = (e) => {
    setPaymentForm({ ...paymentForm, [e.target.name]: e.target.value });
  };

  const handleInvoiceSubmit = async (e) => {
    // e.preventDefault();
    try {
      const response = await createsupplierinvoice(invoiceForm);
      setIsInvoiceModalOpen(false);
      setIsPaymentModalOpen(true); // Open payment modal
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
      // fetchSupplierDetails(selectedSupplier.id); // Refresh data
      fetchSupplierInvoiceList(selectedSupplier.id); // Refresh data
    } catch (error) {
      console.error("Error saving payment:", error);
      toast.error("Error saving payment:", error);
    }
  };
  const handleRowClick = (status, invoiceId) => {
    console.log("Clicked status:", status,"Invoice ID:", invoiceId);
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
      <p><span className="font-medium">GST:</span> {supplierInfo?.supplirt_gst_number}</p>
    </div>
    <div>
    <p><span className="font-medium">Address:</span> {supplierInfo?.address},{supplierInfo?.postal_code}</p>
      <p><span className="font-medium">City:</span> {supplierInfo?.city}</p>
      <p><span className="font-medium">State:</span> {supplierInfo?.state}</p>
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
        ):(<>NO Data
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
              "Date",
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
              <td className="p-2">{item.invoice_bill_date ? item.invoice_bill_date.split("T")[0]:"N/A"}</td>
              <td className="p-2">{item.bill_amount}</td>
              <td className="p-2">{item.total_paid}</td>
              <td className="p-2">{item.balance_bill_amount}</td>
              <td className="p-2">{item.due_date ? item.due_date.split("T")[0] : "N/A"}</td>
              <td className="p-2">{item.created_at ? item.created_at.split("T")[0]:"N/A"}</td>
              {/* <td className="p-2 cursor-pointer" onClick={() => handleRowClick(item.status, item.invoice_id)}>
              {item.status}
              </td> */}
              <td
  className={`p-2 cursor-pointer font-bold ${
    item.status === "Pending" ? "text-red-500" : "text-green-500"
  }`}
  onClick={() => handleRowClick(item.status, item.invoice_id)}
>
  {item.status}
</td>
            </tr>
            ))
        ):(<tr><td colSpan="9" className="p-2 text-center">No data found</td></tr>)}
        </tbody>
      </table>
      </div>
      {/* Invoice Modal */}
      <Modal isOpen={isInvoiceModalOpen} onRequestClose={() => setIsInvoiceModalOpen(false)} className="p-5 bg-white rounded shadow-lg max-w-md mx-auto mt-10">
        <div className="flex justify-between items-center mb-4">
                   <h2 className="text-lg font-bold mb-4">Create Invoice</h2>
        </div>
 
        <form onSubmit={handleInvoiceSubmit} className="space-y-3">
          <input type="text" name="supplierId" value={invoiceForm.supplierId} readOnly className="w-full border p-2 rounded" />
          <input type="text" name="supplierBillNo" placeholder="Bill No" onChange={handleInvoiceChange} className="w-full border p-2 rounded" required />
          <input type="text" name="description" placeholder="Description" onChange={handleInvoiceChange} className="w-full border p-2 rounded" required />
          <input type="number" name="totalAmount" placeholder="Total Bill Amount" onChange={handleInvoiceChange} className="w-full border p-2 rounded" required />
          <input type="date" name="invoiceDate" onChange={handleInvoiceChange} className="w-full border p-2 rounded" required  placeholder="CurrentDate"/>
          {/* <div className="relative">
  <input
    type="date"
    name="invoiceDate"
    id="invoiceDate"
    // value={invoiceDate}
    onChange={handleInvoiceChange}
    className="peer w-full border p-2 rounded placeholder-transparent"
    required
  />
  <label
    htmlFor="invoiceDate"
    className="absolute left-2 -top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-gray-500"
  >
    InvoiceDate
  </label>
</div> */}


          <input type="date" name="dueDate" onChange={handleInvoiceChange} className="w-full border p-2 rounded" required />
          <button type="submit" className="w-full bg-[#027483] text-white p-2 rounded">Submit</button>
        </form>
      </Modal>
      {/* Payment Modal */}
      <Modal isOpen={isPaymentModalOpen} onRequestClose={() => setIsPaymentModalOpen(false)} className="p-5 bg-white rounded shadow-lg max-w-md mx-auto mt-10">
        <h2 className="text-lg font-bold mb-4">Enter Payment Details</h2>
        <form onSubmit={handlePaymentSubmit} className="space-y-3">
          <input type="number" name="paymentAmount" placeholder="Amount" onChange={handlePaymentChange} className="w-full border p-2 rounded" required />
          <input type="date" name="paymentDate" onChange={handlePaymentChange} className="w-full border p-2 rounded" required />
          <button type="submit" className="w-full bg-[#027483] text-white p-2 rounded">Submit Payment</button>
        </form>
      </Modal>
    </div>
  );
};
export default SupplierDetails;