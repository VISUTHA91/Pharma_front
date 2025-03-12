import { useState, useEffect } from "react";
// import axiosInstance from "../../Api/axiosInstance";
// import { Table } from "@/components/ui/table"; // Example using ShadCN UI
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart,Line } from "recharts";
import { fetchProductsforreport } from "../../Api/apiservices";
import { FaSearch } from "react-icons/fa";
import { PiExportBold } from "react-icons/pi";
import { downloadStockReportPDF} from '../../Api/apiservices';
import { downloadStockReportCSV} from '../../Api/apiservices';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";




// import { Table, TableHead, TableRow, TableBody, TableCell } from "@/components/ui/table";
const StockReport = () => {
  const [stockData, setStockData] = useState([]);
  const [loading , setLoading] = useState([]);
    const [query, setQuery] = useState("");
    const handleSearch = () => {
      if (query.trim() !== "") {
        onSearch(query);
      }
    };
    const [selectedStatus, setSelectedStatus] = useState("");
      const [showOptions, setShowOptions] = useState(false);
      const [products, setProducts] = useState([]);
      const [error , setError] = useState([]);


    const handleChange = (event) => {
      const value = event.target.value;
      console.log("event.target.value",event.target.value);
      setSelectedStatus(value);
      onFilterChange(value); // Pass selected filter to parent component
    };
  //   useEffect(() => {
  //     const fetchProducts = async () => {
  //       setLoading(true);
  //       try {
  //         const data = await getAllProductsStockSearch({
  //           status: selectedStatus, // Send selected filter
  //         });
  //         setStockData(data.data); // Set fetched products
  //       } catch (err) {
  //         setError(err.message);
  //       } finally {
  //         setLoading(false);
  //       }
  //     };
  //     fetchProducts();
  //   }, [selectedStatus]);

  // useEffect(() => {
  //   fetchStockReport();
  // }, []);

  // const fetchStockReport = async () => {
  //   try {
  //     const response = await fetchProductsforreport();
  //     setStockData(response.data);
  //   } catch (error) {
  //     console.error("Error fetching stock report:", error);
  //   }
  // };

  
  

useEffect(() => {
  const fetchStockData = async () => {
    setLoading(true);
    try {
      let data;
      if (selectedStatus) {
        data = await getAllProductsStockSearch({ status: selectedStatus });
      } else {
        data = await fetchProductsforreport(); // Fetch all products when no filter is selected
      }
      console.log("Sales DATA:::::",data)
      setStockData(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchStockData();
}, [selectedStatus]);
  
  const handleExport = async (format) => {
    try {
      if (format === "csv") {
        await downloadStockReportCSV();
      } else if (format === "pdf") {
        await downloadStockReportPDF();
      } else {
        throw new Error("Invalid format specified");
      }
      toast.success("Download Successfully");
    } catch (error) {
      // console.error("Export failed:", error);
      toast.error("Export failed");
    }
    setShowOptions(false);
  };

  return (
    <div className=" ">
      <h2 className="text-xl font-semibold">Stock Report</h2>
      <ResponsiveContainer width="100%" height={150}>
  <LineChart data={stockData}>
    <XAxis dataKey="product_name" />
    <YAxis   domain={[0, 1000]}  // Define the min & max range
      ticks={[0, 200, 400, 600, 800,1000]} // Custom tick values
      tickCount={7} 
      />
    <Tooltip />
    <Line type="monotone" dataKey="product_quantity" stroke="#82ca9d" strokeWidth={3} />
  </LineChart>
</ResponsiveContainer>
      {/* Stock Report Table */}
      <div className="mt-4">
        <div className="flex justify-end items-center">
          <div className="flex items-center">
              <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="CategoryName or ProductName"
                  className="px-1 py-1 w-64 focus:outline-none rounded-l"
                />
                <button
                  onClick={handleSearch}
                  className="bg-[#028090] hover:bg-[#027483] text-white px-2 py-2 flex rounded-r"
                >
                  <FaSearch />
                </button>
                </div>
                <div className="p-2  gap-2 flex">
      <label className="block font-semibold mt-1">Filter</label>
      <select
        value={selectedStatus}
        onChange={handleChange}
        className="border p-1 w-full rounded focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Status</option>
        <option value="lowstock">Low Stock</option>
        <option value="available">Available</option>
        <option value="outofstock">Out of Stock</option>
      </select>
    </div>
   <div className="relative">
   <button className="bg-[#027483] text-white px-2 py-1 rounded mb-1"
   onClick={() => setShowOptions(!showOptions)}>
   
   <PiExportBold  size={24} title="Export Report"/>
   </button>
     {showOptions && (
           <div className="absolute w-12 bg-white border border-gray-300 shadow-lg rounded">
             <button
               className="block w-full text-left px-2 py-1 hover:bg-gray-100"
               onClick={() => handleExport("csv")}
             >
                CSV
             </button>
             <button
               className="block w-full text-left  px-2  py-1 hover:bg-gray-100"
               onClick={() => handleExport("pdf")}
             >
              PDF
             </button>
           </div>
         )}
           </div>
          </div>   
      <div className="h-64  overflow-y-auto">
       <table className="w-full border-collapse">
  <thead>
    <tr className="bg-gray-200 text-left">
      <th className="p-2 border">Medicine</th>
      <th className="p-2 border">Category</th>
      <th className="p-2 border">Stock</th>
      <th className="p-2 border">Expiry</th>
      <th className="p-2 border">Status</th>
      {/* <th className="p-2 border">Actions</th> */}
    </tr>
  </thead>
  <tbody>
    {stockData.map((item, index) => (
      <tr key={index} className={` border ${
        item.stock_status === "Out of Stock"
          ? "bg-red-500 text-white" // Full row red for Out of Stock
          : item.stock_status === "Low Stock"
          ? "bg-white"
          : "bg-white"
      }`}>
        <td className="p-2 border">{item.product_name}</td>
        <td className="p-2 border">{item.product_category}</td>
        <td className="p-2 border">{item.product_quantity} units</td>
        <td className="p-2 border">{item.expiry_date ? item.expiry_date.split("T")[0] : "N/A"}
        </td>
        <td 
  className={`p-2 border ${
    item.stock_status === "Out of Stock"
      ? "text-white"    // Out of Stock (Red)
      : item.stock_status === "Low Stock"
      ? "text-orange-500" // Low Stock (Orange)
      : "text-green-600"  // Available (Green)
  }`}
>
  {item.stock_status}
</td>
      </tr>
    ))}
  </tbody>
    </table>
</div>
</div>
    </div>
  );
};

export default StockReport;
