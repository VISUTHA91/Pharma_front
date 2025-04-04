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

  //  const handleSelect = async (product) => {
  //   setQuery("");
  //   setSelectedProduct(product);
  //   setFilteredproduct([]);
  //   try {
  //     const response = await fetchProductbyID(product.id);
  //     console.log("Full API Response:", response); // ✅ Debug full response

  //     const productDetails = response.data; // ✅ Fix: Access `data` inside the response
  //     console.log("Extracted Product Details:", productDetails); // ✅ Debug extracted data

  //     if (!productDetails || !productDetails.id) {
  //       console.error("Invalid product data:", productDetails); // 🚨 This is where the error happens
  //       return;
  //     }

  //     setproducts((prevproducts) => {
  //       const existingProduct = prevproducts.find((p) => p.id === productDetails.id);
  //       if (!existingProduct) {
  //         console.log("EXISTING",existingProduct)
  //         return [
  //           ...prevproducts,
  //           {
  //             product_id: productDetails.id,
  //             product_name: productDetails.product_name,
  //             product_batch_no: productDetails.product_batch_no || "N/A",
  //             expiry_date: productDetails.expiry_date || "N/A",
  //             mrp: productDetails.product_price,
  //             gst: productDetails.GST,
  //             quantity: productDetails.product_quantity,
  //             sellingPrice: productDetails.selling_price
  //           },
  //         ];
  //       }
  //       return prevproducts;
  //     });
  //   } catch (error) {
  //     console.error("Error fetching product:", error);
  //   }
  // };


  // const handleSelect = async (product) => {
  //   setQuery("");
  //   setSelectedProduct(product);
  //   setFilteredproduct([]);
  //   try {
  //     const response = await fetchProductbyID(product.id);
  //     console.log("Full API Response:", response); // ✅ Debug full response
  //     const productDetails = response.data; // ✅ Fix: Access `data` inside the response
  //     console.log("Extracted Product Details:", productDetails); // ✅ Debug extracted data
  //     if (!productDetails || !productDetails.id) {
  //       console.error("Invalid product data:", productDetails); // 🚨 This is where the error happens
  //       return;
  //     }
  //     setproducts((prevproducts) => {
  //       const existingProduct = prevproducts.find((p) => p.product_id === productDetails.id);
  //       if (existingProduct) {
  //         toast.info("This product is already selected!");
  //         console.log("This product is already selected!");
  //         return prevproducts;
  //       }  
  //       return [
  //         ...prevproducts,
  //         {
  //           product_id: productDetails.id,
  //           product_name: productDetails.product_name,
  //           product_batch_no: productDetails.product_batch_no || "N/A",
  //           expiry_date: productDetails.expiry_date || "N/A",
  //           mrp: productDetails.product_price,
  //           gst: productDetails.GST,
  //           quantity: productDetails.product_quantity,
  //           sellingPrice: productDetails.selling_price
  //         },
  //       ];
  //     });
  //   } catch (error) {
  //     console.error("Error fetching product:", error);
  //   }
  // };
  

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
  
      // 🔹 Check for duplicates BEFORE updating state
      const isDuplicate = products.some((p) => p.product_id === productDetails.id);
      if (isDuplicate) {
        toast.info("This product is already selected!");
        console.log("This product is already selected!");
        return;
      }
      setproducts((prevproducts) => [
        ...prevproducts,
        {
          product_id: productDetails.id,
          product_name: productDetails.product_name,
          product_batch_no: productDetails.product_batch_no || "N/A",
          expiry_date: productDetails.expiry_date || "N/A",
          mrp: productDetails.product_price,
          gst: productDetails.GST,
          // quantity: productDetails.product_quantity,
          quantity:"",
          sellingPrice: productDetails.selling_price
        },
      ]);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };
  
  useEffect(() => {
    console.log("Updated Invoice Details:", products);
  }, [products]);

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
    if (/^\d{0,10}$/.test(value)) {
      setFormData({ ...formData, [name]: value });
    }
  };
  const handleInputnameChange = (e) => {
    const { name, value } = e.target;
    // Allow only alphabets (uppercase and lowercase)
    if (/^[A-Za-z]*$/.test(value)) {
      setFormData({ ...formData, [name]: value });
    }
  };

  // const handleQuantityChange = (index, value) => {
  //   const updatedInvoice = [...products];
  //   const product_quantity = parseInt(value) 
  //   console.log("Updated Quantity:", product_quantity); // Debugging purpose
  //   console.log("Updated :", updatedInvoice[index].gst); // Debugging purpose
  //   const gst =  updatedInvoice[index].gst // Debugging purpose
  //   console.log("Updated After:", (gst/100)); // Debugging purpose
  //   updatedInvoice[index].quantity = product_quantity;
  //   updatedInvoice[index].amount = (product_quantity * (updatedInvoice[index].sellingPrice * (1 + gst / 100) ));
  //   setproducts(updatedInvoice);
  //   console.log("asdfghj",updatedInvoice)
  // };


  // const handleQuantityChange = (index, value) => {
  //   // Ensure value contains only numbers and is max 3 digits long
  //   if (/^\d{1,3}$/.test(value)) {
  //     const updatedInvoice = [...products];
  //     const product_quantity = parseInt(value, 10);
      
  //     console.log("Updated Quantity:", product_quantity); // Debugging
  //     console.log("Updated GST:", updatedInvoice[index].gst); // Debugging
      
  //     const gst = updatedInvoice[index].gst;
  //     console.log("GST After Calculation:", gst / 100); // Debugging
      
  //     updatedInvoice[index].quantity = product_quantity;
  //     updatedInvoice[index].amount = product_quantity * (updatedInvoice[index].sellingPrice * (1 + gst / 100));
      
  //     setproducts(updatedInvoice);
  //     console.log("Updated Invoice:", updatedInvoice);
  //   }
  // };
  
  // const handleQuantityChange = (index, value) => {
  //   if (/^\d{1,3}$/.test(value)) { // Ensures only numbers and max 3 digits
  //     const updatedInvoice = [...products];
  //     const product_quantity = parseInt(value, 10);
      
  //     const gst = updatedInvoice[index].gst;
  //     updatedInvoice[index].quantity = product_quantity;
  //     updatedInvoice[index].amount = product_quantity * (updatedInvoice[index].sellingPrice * (1 + gst / 100));
      
  //     setproducts(updatedInvoice);
  //   }
  // };
  
  // const handleQuantityChange = (index, value) => {
  //   if (/^(?:[1-9]\d{2})$/.test(value) || value === "") { // Prevents leading 0 and allows up to 3 digits
  //     const updatedInvoice = [...products];
  //     const product_quantity = parseInt(value, 10);
      
  //     const gst = updatedInvoice[index].gst;
  //     updatedInvoice[index].quantity = product_quantity;
  //     updatedInvoice[index].amount = product_quantity * (updatedInvoice[index].sellingPrice * (1 + gst / 100));
      
  //     setproducts(updatedInvoice);
  //   }
  // };

  const handleQuantityChange = (index, value) => {
    if (value === "" || /^[1-9]\d{0,2}$/.test(value)) {
      const updatedInvoice = [...products];
      const product_quantity = parseInt(value, 10);
      const gst = updatedInvoice[index].gst;
      updatedInvoice[index].quantity = product_quantity;
      updatedInvoice[index].amount = product_quantity * (updatedInvoice[index].sellingPrice * (1 + gst / 100));
      setproducts(updatedInvoice);
    }
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
  console.log("Products./////////////", products);

  return (
    <div className="max-w-screen-lg mx-auto px-4">
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
            onChange={handleInputnameChange}
            className="w-full border border-gray-300 px-3 py-2 rounded"
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
      {loading && <p className="text-sm text-gray-500 mt-1">Loading......</p>}
      {filteredproduct.length > 0 && (
        <ul className="absolute p-2 bg-white border border-gray-300 mt-1 rounded-md shadow-lg max-h-40 overflow-y-auto">
          {filteredproduct.map((product) => (
            <li
            key={product.product_id}
            className={`p-2 cursor-pointer ${
              product.product_quantity === 0 ? "cursor-not-allowed opacity-50" : "hover:bg-gray-100"
            }`}
            onClick={() => {
              if (product.product_quantity > 0) {
                handleSelect(product);
              }
            }}
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
      <div className="max-h-64 overflow-y-auto border border-gray-300 mt-8">
        <table className="w-full border-gray-300">
          <thead>
            <tr className="bg-gray-100">
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
                  <td className="border border-gray-300 px-2 py-1">{product.expiry_date ? product.expiry_date.split("T")[0] : "N/A"}</td>
                  <td className="border border-gray-300 px-2 py-1">{product.mrp}</td>
                  <td className="border border-gray-300 px-2 py-1">{product.gst}%</td>
                  <td className="border border-gray-300 px-2 py-1">
                    {/* <input
                      type="text"
                      // value={product.product_quantity}
                      required
                      maxLength={3} 
                      onChange={(e) => {
                        const value = e.target.value;
                          if (/^[1-9]\d{0,2}$/.test(value)){
                          handleQuantityChange(index, value);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (!/[\d]/.test(e.key) && e.key !== "Backspace") {
                          e.preventDefault(); // Blocks special characters & letters
                        }
                      }}
                      onPaste={(e) => {
                        const paste = e.clipboardData.getData("text");
                        if (!/^(?:[1-9]\d{0,2})$/.test(paste)) { // Prevents pasting invalid numbers
                          e.preventDefault();
                        }
                      }}
                      className="w-12 border border-gray-300 px-2 py-1 rounded"
                    /> */}
                    <input
  type="text"
  value={products[index].quantity || ""} // Ensure input reflects state
  required
  maxLength={3} 
  onChange={(e) => {
    let value = e.target.value;
    // Check if value matches 1-999
    if (value === "" || /^[1-9]\d{0,2}$/.test(value)) {
      handleQuantityChange(index, value);
    }
  }}
  onKeyDown={(e) => {
    // Allow only numbers, Backspace, and Delete
    if (!/^\d$/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete") {
      e.preventDefault(); // Block invalid characters
    }
  }}
  onPaste={(e) => {
    const paste = e.clipboardData.getData("text");
    
    // Prevent invalid pasting (only allow 1-999)
    if (!/^[1-9]\d{0,2}$/.test(paste)) {
      e.preventDefault();
    }
  }}
  className="w-12 border border-gray-300 px-2 py-1 rounded"
/>

                  </td>
                  <td className="border border-gray-300 px-4 py-2">{product.amount}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => handleRemoveProduct(index)}
                      className="text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
                <div className="mt-2 text-right">
            <button
              onClick={handlePreview}
              className={`px-6 py-2 rounded text-white ${
                formData.customer_name && formData.phone && products.length > 0 && products.every((product) => product.quantity) 
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={!(formData.customer_name && formData.phone && products.length > 0 && products.every((product) => product.quantity)
              )}
            >
              Preview
            </button>
          </div>
          {/* Preview Modal */}
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
                        {/* {calculateAmount(product.product_quantity, product.sellingPrice)} */}
                        {product.amount}
                      </td>
                    </tr>
                  ))}
                   <tr className="bg-gray-200 font-bold">
      <td className="border border-gray-300 px-4 py-2 text-right" colSpan="7">Total Amount:</td>
      <td className="border border-gray-300 px-4 py-2">
        {products.reduce((total, product) => total + (product.amount || 0), 0)}
      </td>
    </tr>
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
    </div>
  );
  
};
export default Billing;


  // return (
  //   <div className="max-w-screen-lg mx-auto mr-4">
  //     <h1 className="text-3xl font-bold mb-6 text-center">Pharmacy Invoice</h1>
  //     {/* Customer Details */}
  //     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
  //       <div>
  //         <label className="block text-sm font-medium mb-1">Phone Number</label>
  //         <input
  //           type="tel"
  //           name="phone"
  //           value={formData.phone}
  //           onChange={handleInputChange}
  //           className="w-full border border-gray-300 px-4 py-2 rounded"
  //           required
  //         />
  //       </div>
  //       <div>
  //         <label className="block text-sm font-medium mb-1">Customer Name</label>
  //         <input
  //           type="text"
  //           name="customer_name"
  //           value={formData.customer_name}
  //           onChange={handleInputnameChange}
  //           className="w-full border border-gray-300 px-3 py-2 rounded"
  //           disabled={isInputDisabled}
  //           required
  //         />
          
  //       </div>
  //       <div>
  //         <label className="block text-sm font-medium mb-1">Date & Time</label>
  //         <input
  //           type="text"
  //           value={formData.dateTime}
  //           className="w-full border border-gray-300 px-3 py-2 rounded bg-gray-100"
  //           disabled
  //         />
  //       </div>
  //     </div>
  //     <input
  //       type="text"
  //       value={query}
  //       onChange={handleSearch}
  //       placeholder="Search product..."
  //       className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  //     />
  //     {loading && <p className="text-sm text-gray-500 mt-1">Loading...</p>}
  //     {filteredproduct.length > 0 && (
  //       <ul className="absolute p-2 bg-white border border-gray-300 mt-1 rounded-md shadow-lg max-h-40 overflow-y-auto">
  //         {filteredproduct.map((product) => (
  //           <li
  //             key={product.product_id}
  //             className="p-2 cursor-pointer hover:bg-gray-100"
  //             onClick={() => handleSelect(product)}
  //           >
  //             <div className="flex gap-4 items-center">
  //               <span className="font-semibold text-gray-800">{product.product_name}</span>
  //               <span className="text-gray-600">({product.product_quantity})</span>
  //               <span className="text-red-500">{product.expiry_date ? product.expiry_date.split("T")[0] : "N/A"}</span>
  //             </div>
  //           </li>
  //         ))}
  //       </ul>
  //     )}
  //     <div>
  //       <div className="max-h-64 overflow-y-auto border border-gray-300 mt-8">
  //         <table className="w-full border-gray-300">
  //           <thead>
  //             <tr className="bg-gray-00">
  //               <th className="border border-gray-300 px-2 py-1">Product Name</th>
  //               <th className="border border-gray-300 px-2 py-1">Batch No</th>
  //               <th className="border border-gray-300 px-2 py-1">Expiry Date</th>
  //               <th className="border border-gray-300 px-2 py-1">MRP</th>
  //               <th className="border border-gray-300 px-2 py-1">GST</th>
  //               <th className="border border-gray-300 px-2 py-1">Quantity</th>
  //               <th className="border border-gray-300 px-2 py-1">Amount</th>
  //               <th className="border border-gray-300 px-2 py-1">Action</th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             {Array.isArray(products) &&
  //               products.map((product, index) => (
  //                 <tr key={index} className="text-sm">
  //                   <td className="border border-gray-300 px-2 py-1">{product.product_name}</td>
  //                   <td className="border border-gray-300 px-2 py-1">{product.product_batch_no}</td>
  //                   <td className="border border-gray-300 px-2 py-1">{product.expiry_date ? product.expiry_date.split("T")[0] : "N/A"}
  //                   </td>
  //                   <td className="border border-gray-300 px-2 py-1">{product.mrp}</td>
  //                   <td className="border border-gray-300 px-2 py-1">{product.gst}%</td>
  //                   <td className="border border-gray-300 px-2 py-1">
  //                     <input
  //                       type="number"
  //                       min="1"
  //                       value={product.product_quantity}
  //                       onChange={(e) => handleQuantityChange(index, e.target.value)}
  //                       className="w-12 border border-gray-300 px-2 py-1 rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
  //                     />
  //                   </td>
  //                   {/* <td className="border border-gray-300 px-4 py-2">{product.sellingPrice}</td> */}
  //                   <td className="border border-gray-300 px-4 py-2">
  //                     {/* {calculateAmount(product.product_quantity, product.sellingPrice)} */}
  //                     {product.amount}
  //                   </td>
  //                   <td className="border border-gray-300 px-4 py-2">
  //                     <button
  //                       onClick={() => handleRemoveProduct(index)}
  //                       className="text-red-500 hover:underline">
  //                       Remove
  //                     </button>
  //                   </td>
  //                 </tr>
  //               ))}
  //           </tbody>
  //         </table>
  //       </div>
  //     </div>

  //     {/* Preview and Submit */}
  //     <div className="mt-2 text-right">
  //       <button
  //         onClick={handlePreview}
  //         className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 mr-4"
  //       >
  //         Preview
  //       </button>
  //     </div>
  //     {modalOpen && (
  //       <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
  //         <div className="bg-white rounded-lg shadow-lg w-3/4 max-h-screen overflow-hidden">
  //           <div className="p-4 flex justify-between items-center border-b">
  //             <h2 className="text-xl font-bold">Invoice Preview</h2>
  //             <button
  //               onClick={() => setModalOpen(false)}
  //               className="text-gray-600 hover:text-gray-800">
  //               &times;
  //             </button>
  //           </div>
  //           <div className="p-4 overflow-auto max-h-[75vh]">
  //             <p className="mb-4"><strong>Customer Name:</strong> {formData.customer_name}</p>
  //             <p className="mb-4"><strong>Phone Number:</strong> {formData.phone}</p>
  //             <p className="mb-4"><strong>Date & Time:</strong> {formData.dateTime}</p>
  //             <table className="w-full border-collapse border border-gray-300">
  //               <thead>
  //                 <tr className="bg-gray-100">
  //                   <th className="border border-gray-300 px-4 py-2">Product Name</th>
  //                   <th className="border border-gray-300 px-4 py-2">Batch No</th>
  //                   <th className="border border-gray-300 px-4 py-2">Expiry Date</th>
  //                   <th className="border border-gray-300 px-4 py-2">MRP</th>
  //                   <th className="border border-gray-300 px-4 py-2">GST</th>
  //                   <th className="border border-gray-300 px-4 py-2">Quantity</th>
  //                   <th className="border border-gray-300 px-4 py-2">Selling Price</th>
  //                   <th className="border border-gray-300 px-4 py-2">Amount</th>
  //                 </tr>
  //               </thead>
  //               <tbody>
  //                 {products.map((product, index) => (
  //                   <tr key={index}>
  //                     <td className="border border-gray-300 px-4 py-2">{product.product_name}</td>
  //                     <td className="border border-gray-300 px-4 py-2">{product.product_batch_no}</td>
  //                     <td className="border border-gray-300 px-4 py-2">
  //                       {product.expiry_date ? product.expiry_date.split("T")[0] : "N/A"}</td>
  //                     <td className="border border-gray-300 px-4 py-2">{product.mrp}</td>
  //                     <td className="border border-gray-300 px-4 py-2">{product.gst}%</td>
  //                     <td className="border border-gray-300 px-4 py-2">{product.quantity}</td>
  //                     <td className="border border-gray-300 px-4 py-2">{product.sellingPrice}</td>
  //                     <td className="border border-gray-300 px-4 py-2">
  //                       {/* {calculateAmount(product.product_quantity, product.sellingPrice)} */}
  //                       {product.amount}
  //                     </td>
  //                   </tr>
  //                 ))}
  //                  <tr className="bg-gray-200 font-bold">
  //     <td className="border border-gray-300 px-4 py-2 text-right" colSpan="7">Total Amount:</td>
  //     <td className="border border-gray-300 px-4 py-2">
  //       {products.reduce((total, product) => total + (product.amount || 0), 0)}
  //     </td>
  //   </tr>
  //               </tbody>

  //             </table>
  //           </div>
  //           <div className="p-4 border-t flex justify-end gap-4">
  //             <div className="flex items-center gap-2">
  //               <label className="text-gray-700 font-medium">Payment Method:</label>
  //               <select
  //                 value={paymentMethod}
  //                 onChange={(e) => setPaymentMethod(e.target.value)}
  //                 className="border rounded px-2 py-1">
  //                 <option value="Cash">Cash</option>
  //                 <option value="UPI">UPI</option>
  //               </select>
  //             </div>
  //             {/* Checkbox for Payment Status */}
  //             <div className="flex items-center gap-2">
  //               <input
  //                 type="checkbox"
  //                 id="paidCheckbox"
  //                 checked={isPaid}
  //                 onChange={() => setIsPaid(!isPaid)}
  //                 className="w-4 h-4"
  //               />
  //               <label htmlFor="paidCheckbox" className="text-gray-700 font-medium">
  //                 Paid
  //               </label>
  //             </div>
  //             <button
  //               onClick={() => setModalOpen(false)}
  //               className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
  //               Edit
  //             </button>
  //             <button
  //               onClick={handleConfirm}
  //               className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
  //               Confirm
  //             </button>
  //           </div>
  //         </div>
  //       </div>
  //     )}
  //   </div>);
