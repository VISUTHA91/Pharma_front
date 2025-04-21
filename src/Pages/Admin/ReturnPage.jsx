import React, { useState } from 'react';
import {returnCustomerproducts} from '../../Api/apiservices';
import {useEffect} from 'react';
import { fetchProductsByInvoice } from '../../Api/apiservices';
import PaginationComponent from '../../Components/PaginationComponent';
import { submitReturnRequest } from '../../Api/apiservices';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


const ReturnPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [invoiceData, setInvoiceData] = useState([]);
      const [totalPages, setTotalPages] = useState(0); // Track total pages
      const [limit, setLimit] = useState(0); // Track total pages 
      const [currentPage, setCurrentPage] = useState(1); // Track current page
      const navigate = useNavigate();


  useEffect(() => {
    const fetchReturnProducts = async () => {
      const response = await returnCustomerproducts( currentPage,limit);  
      console.log("Page data",response);
      setReturns(response.data);
      setCurrentPage(response.currentPage)
      setLimit(response.limit)
      setTotalPages(response.totalPages)
    };
    fetchReturnProducts();
  }, [currentPage]);

  //   const [formData, setFormData] = useState({
  //   invoiceNo: '',
  //   selectedProduct: '',
  //   quantity: '',
  //   reason: '',
  //   });

  // const [products, setProducts] = useState([]);

  // const handleInvoiceChange = (e) => {
  //   const invoiceNo = e.target.value;
  //   setFormData({ ...formData, invoiceNo });
  //   setProducts(invoiceData[invoiceNo] || []); // Load products for the entered Invoice ID
  // };

  // const handleInvoiceChange = async (e) => {
  //   const invoiceNo = e.target.value;
  //   setFormData((prev) => ({ ...prev, invoiceNo }));
  //   if (invoiceNo.trim() !== "") {
  //     const data = await fetchProductsByInvoice(invoiceNo);
  //     console.log(";.;,.;,;.,..",data.products)
  //     setProducts(data.products);
  //   } else {
  //     setProducts([]); // Clear product list if input is empty
  //   }
  // };
  // console.log("FEtch products by invoice Id",)
  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value });
  // };

  // const handleFormSubmit = async (e) => {
  //   e.preventDefault();
  
  //   if (selectedProducts.length === 0) {
  //     console.error("No products selected for return");
  //     return;
  //   }
  
  //   const returnedProducts = selectedProducts.map((product) => ({
  //     product_id: product.productId,
  //     quantity: parseInt(product.quantity, 10),
  //     return_reason: product.reason,
  //   }));
  
  //   const returnData = {
  //     invoice_id: parseInt(formData.invoiceNo, 10),
  //     returnedProducts,
  //   };
  
  //   try {
  //     const responseData = await submitReturnRequest(returnData);
  //     console.log("Return submitted successfully:", responseData);
  
  //     // Update UI state after successful submission
  //     setReturns([
  //       ...returns,
  //       ...selectedProducts.map((product) => ({
  //         invoiceNO: formData.invoiceNo,
  //         productName: product.productName,
  //         quantity: product.quantity,
  //         reason: product.reason,
  //       })),
  //     ]);
  
  //     // Reset form
  //     setFormData({
  //       invoiceNo: '',
  //       selectedProduct: '',
  //       quantity: '',
  //       reason: '',
  //     });
  
  //     setSelectedProducts([]); // Reset selected products
  //     setIsModalOpen(false);
  //   } catch (error) {
  //     console.error("Error submitting return:", error);
  //   }
  // };


  // const [formData, setFormData] = useState({
  //   invoiceNo: "",
  //   selectedProduct: "",
  //   quantity: "",
  //   reason: "",
  // });

  // const [products, setProducts] = useState([]);
  // const [selectedProducts, setSelectedProducts] = useState([]); // Store multiple selected products

  // // Fetch products when Invoice No changes
  // const handleInvoiceChange = async (e) => {
  //   const invoiceNo = e.target.value;
  //   setFormData((prev) => ({ ...prev, invoiceNo }));

  //   if (invoiceNo.trim() !== "") {
  //     const data = await fetchProductsByInvoice(invoiceNo);
  //     console.log("Fetched Products:", data.products);
  //     setProducts(data.products);
  //   } else {
  //     setProducts([]);
  //   }
  // };

  // // Handle Product Selection
  // const handleProductSelection = (e) => {
  //   const productId = e.target.value;
  //   const product = products.find((p) => p.product_id === parseInt(productId, 10));

  //   if (product) {
  //     setSelectedProducts([
  //       ...selectedProducts,
  //       { productId: product.product_id, productName: product.product_name, quantity: 1, reason: "" },
  //     ]);
  //   }
  // };

  // // Update Quantity and Reason for Selected Products
  // const updateSelectedProduct = (index, key, value) => {
  //   const updatedProducts = [...selectedProducts];
  //   updatedProducts[index][key] = value;
  //   setSelectedProducts(updatedProducts);
  // };

  // // Remove a product from selection
  // const removeProduct = (index) => {
  //   const updatedProducts = selectedProducts.filter((_, i) => i !== index);
  //   setSelectedProducts(updatedProducts);
  // };

  // // Submit Form
  // const handleFormSubmit = async (e) => {
  //   e.preventDefault();

  //   if (selectedProducts.length === 0) {
  //     console.error("No products selected for return");
  //     return;
  //   }

  //   const returnedProducts = selectedProducts.map((product) => ({
  //     product_id: product.productId,
  //     quantity: parseInt(product.quantity, 10),
  //     return_reason: product.reason,
  //   }));

  //   const returnData = {
  //     invoice_id: parseInt(formData.invoiceNo, 10),
  //     returnedProducts,
  //   };

  //   try {
  //     const responseData = await submitReturnRequest(returnData);
  //     console.log("Return submitted successfully:", responseData);

  //     // Update UI state
  //     setReturns([
  //       ...returns,
  //       ...selectedProducts.map((product) => ({
  //         invoiceNO: formData.invoiceNo,
  //         productName: product.productName,
  //         quantity: product.quantity,
  //         reason: product.reason,
  //       })),
  //     ]);

  //     // Reset form
  //     setFormData({ invoiceNo: "", selectedProduct: "", quantity: "", reason: "" });
  //     setSelectedProducts([]);
  //     setIsModalOpen(false);
  //   } catch (error) {
  //     console.error("Error submitting return:", error);
  //   }
  // };
  const [returns, setReturns] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]); 
  const [invoiceId , setInvoiveId] = useState([]);
  const [formData, setFormData] = useState({
    invoiceNo: "",
  });

  const handleInvoiceChange = async (invoiceNo) => {
    // const invoiceNo = e.target.value;
    // setFormData({ invoiceNo });
    setFormData({ ...formData, invoiceNo }); // Ensure state updates correctly
    if (invoiceNo.trim() !== "") {
      const data = await fetchProductsByInvoice(invoiceNo);
      setProducts(data.data.products);
      console.log("REturn invoice Id",data.data);
      setInvoiveId(data.data.invoice_id);
    } else {
      setProducts([]);
    }
  };

  
//   const handleInvoiceChange = (e) => {
//     const invoiceNo = e.target.value;
//     setFormData({ ...formData, invoiceNo });
// };

// const validateInvoiceNo = async () => {
//     const invoiceNo = formData.invoiceNo.trim();
//     if (invoiceNo !== "") {
//         try {
//             const data = await fetchProductsByInvoice(invoiceNo);
//             setProducts(data.data.products);
//             console.log("Return invoice Id", data.data);
//             setInvoiveId(data.data.invoice_id);
//         } catch (error) {
//             console.error("Error fetching invoice data:", error);
//         }
//     } else {
//         setProducts([]);
//     }
// };

  
  const handleProductSelect = (productId, productName) => {
    // Check if already selected
    console.log(".............", productId , productName)
    if (selectedProducts.some((p) => p.productId === productId)) return;
    setSelectedProducts([
      ...selectedProducts,
      { productId, productName, quantity: "", reason: "" },
    ]);
  };

  const handleInputChange = (index, field, value) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts[index][field] = value;
    setSelectedProducts(updatedProducts);
  };


  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (selectedProducts.length === 0) {
      // console.error("No products selected for return");
      // toast.error("Invalid Invoice number");
      return;
    }
    const returnData = {
      invoice_id: invoiceId,
      returnedProducts: selectedProducts.map((product) => ({
        product_id: Number(product.productId),
        quantity: parseInt(product.quantity, 10),
        return_reason: product.reason,
      })),
    };
    try {
      await submitReturnRequest(returnData);
      setReturns([...returns, ...selectedProducts]);
      setFormData({ invoiceNo: "" });
      setSelectedProducts([]);
      setIsModalOpen(false);
      toast.success("Return request submitted successfully!");
      setTimeout(() => {
        navigate(0); 
      }, 1500);
        } catch (error) {
      console.error("Error...................:", error.response.data.message);
      toast.error(error.response.data.message);
    }
  };
  

  return (
    <div className=" pt-2 pl-2 h-screen">
      <div className='flex justify-between '>
      <h1 className="text-2xl font-bold mb-4">Return Page</h1>
      <PaginationComponent
              totalPages={totalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}/>
      <button
        className="bg-[#027483] text-white px-4 py-2 rounded hover:bg-cyan-800"
        onClick={() => {
          setFormData({ invoiceNo:""}); // Reset form fields
           setProducts([]); // Clear previous products
    setSelectedProducts([]);
          setIsModalOpen(true);
        }}
      >
        Add New Return
      </button>
      </div>
      <div className=" h-[90vh] overflow-y-scroll scrollbar-hide">
        <table className="min-w-full bg-white border border-gray-200 rounded bg-white rounded-lg shadow-md text-left">
          <thead className="bg-[#027483] text-white">
            <tr className=" text-left">
              <th className="px-4 py-2">Invoice Number</th>
              <th className="px-4 py-2">Product Name</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Reason for Return</th>
            </tr>
          </thead>
          <tbody>
            {returns.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 ">{item.invoice_number}</td>
                <td className="px-4 py-2 ">{item.product_name}</td>
                <td className="px-4 py-2 ">{item.quantity}</td>
                <td className="px-4 py-2 ">{item.return_reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-[50vw] max-w-md  h-[70%] overflow-y-scroll">
            <h2 className="text-xl font-bold mb-4">Add New Return</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Invoice No</label>
             
                  <input
                    type="text"
                    name="invoiceNo"
                    value={formData.invoiceNo}
                    onChange={(e) => {
                      setFormData({ ...formData, invoiceNo: e.target.value });
                    }}
                    onBlur={() => handleInvoiceChange(formData.invoiceNo)} 
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault(); 
                        handleInvoiceChange(formData.invoiceNo);
                      }
                    }}
                    onInput={(e) => {
                      if (e.target.value.startsWith(" ")) {
                        e.target.value = e.target.value.trimStart();
                      }
                    }}
                    className="w-full border border-gray-300 px-3 py-2 rounded"
                    required
                  />
              </div>
              {Array.isArray(products) && products.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Select Product</label>
                  <select
                    onChange={(e) => {
                      const productId = e.target.value;
                      const productName = products.find((p) => p.product_id === productId)?.product_name;
                      handleProductSelect(productId, productName);
                    }}
                    className="w-full border border-gray-300 px-3 py-2 rounded"
                  >
                    <option>Select a Product</option>
                    {products.map((product) => (
                      <option key={product.product_id} value={product.product_id}>
                        {product.product_name} - {product.quantity}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Modal */}
              {selectedProducts.length > 0 &&
                selectedProducts.map((product, index) => (
                  <div key={product.productId} className="border p-3 mb-2 rounded">
                    <h4 className="font-semibold">{product.productName}</h4>
                    <label className="block text-sm font-medium mb-1">Quantity</label>
                    {/* <input
                      type="number"
                      value={product.quantity}
                      onChange={(e) => handleInputChange(index, "quantity", e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "0" && e.target.value.length === 0) {
                          e.preventDefault(); 
                        }
                      }}
                      className="w-full border border-gray-300 px-3 py-2 rounded"
                      required
                    /> */}
                    <input
  type="number"
  min="1"
  value={product.quantity}
  onChange={(e) => {
    const value = e.target.value;
    if (value >= 0) {
      handleInputChange(index, "quantity", value);
    }
  }}
  onKeyDown={(e) => {
    // prevent typing "-" or starting with "0"
    if (
      e.key === "-" || 
      (e.key === "0" && e.target.value.length === 0)
    ) {
      e.preventDefault();
    }
  }}
  className="w-full border border-gray-300 px-3 py-2 rounded"
  required
/>

                    <label className="block text-sm font-medium mb-1 mt-2">Reason</label>
                    <textarea
                      value={product.reason}
                      onChange={(e) => handleInputChange(index, "reason", e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2 rounded"
                      required
                    />
                  </div>
                ))}

              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  className="bg-gray-300 text-black px-4 py-2 rounded mr-2 hover:bg-gray-400"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
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
export default ReturnPage;


 // const handleFormSubmit = (e) => {
  //   e.preventDefault();
  //   const selectedProductName = products.find(
  //     (product) => product.productId === formData.selectedProduct
  //   )?.productName;
  //   setReturns([
  //     ...returns,
  //     {
  //       invoiceNO: formData.invoiceNo,
  //       productName: selectedProductName,
  //       quantity: formData.quantity,
  //       reason: formData.reason,
  //     },
  //   ]);
  //   setFormData({
  //     invoiceNO: '',
  //     selectedProduct: '',
  //     quantity: '',
  //     reason: '',
  //   });
  //   setProducts([]);
  //   setIsModalOpen(false);
  // };
     {/* {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Return</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Invoice No</label>
                <input
                  type="text"
                  name="invoiceNo"
                  value={formData.invoiceNo}
                  onChange={handleInvoiceChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded"
                  required
                />
              </div>
              {products.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Product</label>
                  <select
                    name="selectedProduct"
                    value={formData.selectedProduct}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded"
                    required
                  >
                    <option value="">Select a Product</option>
                    {products.map((product) => (
                      <option key={product.product_id} value={product.product_id}>
                        {product.product_name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Reason for Return</label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded"
                  rows="3"
                  required
                />
              </div>
               {selectedProducts.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium">Selected Products</h3>
                  {selectedProducts.map((product, index) => (
                    <div key={index} className="border p-2 rounded mt-2">
                      <p className="text-sm">{product.productName}</p>

                  
                      <input
                        type="number"
                        value={product.quantity}
                        min="1"
                        onChange={(e) => updateSelectedProduct(index, "quantity", e.target.value)}
                        className="w-full border border-gray-300 px-2 py-1 rounded mt-1"
                        required
                      />

                    
                      <textarea
                        value={product.reason}
                        onChange={(e) => updateSelectedProduct(index, "reason", e.target.value)}
                        className="w-full border border-gray-300 px-2 py-1 rounded mt-1"
                        rows="2"
                        required
                      ></textarea>

                
                      <button
                        type="button"
                        onClick={() => removeProduct(index)}
                        className="text-red-500 text-xs mt-1"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-300 text-black px-4 py-2 rounded mr-2 hover:bg-gray-400"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )} */}


         {/* <input
                  type="text"
                  name="invoiceNo"
                  value={formData.invoiceNo}
                  onChange={handleInvoiceChange}
                  onInput={(e) => {
                    if (e.target.value.startsWith(" ")) {
                      e.target.value = e.target.value.trimStart();
                    }
                  }}
                  className="w-full border border-gray-300 px-3 py-2 rounded"
                  required
                /> */}