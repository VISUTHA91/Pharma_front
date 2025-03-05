import { useState, useEffect } from "react";
// import axiosInstance from "../../Api/axiosInstance";
// import { Table } from "@/components/ui/table"; // Example using ShadCN UI
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart,Line } from "recharts";
import { fetchProductsforreport } from "../../Api/apiservices";
import { FaSearch } from "react-icons/fa";
import { PiExportBold } from "react-icons/pi";



// import { Table, TableHead, TableRow, TableBody, TableCell } from "@/components/ui/table";
const StockReport = () => {
  const [stockData, setStockData] = useState([]);
    const [query, setQuery] = useState("");
  
    const handleSearch = () => {
      if (query.trim() !== "") {
        onSearch(query);
      }
    };
    const [selectedStatus, setSelectedStatus] = useState("");

    // const FixedHeaderTable = () => {
    //   const data = Array.from({ length: 20 }, (_, i) => ({
    //     name: `Product ${i + 1}`,
    //     price: `$${(i + 1) * 5}`,
    //     quantity: Math.floor(Math.random() * 10) + 1,
    //   }));

    const handleChange = (event) => {
      const value = event.target.value;
      setSelectedStatus(value);
      onFilterChange(value); // Pass selected filter to parent component
    };

  useEffect(() => {
    fetchStockReport();
  }, []);

  const fetchStockReport = async () => {
    try {
      const response = await fetchProductsforreport();
      setStockData(response.data);
    } catch (error) {
      console.error("Error fetching stock report:", error);
    }
  };

  return (
    <div className=" ">
      <h2 className="text-xl font-semibold">Stock Report</h2>

      {/* Stock Overview Chart */}
      {/* <ResponsiveContainer width="100%" height={250}>
        <BarChart data={stockData}>
          <XAxis dataKey="product_name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="product_quantity" fill="#4CAF50" />
        </BarChart>
      </ResponsiveContainer> */}
      <ResponsiveContainer width="100%" height={150}>
  <LineChart data={stockData}>
    <XAxis dataKey="product_name" />
    <YAxis   domain={[0, 1000]}  // Define the min & max range
      ticks={[0, 200, 400, 600, 800,1000]} // Custom tick values
      tickCount={7} 
      // Ensures all 6 ticks are considered
      // label={{ value: "Stock Quantity", angle: -90, position: "insideLeft" ,offset: 10, fill: "black",fontWeight: "bold"}}
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
        <option value="low-stock">Low Stock</option>
        <option value="available">Available</option>
        <option value="out-of-stock">Out of Stock</option>
      </select>
    </div>
    <button
        className="bg-[#027483] text-white px-2 py-1 rounded mb-1"
        >
        <PiExportBold />
      </button>
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
{/* 
        <td className="p-2 border">
          <button className="bg-blue-500 text-white px-2 py-1 rounded">Restock</button>
        </td> */}
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
