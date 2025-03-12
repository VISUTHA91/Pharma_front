import axios from "axios";
import { toast } from "react-toastify";


// Base URL for your API
// export const API_BASE_URL = "https://pvpzxbb1-3001.inc1.devtunnels.ms/";
// export const API_BASE_URL = "https://pvpzxbb1-3001.inc1.devtunnels.ms/";
// export const API_BASE_URL = "http://192.168.20.7:3002/";
export const API_BASE_URL = "http://192.168.20.7:3002/";


const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/pdf",

  },
});
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
//  axiosInstance.interceptors.response.use(
//   async (response) => {
//     try {
//       if (response.data?.statusCode === 700 || response.status === 500) {
//         // Remove the auth token from local storage
//         // localStorage.removeItem('authToken');
//         // localStorage.removeItem('auth-token')
//         // localStorage.removeItem('userData');
//         alert("Session expired. Please log in again.");
//         window.location.href = "/Signin";
//       }
//     } catch (error) {
//       console.error("Error handling token expiration:", error);
//     }
//     return response;
//   },
//   (error) => {
//     console.error("API Error:", error.response || error.message);
//     alert(error.response.data.message || error.message);
//     return Promise.reject(error);
//   }
// );


axiosInstance.interceptors.response.use(
  async (response) => {
    try {
      if (response.data?.statusCode === 700 || response.status === 500 || response.status === 401) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("authToken"); // Clear the token
        window.location.href = "/Signin"; // Redirect to login page
      }
    } catch (error) {
      console.error("Error handling token expiration:", error);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      alert("Session expired. Please log in again.");
      localStorage.removeItem("authToken");
      window.location.href = "/Signin";
    }
    console.error("API Error:", error.response || error.message);
toast.error(error.response || error.message)
    // alert(error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};


export const register = async (formData) => {
  // const token = getAuthToken();
  // if (!token) throw new Error("Authentication token not found");
  // console.log("API",formData)
  
  const response = await axiosInstance.post(`${API_BASE_URL}staff/register`, formData);
  return response;
};
  
  
  // AdminLogin.......
  export const adminlogin = async (logindata) => {
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}admin/login`,logindata);
      console.log("Login data",response);
      return response.data;
    } catch (error) {
      return error.response ? error.response.data : new Error("Sign In Failed");
    }
  }

  // StaffLogin.......
  export const stafflogin = async (Data) => {
    console.log("Staff Login",Data)
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}staff/login`, Data);
      console.log("Staff Login",response);
      return response.data; 
    } catch (error) {
      return error.response ? error.response.data : new Error("Sign In Failed");
    }
  };
  export const updateStaff = async (id, formData) => {
    console.log("API...........",formData);
    const response = await axiosInstance.put(`${API_BASE_URL}staff/user/${id}`, formData);
    return response.data;
  };
  export const getStaffList = async (page, limit) => {
    try {
      // const token = localStorage.getItem('authToken');
      // console.log("Token being sent:", token);
      // if (!token) {
      //   throw new Error("Token not found. Please log in.");
      // }
      const response = await axiosInstance.get(`${API_BASE_URL}staff/getstaff`,{
        params: { page, limit } });
      console.log("Api Data:",response.data)
      return response.data;
    } catch (error) {
      console.error('Error fetching staff list:', error);
      throw error; 
    }
  };
  export const deleteStaff = async (staffId) => {
    try {
      const response = await axiosInstance.delete(`${API_BASE_URL}staff/user/${staffId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting staff:", error);
      throw error;
    }
  };
  export const getCategory = async (page, limit) => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}pro_category/all_category_pagination`,{
        params: { page, limit } });
        console.log("Api Category",response)
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  };
  export const getCategorywithoutpagination = async (page, limit) => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}pro_category/all_category`,{
        params: { page, limit } });
        console.log("Api Category pagination",response)
      return response;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  };

  export const categoryListBySupplierId = async (supplierId) => {
    try {
      const response  = await axiosInstance.get(`${API_BASE_URL}products/sup_cat_pro/${supplierId}`);
      console.log("API Category List", response.data); // Indicate success
      return response;
    } catch (error) {
      // console.error("Error deleting supplier:", error);
      // throw error;
    }
  };
  export const createCategory = async (categoryData) => {
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}pro_category/insert_category`, categoryData);
      return response.data;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  };
  export const updateCategory = async (categoryId, updatedData) => {
    console.log("Updating Category with ID:", categoryId);
    console.log("Updated Data:", updatedData);
  
    if (!categoryId) {
      console.error("Error: categoryId is undefined or null!");
      return;
    }
    try {
      const response = await axiosInstance.put(`${API_BASE_URL}pro_category/update_category/${categoryId}`, updatedData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  };
  export const deleteCategory = async (categoryId) => {
    console.log("mmmmm",categoryId);
    try {
      const response = await axiosInstance.delete(`${API_BASE_URL}pro_category/del_category/${categoryId}`
      );
      console.log("Category Deleted:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error deleting category:", error.response ? error.response.data : error);
      throw error.response ? error.response.data : error;
    }
  };
  export const fetchProducts = async (page,limit) => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}products/Allpro_pagination`,{
        params: { page, limit } 
      });
      // console.log("Fetched Products:", response.data); // Debugging
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error.response ? error.response.data : error);
      throw error.response ? error.response.data : error;
    }
  };
  export const fetchProductsforreport = async () => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}products/Allpro_list`);
      // console.log("Fetched Products:", response.data); // Debugging
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error.response ? error.response.data : error);
      throw error.response ? error.response.data : error;
    }
  };
  export const fetchProductbyID = async (productId) => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}products/proByid/${productId}`);
      console.log("FETCH API BY ID",response.data)
      return response.data;
    } catch (error) {
      console.error("Error fetching product details:", error);
      throw error;
    }
  };
  export const productlistByID = async (categoryId) => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}products/proByid/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching product details:", error);
      throw error;
    }
  };  

  export const createProduct = async (productData) => {
    console.log("API  Submit",productData)
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}products/inproduct`, productData);
      return response.data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  };

  export const uploadParsedData = async (formData) => {
    console.log("API Submitting file");
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}products/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // This is important for file uploads
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error uploading data:", error);
      throw error;
    }
  };
  
  export const updateProduct = async (productId, productData) => {
    console.log("Edited Product Id",productId)
    try {
      const response = await axiosInstance.put(`${API_BASE_URL}products/productput/${productId}`, productData);
      return response.data;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  };
  export const fetchSupplierpagination = async (page,limit) => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}supplier/sup_all_pagination`,{ params: { page, limit } });
      // console.log("Fetched Suppliers:", response.data); // Debugging
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error.response ? error.response.data : error);
      throw error.response ? error.response.data : error;
    }
  };
  export const fetchSuppliers = async () => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}supplier/sup_all`);
      console.log("Api Suplier List",response)
      return response.data;
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      return [];
    }
  };
  export const supplierById = async (supplierId) => {
    try {
      const response  = await axiosInstance.get(`${API_BASE_URL}supplier/sup_id/${supplierId}`);
      console.log("API", response.data); // Indicate success
      return response;
    } catch (error) {
      // console.error("Error deleting supplier:", error);
      // throw error;
    }
  };

  export const updateSupplier = async (supplierId, supplierData) => {
    try {
      const response = await axiosInstance.put(`${API_BASE_URL}supplier/sup_update/${supplierId}`, supplierData);
      return response.data;
    } catch (error) {
      console.error("Error updating supplier:", error);
      throw error;
    }
  };
  export const createSupplier = async (supplierData) => {
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}supplier/sup_insert`, supplierData);
      return response.data;
    } catch (error) {
      console.error("Error creating supplier:", error);
      throw error;
    }
  };
  export const deleteSupplier = async (supplierId) => {
    try {
      await axiosInstance.delete(`${API_BASE_URL}supplier/sup_del/${supplierId}`);
      return true; // Indicate success
    } catch (error) {
      console.error("Error deleting supplier:", error);
      throw error;
    }
  };


  export const createsupplierinvoice = async (invoiceData) => {
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}supplier_invoice/invoices`, invoiceData);
      return response.data;
    } catch (error) {
      console.error("Error creating Invoice:", error);
      // throw error;
    }
  };
  export const createSupplierPayment = async (paymentData) => {
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}supplier_invoice/payments`,paymentData);
      return response.data;
    } catch (error) {
      console.error("Error creating Invoice:", error);
      throw error;
    }
  };


  export const fetchSupplierInvoiceList = async (supplierId) => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}supplier_invoice/${supplierId}/invoices`);
      console.log("Supplier at API",response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching product details:", error);
      // throw error;
    }
  };

  export const fetchInvoices = async (page,limit) => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}invoice/invoiceall_pagination`,{ params: { page, limit } });
      console.log("Api Invoice",response)
      return response.data;
    } catch (error) {
      console.error("Error fetching invoices:", error);
      throw error;
    }
  };

  

  export const fetchProductsByInvoice = async (invoiceNo) => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}invoice/invoice/${invoiceNo}`);
      console.log("FetchProductsByInvoice",response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching product details:", error);
      throw error;
    }
  };


  export const createInvoice = async (invoiceData) => {
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}invoice/invoicesin`, invoiceData);
      return response.data;
    } catch (error) {
      console.error("Error creating Invoice:", error);
      throw error;
    }
  };

  export const fetchExpense = async (page,limit) => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}expense/pagination_expence`,{ params: { page, limit } });
      console.log("Api Expense",response)
      return response;
    } catch (error) {
      console.error("Error fetching invoices:", error);
      throw error;
    }
  };

  export const addExpense = async (expenseData) => {
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}expense/expensesinsert`, expenseData);
      return response.data;
    } catch (error) {
      console.error("Error adding expense:", error);
      throw error;
    }
  };

  
  export const getBinList = async () => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}products/list-soft-deleted`);
      console.log("Api Bin",response);
      return response.data;
    } catch (error) {
      console.error("Error fetching Bindata:", error);
      throw error;
    }
  }; 
  export const restoreProduct = async (productId) => {
    try {
      const response = await axiosInstance.put(`${API_BASE_URL}products/restore/${productId}`);
      return response.data;
    } catch (error) {
      console.error("Error restoring product:", error.response?.data || error.message);
      throw error;
    }
  };
  

  export const deleteproduct = async (categoryId) => {
    console.log("Deleting the Product ID:",categoryId)
    try {
      const response = await axiosInstance.delete(`${API_BASE_URL}products/soft-delete/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting product:", error.response?.data || error.message);
      throw error;
    }
  };

   export const productService = {
     searchProducts: async (searchTerm) => {
      console.log("Query APi",searchTerm);
      if (!searchTerm || searchTerm.trim() === "") {
        throw new Error("Search term is required.");
      }
      try {
        const response = await axiosInstance.get(`${API_BASE_URL}products/searchProducts?`, {
          params: {searchTerm },
        });
        console.log("Search API Page",response);
        return response.data;
      } catch (error) {
        console.error("Error fetching search results:", error);
        throw error; // Rethrow error for handling in the component
      }
    },
  };
  



  export const productpermanentdelete = async (categoryId) => {
    console.log("Deleting the Product ID:",categoryId)
    try {
      const response = await axiosInstance.delete(`${API_BASE_URL}products/permanent-delete/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting product:", error.response?.data || error.message);
      throw error;
    }
  };

    
  export const getpharmacydetails = async () => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}shop/getAll/`);
      console.log("Api Shop Details",response)
      return response.data;
    } catch (error) {
      console.error("Error fetching Pharmacy Details:", error);
      throw error;
    }
  }; 

  export const updatePharmacyDetails = async (shopId, updatedData) => {
    console.log("Shop",updatedData)
    try {
      const response = await axiosInstance.put(`${API_BASE_URL}shop/update/${shopId}`, updatedData);
      return response.data;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  };

  // export const getDailySales = async () => {
  //   try {
  //     const response = await axiosInstance.get(`${API_BASE_URL}report/sales-report/daily`);
  //     console.log("Daily Details",response)
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error fetching Daily Details:", error);
  //     throw error;
  //   }
  // }; 

  // export const getWeeklySales = async () => {
  //   try {
  //     const response = await axiosInstance.get(`${API_BASE_URL}report/sales-report/weekly`);
  //     console.log("Weekly Details",response)
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error fetching Weekly Details:", error);
  //     throw error;
  //   }
  // }; 
 
  export const getTodaySales = async () => {
    try {
      // Get today's date
      const today = new Date();
      const formattedDate = today.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  
      console.log("Fetching today's sales for:", formattedDate);
  
      // Make API request with startDate and endDate as today
      const response = await axiosInstance.get(`${API_BASE_URL}report/sales-report/weekly`, {
        params: {
          startDate: formattedDate,
          endDate: formattedDate,
        },
      });
  
      console.log("Today's Sales Data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching Today's Sales:", error);
      throw error;
    }
  };
  
  export const getWeeklySales = async () => {
    try {
      // Get today's date
      const today = new Date();
  
      // Calculate start date (7 days ago)
      const startDate = new Date();
      startDate.setDate(today.getDate() - 7);
  
      // Format dates as YYYY-MM-DD (assuming your backend expects this format)
      const formattedStartDate = startDate.toISOString().split("T")[0];
      const formattedEndDate = today.toISOString().split("T")[0];
  
      console.log("Fetching weekly sales from:", formattedStartDate, "to", formattedEndDate);
  
      // Make API request with query parameters
      const response = await axiosInstance.get(`${API_BASE_URL}report/sales-report/weekly`, {
        params: {
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        },
      });
  
      console.log("Weekly Sales Data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching Weekly Sales:", error);
      throw error;
    }
  };
  export const getMonthlySales = async () => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}report/sales-report/monthly`);
      console.log("Monthly Details",response)
      return response.data;
    } catch (error) {
      console.error("Error fetching Monthly Details:", error);
      throw error;
    }
  }; 
  export const getYearlySales = async () => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}report/sales-report/yearly`);
      console.log("Yearly Details",response)
      return response.data;
    } catch (error) {
      console.error("Error fetching Yeaarly Details:", error);
      throw error;
    }
  }; 

  export const searchProducts = async (query) => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}products/filter_pro?search=${query}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  };
  export const getMostSoldItems = async (period) => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}invoice/most_sold_medicines?period=${period}`);
      // console.log("Most Sold Items in API", response.data);
      return response.data; // Assuming API returns { data: [...] }
    } catch (error) {
      console.error("Error fetching most sold items:", error);
      throw error; // Propagate the error for handling in the component
    }
  };

  export const getAllSoldProducts = async ({ startDate, endDate, period, productName, categoryName }) => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}invoice/most_sold_details`,
         {
        params: { startDate, endDate, period, productName, categoryName },
      });
      console.log("API SALES DATA",response)
      return response.data;
    } catch (error) {
      console.error("Error fetching sold products:", error);
      throw error;
    }
  };

  // export const downloadSalesReport = async (format) => {
  //   const endpoint = format === "csv" ? "invoice/sales-report/csv" : "invoice/sales-report/pdf";
  //   try {
  //     console.log(`📤 Requesting ${format.toUpperCase()} report...`);

  //     const response = await axiosInstance.get(`${API_BASE_URL}${endpoint}`, {
  //       responseType: "arraybuffer", // Alternative responseType for PDFs
  //     });
  //     // Create a URL and trigger the download
  //     const url = window.URL.createObjectURL(new Blob([response.data],{ type: "application/pdf" }));
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.setAttribute("download", `invoice/sales-report.${format}`);
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //     console.log("🎉 File download triggered successfully!");
  //   } catch (error) {
  //     console.error("Error exporting report:", error);
  //     throw error;
  //   }
  // };

//   export const downloadSalesReport = async (format) => {
//     const endpoint = format === "csv" ? "invoice/sales-report/csv" : "invoice/sales-report/pdf";
//     try {
//         console.log(`📤 Requesting ${format.toUpperCase()} report...`);

//         const response = await axiosInstance.get(`${API_BASE_URL}${endpoint}`, {
//             responseType: "arraybuffer", // ✅ Ensure binary data format
//         });

//         console.log("✅ Response received:", response);

//         const blob = new Blob([response.data], { type: "application/pdf" });
//         const url = window.URL.createObjectURL(blob);
//         const link = document.createElement("a");
//         link.href = url;
//         link.setAttribute("download", `sales-report.${format}`);
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         console.log("🎉 File download triggered successfully!");
//     } catch (error) {
//         console.error("❌ Error exporting report:", error);
//     }
// };

  // export const getIncomeReport = async (type) => {
  //   console.log("typesdfghjkghjkl",type)
  //   try {
  //     const response = await axiosInstance.get(`${API_BASE_URL}report/income-report/${type}`);
  //     console.log("APIIIIIIIIIIIIIIIII",response)
  //     return response; // Return the income report data
  //   } catch (error) {
  //     console.error("Error fetching income report:", error);
  //     throw error;
  //   }
  // };

  // export const downloadSalesReport = async (format) => {
  //   const endpoint = format === "csv" ? "invoice/sales-report/csv" : "invoice/sales-report/pdf";
  //   try {
  //     console.log(`📤 Requesting ${format.toUpperCase()} report...`);
  //     const response = await axiosInstance.get(`${API_BASE_URL}${endpoint}`, {
  //       responseType: "blob", // Ensures binary data is received
  //       headers: {
  //         Accept: format === "csv" ? "text/csv" : "application/pdf", // Set appropriate headers
  //       },
  //     });
  
  //     // Check if the response is valid
  //     const contentType = response.headers["content-type"];
  //     console.log("📑 Received content type:", contentType);
  
  //     if (
  //       (format === "csv" && !contentType.includes("csv")) ||
  //       (format === "pdf" && !contentType.includes("pdf"))
  //     ) {
  //       console.error("❌ Unexpected file type received:", contentType);
  //       return;
  //     }
  
  //     // Create a URL and trigger the download
  //     const url = window.URL.createObjectURL(new Blob([response.data], { type: contentType }));
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.setAttribute("download", `invoice-sales-report.${format}`);
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
      
  //     console.log("🎉 File download triggered successfully!");
  //   } catch (error) {
  //     console.error("❌ Error exporting report:", error);
  //     throw error;
  //   }
  // };

export const downloadSalesReportCSV = async () => {
  const endpoint = "invoice/sales-report/csv";
  try {
    console.log("📤 Requesting CSV sales report...");
    const response = await axiosInstance.get(`${API_BASE_URL}${endpoint}`, {
      responseType: "blob", // Ensures binary data is received
      headers: {
        Accept: "text/csv", // Correct MIME type
      },
    });
    // Validate content type
    if (!response.headers["content-type"].includes("csv")) {
      console.error("❌ Unexpected file type received:", response.headers["content-type"]);
      return;
    }

    // Create URL and trigger download
    const url = window.URL.createObjectURL(new Blob([response.data], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "invoice-sales-report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log("🎉 CSV file download triggered successfully!");
  } catch (error) {
    console.error("❌ Error exporting CSV report:", error);
    throw error;
  }
};

export const downloadSalesReportPDF = async () => { 
  try {
    console.log("📤 Requesting PDF sales report...");

    const response = await axiosInstance.get(`${API_BASE_URL}invoice/sales-report/pdf`, {
      responseType: "blob", 
      // responseType: "arraybuffer",
      // Ensures binary data is received
      headers: {
        Accept: "application/pdf", // Requesting a PDF file
      },
    });

    // Check if response data is a valid Blob (PDF content)
    if (!response.data || response.data.size === 0) {
      console.error("❌ Received empty or invalid PDF file.");
      return;
    }

    // Create a URL for the received Blob
    const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));

    // Create a temporary anchor element to trigger download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "invoice-sales-report.pdf");
    document.body.appendChild(link);
    link.click();

    // Cleanup: Remove link & revoke URL
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    console.log("🎉 PDF file download triggered successfully!");
  } catch (error) {
    console.error("❌ Error exporting PDF report:", error);
    alert("Failed to download the sales report. Please try again.");
  }
};

export const downloadStockReportPDF = async () => {
  try {
    console.log("📤 Requesting PDF Stock report...");

    const response = await axiosInstance.get(`${API_BASE_URL}products/downloadStockPDF`, {
      responseType: "blob", 
      // responseType: "arraybuffer",
      // Ensures binary data is received
      headers: {
        Accept: "application/pdf", // Requesting a PDF file
      },
    });

    // Check if response data is a valid Blob (PDF content)
    if (!response.data || response.data.size === 0) {
      console.error("❌ Received empty or invalid PDF file.");
      return;
    }
    // Create a URL for the received Blob
    const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
    // Create a temporary anchor element to trigger download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "invoice-stock-report.pdf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    console.log("🎉 PDF file download triggered successfully!");
  } catch (error) {
    console.error("❌ Error exporting PDF report:", error);
    alert("Failed to download the stock report. Please try again.");
  }
};

export const downloadStockReportCSV = async () => {
  try {
    console.log("📤 Requesting CSV stock report...");
    const response = await axiosInstance.get(`${API_BASE_URL}products/downloadStockCSV`, {
      responseType: "blob", // Ensures binary data is received
      headers: {
        Accept: "text/csv", // Correct MIME type
      },
    });
    // Validate content type
    if (!response.headers["content-type"].includes("csv")) {
      console.error("❌ Unexpected file type received:", response.headers["content-type"]);
      return;
    }

    // Create URL and trigger download
    const url = window.URL.createObjectURL(new Blob([response.data], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "invoice-stock-report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log("🎉 CSV file download triggered successfully!");
  } catch (error) {
    console.error("❌ Error exporting CSV report:", error);
    throw error;
  }
};

  
  
  export const getIncomeReport = async (interval) => {
    console.log("Fetching income report for interval:", interval);
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}report/income-report`, {
        params: { interval } // Passing interval as a query parameter
      });
      console.log("API Response:", response.data);
      return response.data; // Return the income report data
    } catch (error) {
      console.error("Error fetching income report:", error);
      throw error;
    }
  };
  

  export const fetchFilteredSalesData = async (start, end, filterType) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/sales`, {
        params: {
          startDate: start,
          endDate: end,
          filterType,
        },
      });
      return response.data; // Return the fetched data
    } catch (error) {
      console.error("Error fetching sales data:", error);
      throw error;
    }
  };

  export const printDocument = async (invoiceId) => {
    console.log("Printing invoice with ID:", invoiceId);
    try {
        const response = await axiosInstance.get(`${API_BASE_URL}invoice/invoicebyid/pdfdownload/${invoiceId}`, {
            responseType: "blob", // Ensure response is treated as binary
        });
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        window.open(url, "_blank");
    } catch (error) {
        console.error("Print failed", error);
        // Log server response if available
        if (error.response) {
            console.error("Response Data:", error.response.data);
            console.error("Status:", error.response.status);
        }
    }
};

export const returnCustomerproducts = async (page,limit) => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}return/getAll_rejectedInvoices`,{ params: { page, limit } });
    console.log("Api Return",response)
    return response.data;
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw error;
  }
};

//    create return Request
export const submitReturnRequest = async (returnData) => {
  try {
    const response = await axiosInstance.post(`${API_BASE_URL}return/return_product`, returnData);
    return response.data; // Axios automatically parses JSON
  } catch (error) {
    console.error("Error submitting return:", error.response?.data || error.message);
    throw error;
  }
};

export const getTotalSalesAmount = async () => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}invoice/invoice_total_amount`);
    console.log("Total Sales Amount",response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching Yeaarly Details:", error);
    throw error;
  }
};
export const getTotalProductCount = async () => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}products/product_totalcount`);
    console.log("Total Products",response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching Yeaarly Details:", error);
    throw error;
  }
};
export const getTotalCustomerCount = async () => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}invoice/customers/count`);
    console.log("Total Customer Count",response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching Yeaarly Details:", error);
    throw error;
  }
};
export const getAllProductsStockSearch = async ({ status , search}) => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}products/stock_list_product`, {
      params: { status , search},
    });
    console.log("><><><><>",response)
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch products");
  }
};
