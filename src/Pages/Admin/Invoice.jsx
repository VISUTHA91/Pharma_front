import React, { useState,useRef } from "react";
import { MdRemoveRedEye } from "react-icons/md";
import { BiSolidPrinter } from "react-icons/bi";
import { useEffect } from "react";
import {fetchInvoices, printDocument} from '../../Api/apiservices';
import PaginationComponent from "../../Components/PaginationComponent";
// import { useReactToPrint } from "react-to-print";
// import { printDocument } from "../../Api/apiservices";
import "./Invoice.css"; // Import the CSS file
import { toast } from "react-toastify";


const Invoice = () => {
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemsPerPage] = useState(10);
    const [loading,setLoading] = useState([]);
    const [error , setError] = useState([]);
    const [totalPages, setTotalPages] = useState(0); // Track total pages
    const [limit, setLimit] = useState(0); // Track total pages 
    const [currentPage, setCurrentPage] = useState(1); // Track current page

    useEffect(() => {
        const invoicelist = async () => {
          try {
            const data = await fetchInvoices(currentPage, limit);
            console.log("Invoice list",data);
            setLimit(data.limit);
            console.log("Limit",data.limit);
            setTotalPages(data.total_page);
            setCurrentPage(data.page)
            setInvoices(data.data);
          } catch (err) {
            setError("Failed to fetch invoices");
            toast.error("Failed To Fetch Invoices");
          } finally {
            setLoading(false);
          }
        };
    
        invoicelist();
      }, [currentPage]);

    const [invoices, setInvoices] = useState([]);
    const invoiceRef = useRef();
    const handleView = (invoice) => {
        setSelectedInvoice(invoice);
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedInvoice(null);
    };
    const handlePrint = async(selectedInvoiceId) => {
        console.log("Print");
        const print =  await printDocument(selectedInvoiceId);        
    };
    return (
        <div className="overflow-hidden w-full p-4">
            <div className="flex justify-between items-center ">
            <h1 className="text-2xl font-bold mb-2">Invoice List</h1>
            <PaginationComponent
              totalPages={totalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}/>
              <button
        className="bg-[#027483] text-white px-2 py-1 rounded mb-1"
        // onClick={() => setIsInvoiceModalOpen(true)}
        >
        Export
      </button>
              
            </div>
            <table className="w-full  border-gray-300 text-left mt-4">
                <thead>
                    <tr className="bg-cyan-700 text-white">
                        <th className="border border-gray-300 px-2 py-1">S.No</th>
                        <th className="border border-gray-300 px-2 py-1">Invoice No</th>
                        <th className="border border-gray-300 px-2 py-1">Date</th>
                        <th className="border border-gray-300 px-2 py-1">Amount</th>
                        <th className="border border-gray-300 px-2 py-1">Status</th>
                        <th className="border border-gray-300 px-2 py-1">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.map((invoice, index) => (
                        <tr key={invoice.id} className="">
                            <td className="border border-gray-300 px-2 py-1">{index + 1}</td>
                            <td className="border border-gray-300 px-2 py-1">{invoice.invoice_number}</td>
                            <td className="border border-gray-300 px-2 py-1">{invoice.invoice_created_at.split("T")[0]}</td>
                            <td className="border border-gray-300 px-2 py-1">{invoice.finalPriceWithGST}</td>
                            <td className="border border-gray-300 px-2 py-1">{invoice.payment_status}</td>
                            <td className="border border-gray-300 px-2 py-1">
                                <button
                                    className="text-cyan-700 px-4 py-1"
                                    onClick={() => handleView(invoice)}
                                >
                                    <MdRemoveRedEye size={20} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {isModalOpen && selectedInvoice && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-cyan-700 text-white p-6 rounded-lg w-1/2 shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Invoice Details</h2>
                            <div className="flex gap-2">
                                <button
                                    className=" text-white px-3 py-1 rounded"
                                    onClick={() => handlePrint(selectedInvoice.id)}                                >
                                    <BiSolidPrinter size={28} />
                                </button>
                                <button
                                    onClick={closeModal}
                                    className="text-white text-lg font-bold hover:text-gray-200">
                                    ✕
                                </button>
                            </div>
                        </div>
                        <div>
                            <p><strong>Invoice No:</strong> {selectedInvoice.invoice_number}</p>
                            <p><strong>Date:</strong> {selectedInvoice.invoice_created_at.split("T")[0]}</p>
                            <p><strong>Name:</strong> {selectedInvoice.customer_name}</p>
                            <p><strong>Amount:</strong> {selectedInvoice.finalPriceWithGST}</p>
                            <p><strong>Status:</strong> {selectedInvoice.payment_status}</p>
                            <p><strong>Quantity:</strong> {selectedInvoice.quantity}</p>
                            <p><strong>Status:</strong> {selectedInvoice.payment_status}</p>
                            {/* <p><strong>Status:</strong> {selectedInvoice.payment_status}</p> */}
                        </div>
                    </div>
                </div>    
            )}
        </div>
    );
};
export default Invoice;