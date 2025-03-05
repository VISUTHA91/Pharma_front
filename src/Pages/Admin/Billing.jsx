import React, { useState, useEffect } from "react";
import { createInvoice, getCategory } from "../../Api/apiservices";
import { searchProducts } from "../../Api/apiservices";
// import productlistByID from "../../Api/apiservices";
import { fetchProductbyID } from "../../Api/apiservices";
// import { set } from "react-datepicker/dist/date_utils";
import { printDocument } from "../../Api/apiservices";
import { toast } from "react-toastify";

const Billing = () => {
  const [product, setproduct] = useState([]);
  const [isInputDisabled, setIsInputDisabled] = useState(false);

  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    customer_name: "",
    dateTime: new Date().toLocaleString(),
  });
  const [selectProduct, setSelectProduct] = useState([]);
  const [products, setproducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [query, setQuery] = useState("");
  const [filteredproduct, setFilteredproduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [isPaid, setIsPaid] = useState(false);

   const handleSelect = async (product) => {
    setQuery("");
    setSelectedProduct(product);
    setFilteredproduct([]);
    try {
      const response = await fetchProductbyID(product.id);
      console.log("Full API Response:", response); // ✅ Debug full response

      const productDetails = response.data; // ✅ Fix: Access `data` inside the response
      console.log("Extracted Product Details:", productDetails); // ✅ Debug extracted data

      if (!productDetails || !productDetails.id) {
        console.error("Invalid product data:", productDetails); // 🚨 This is where the error happens
        return;
      }

      setproducts((prevproducts) => {
        const existingProduct = prevproducts.find((p) => p.id === productDetails.id);
        if (!existingProduct) {
          return [
            ...prevproducts,
            {
              product_id: productDetails.id,
              product_name: productDetails.product_name,
              product_batch_no: productDetails.product_batch_no || "N/A",
              expiry_date: productDetails.expiry_date || "N/A",
              mrp: productDetails.selling_price || 0,
              gst: productDetails.GST,
              quantity: productDetails.product_quantity,
              sellingPrice: productDetails.product_price || 0,
            },
          ];
        }
        return prevproducts;
      });
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  useEffect(() => {
    console.log("Updated Invoice Details:", products);
  }, [products]);

  // Fetch search results
  const fetchproduct = async () => {
    setLoading(true);
    const product = await searchProducts(query);
    console.log("Search API Response:", product); // ✅ Debug API response
    setFilteredproduct(product?.data || []);
    setLoading(false);
  };

  // Debounce search API call
  useEffect(() => {
    if (!query) {
      setFilteredproduct([]);
      return;
    }
    const delayDebounceFn = setTimeout(fetchproduct, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSearch = (e) => {
    setQuery(e.target.value);
  };

  useEffect(() => {
  }, [products]);
  const calculateAmount = (quantity, sellingPrice) => {
    return quantity * sellingPrice;

  }
  const handleProductAdd = (productId) => {
    const product = product.find((p) => p.product_id === productId);
    if (product) {
      setproducts([...products, product]);
    }
  };

  const handleRemoveProduct = (index) => {
    const updatedInvoice = [...products];
    updatedInvoice.splice(index, 1);
    setproducts(updatedInvoice);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleQuantityChange = (index, value) => {
    const updatedInvoice = [...products];
    const product_quantity = parseInt(value)  // Ensure it's a valid number
    updatedInvoice[index].quantity = product_quantity;
    updatedInvoice[index].amount = quantity * updatedInvoice[index].sellingPrice;
    setproducts(updatedInvoice);
    console.log("Updated Quantity:", quantity); // Debugging purpose
  };
  const handlePreview = () => {
    setModalOpen(true);
  };
  const handleConfirm = async () => {
    const invoiceData = {
      ...formData,
      products,
      payment_method: paymentMethod,
      payment_status: isPaid ? "Paid" : "Unpaid",
    };
    console.log("Products......", products)
    try {
      const response = await createInvoice(invoiceData);
      console.log("Invoice Saved:", response);
      toast.success("Bill saved Sucessfully");
      if (response && response.invoice_details.invoice_id) {
        // Call handlePrint only after invoice is successfully created
        await handlePrint(response.invoice_details.invoice_id);
      }
      setModalOpen(false);
      setFormData({ phone: "", customer_name: "", dateTime: new Date().toLocaleString() });
      setproducts([]);
    } catch (error) {
      console.error("Failed to save invoice:", error);
      alert("Failed to save invoice. Please try again.");
    }
  };

  const handlePrint = async (selectedInvoiceId) => {
    console.log("Print");
    try {
      await printDocument(selectedInvoiceId);
      console.log("Print Completed");
    } catch (error) {
      console.error("Printing failed:", error);
    }
  };
  return (
    <div className="max-w-screen-lg mx-auto mr-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Pharmacy Invoice</h1>
      {/* Customer Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
        <div>
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full border border-gray-300 px-4 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Customer Name</label>
          <input
            type="text"
            name="customer_name"
            value={formData.customer_name}
            onChange={handleInputChange}
            className="w-full border border-gray-300 px-3 py-2 rounded"
            // disabled={!!formData.customerName} // Disable if auto-filled
            // disabled={formData.customerName && isAutoFilled}
            disabled={isInputDisabled}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Date & Time</label>
          <input
            type="text"
            value={formData.dateTime}
            className="w-full border border-gray-300 px-3 py-2 rounded bg-gray-100"
            disabled
          />
        </div>
      </div>
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search product..."
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {loading && <p className="text-sm text-gray-500 mt-1">Loading...</p>}
      {filteredproduct.length > 0 && (
        <ul className="absolute p-2 bg-white border border-gray-300 mt-1 rounded-md shadow-lg max-h-40 overflow-y-auto">
          {filteredproduct.map((product) => (
            <li
              key={product.product_id}
              className="p-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelect(product)}
            >
              <div className="flex gap-4 items-center">
                <span className="font-semibold text-gray-800">{product.product_name}</span>
                <span className="text-gray-600">({product.product_quantity})</span>
                <span className="text-red-500">{product.expiry_date ? product.expiry_date.split("T")[0] : "N/A"}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div>
        <div className="max-h-64 overflow-y-auto border border-gray-300 mt-8">
          <table className="w-full border-gray-300">
            <thead>
              <tr className="bg-gray-00">
                <th className="border border-gray-300 px-2 py-1">Product Name</th>
                <th className="border border-gray-300 px-2 py-1">Batch No</th>
                <th className="border border-gray-300 px-2 py-1">Expiry Date</th>
                <th className="border border-gray-300 px-2 py-1">MRP</th>
                <th className="border border-gray-300 px-2 py-1">GST</th>
                <th className="border border-gray-300 px-2 py-1">Quantity</th>
                <th className="border border-gray-300 px-2 py-1">Amount</th>
                <th className="border border-gray-300 px-2 py-1">Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(products) &&
                products.map((product, index) => (
                  <tr key={index} className="text-sm">
                    <td className="border border-gray-300 px-2 py-1">{product.product_name}</td>
                    <td className="border border-gray-300 px-2 py-1">{product.product_batch_no}</td>
                    <td className="border border-gray-300 px-2 py-1">{product.expiry_date ? product.expiry_date.split("T")[0] : "N/A"}
                    </td>
                    <td className="border border-gray-300 px-2 py-1">{product.mrp}</td>
                    <td className="border border-gray-300 px-2 py-1">{product.gst}%</td>
                    <td className="border border-gray-300 px-2 py-1">
                      <input
                        type="number"
                        min="1"
                        value={product.product_quantity}
                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                        className="w-12 border border-gray-300 px-2 py-1 rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </td>
                    {/* <td className="border border-gray-300 px-4 py-2">{product.sellingPrice}</td> */}
                    <td className="border border-gray-300 px-4 py-2">
                      {calculateAmount(product.product_quantity, product.sellingPrice)}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        onClick={() => handleRemoveProduct(index)}
                        className="text-red-500 hover:underline">
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview and Submit */}
      <div className="mt-2 text-right">
        <button
          onClick={handlePreview}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 mr-4"
        >
          Preview
        </button>
      </div>
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg w-3/4 max-h-screen overflow-hidden">
            <div className="p-4 flex justify-between items-center border-b">
              <h2 className="text-xl font-bold">Invoice Preview</h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-600 hover:text-gray-800">
                &times;
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[75vh]">
              <p className="mb-4"><strong>Customer Name:</strong> {formData.customer_name}</p>
              <p className="mb-4"><strong>Phone Number:</strong> {formData.phone}</p>
              <p className="mb-4"><strong>Date & Time:</strong> {formData.dateTime}</p>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2">Product Name</th>
                    <th className="border border-gray-300 px-4 py-2">Batch No</th>
                    <th className="border border-gray-300 px-4 py-2">Expiry Date</th>
                    <th className="border border-gray-300 px-4 py-2">MRP</th>
                    <th className="border border-gray-300 px-4 py-2">GST</th>
                    <th className="border border-gray-300 px-4 py-2">Quantity</th>
                    <th className="border border-gray-300 px-4 py-2">Selling Price</th>
                    <th className="border border-gray-300 px-4 py-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-4 py-2">{product.product_name}</td>
                      <td className="border border-gray-300 px-4 py-2">{product.product_batch_no}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        {product.expiry_date ? product.expiry_date.split("T")[0] : "N/A"}</td>
                      <td className="border border-gray-300 px-4 py-2">{product.mrp}</td>
                      <td className="border border-gray-300 px-4 py-2">{product.gst}%</td>
                      <td className="border border-gray-300 px-4 py-2">{product.quantity}</td>
                      <td className="border border-gray-300 px-4 py-2">{product.sellingPrice}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        {calculateAmount(product.product_quantity, product.sellingPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t flex justify-end gap-4">
              <div className="flex items-center gap-2">
                <label className="text-gray-700 font-medium">Payment Method:</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="border rounded px-2 py-1">
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                </select>
              </div>

              {/* Checkbox for Payment Status */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="paidCheckbox"
                  checked={isPaid}
                  onChange={() => setIsPaid(!isPaid)}
                  className="w-4 h-4"
                />
                <label htmlFor="paidCheckbox" className="text-gray-700 font-medium">
                  Paid
                </label>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                Edit
              </button>
              <button
                onClick={handleConfirm}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>);
};
export default Billing;

{/* Modal */ }
{/* {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg w-1/2">
            <div className="p-4">
              <h2 className="text-xl font-bold mb-4">Invoice Preview</h2>
              <p className="mb-4"><strong>Customer Name:</strong> {formData.customerName}</p>
              <p className="mb-4"><strong>phone Number:</strong> {formData.phoneNumber}</p>
              <p className="mb-4"><strong>Date & Time:</strong> {formData.dateTime}</p>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2">Product Name</th>
                    <th className="border border-gray-300 px-4 py-2">Batch No</th>
                    <th className="border border-gray-300 px-4 py-2">Expiry Date</th>
                    <th className="border border-gray-300 px-4 py-2">MRP</th>
                    <th className="border border-gray-300 px-4 py-2">GST</th>
                    <th className="border border-gray-300 px-4 py-2">Quantity</th>
                    <th className="border border-gray-300 px-4 py-2">Selling Price</th>
                    <th className="border border-gray-300 px-4 py-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-4 py-2">{product.name}</td>
                      <td className="border border-gray-300 px-4 py-2">{product.batchNo}</td>
                      <td className="border border-gray-300 px-4 py-2">{product.expDate}</td>
                      <td className="border border-gray-300 px-4 py-2">{product.mrp}</td>
                      <td className="border border-gray-300 px-4 py-2">{product.gst}%</td>
                      <td className="border border-gray-300 px-4 py-2">{product.quantity}</td>
                      <td className="border border-gray-300 px-4 py-2">{product.sellingPrice}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        {calculateAmount(product.quantity, product.sellingPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 flex justify-end gap-4">
                <button
                  onClick={() => setModalOpen(false)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )} */}


       // Check for existing customer when phone number changes
    // if (name === "phoneNumber") {
    //   const customer = mockInvoiceData.find((item) => item.phoneNumber === value);
    //   if (customer) {
    //     setFormData({ ...formData, phoneNumber: value, customerName: customer.customerName });
    //     setIsInputDisabled(true);
    //   } else {
    //     setFormData({ ...formData, phoneNumber: value, customerName: "" });
    //   }
    // }