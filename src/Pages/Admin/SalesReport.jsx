import React, { useState , useEffect} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getMostSoldItems } from "../../Api/apiservices";
import { FaSearch } from "react-icons/fa";
import {getAllSoldProducts} from '../../Api/apiservices';
import { PiExportBold } from "react-icons/pi";
// import {downloadSalesReport } from '../../Api/apiservices';
import { toast } from "react-toastify";
import {downloadSalesReportCSV} from '../../Api/apiservices';
import {downloadSalesReportPDF}from '../../Api/apiservices';

const SalesReport = () => {
  const [selectedFilter, setSelectedFilter] = useState(7);
  const [mostSold, setMostSold] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const colors = ["bg-blue-400", "bg-green-400", "bg-yellow-400"];
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [showOptions, setShowOptions] = useState(false);

  const [salesData, setSalesData] = useState({
    7: [],
    15: [],
    30: []
  });
  const [filteredSalesData, setFilteredSalesData] = useState(salesData[selectedFilter]);
  const [query, setQuery] = useState("");

  // const handleSearch = () => {
  //   if (query.trim() !== "") {
  //     onSearch(query);
  //   }
  // };


  
    const fetchMostSoldMedicines = async (period) => {
      setLoading(true);
      setError("");
      try {
        const periodMapping = { 7: "1week", 14: "2week", 30: "1month" };
        const response = await getMostSoldItems(periodMapping[period]);
        if ((response.data)) {
          setSalesData(prevData => ({
            ...prevData,
            [period]: response.data // Store response in correct period key
          }));
        }
        // console.log("Most Sold Items in Page", response.data);
      } catch (err) {
        setError("Error fetching data. Please try again.");
      }
      setLoading(false);
    };
       
    useEffect(() => {
      fetchMostSoldMedicines(selectedFilter);
    }, [selectedFilter]);

  const handleFilterChange = (days) => {
    setSelectedFilter(days);
  };

  useEffect(() => {
    setFilteredSalesData(salesData[selectedFilter] || []);
  }, [salesData, selectedFilter]);


  const [soldProducts, setSoldProducts] = useState([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    period: "",
    productName: "",
    categoryName: "",
  });
  useEffect(() => {
    fetchSoldProducts();
  }, []);

  const fetchSoldProducts = async () => {
    try {
      const data = await getAllSoldProducts(filters);
      console.log("PAGE SALES DATA",data)
      setSoldProducts(data.data);
    } catch (error) {
      console.error("Failed to fetch sold products:", error);
    }
  };
// const filterSalesData = (start, end) => {
//   if (start && end) {
//     const filtered = salesData[selectedFilter].filter((item) => {
//       const saleDate = new Date(item.saleDate); // Assuming each sale has a `saleDate`
//       return saleDate >= new Date(start) && saleDate <= new Date(end);
//     });
//     setFilteredSalesData(filtered);
//   } else {
//     setFilteredSalesData(salesData[selectedFilter]);
//   }
// };
const handleSearch = () => {
  setFilters((prevFilters) => ({
    ...prevFilters,
    productName: query.trim(),
    startDate: startDate ? startDate.toString().split("T")[0] : "",
    endDate: endDate ? endDate.toString().split("T")[0] : "",
  }));
  fetchSoldProducts(); // Fetch filtered products after updating state
};

// const handleExport = async (format) => {
//   try {
//     await downloadSalesReport(format); // Call API service
//     toast.success("Download Successfully");
//   } catch (error) {
//     toast.error("Export failed:", error);
//   }
//   setShowOptions(false);
// };
const handleExport = async (format) => {
  try {
    if (format === "csv") {
      await downloadSalesReportCSV();
    } else if (format === "pdf") {
      await downloadSalesReportPDF();
    } else {
      throw new Error("Invalid format specified");
    }
    toast.success("Download Successfully");
  } catch (error) {
    console.error("Export failed:", error);
    toast.error("Export failed");
  }
  setShowOptions(false);
};


  return (
    <div className="p-4">
<div className="">
  <div className="flex justify-between items-center">
    <h2 className="text-lg font-semibold">Most Sold Medicines</h2>
    {/* Filter Dropdown */}
    <select
      value={selectedFilter}
      onChange={(e) => handleFilterChange(Number(e.target.value))}
      className="px-2 py-1 border rounded bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value={7}>Last 7 Days</option>
      <option value={14}>Last 14 Days</option>
      <option value={30}>Last 30 Days</option>
    </select>
  </div>

  {/* Progress Bars */}
 
    {/* {!loading && !error && salesData.length < 0 && salesData.map((item, index) => ( */}
    {!loading && !error && salesData[selectedFilter] && salesData[selectedFilter].length > 0 ? (
    salesData[selectedFilter].slice(0, 3).map((item, index) => (
    <div key={index} className="mb-2">
      <div className="flex justify-between mb-1">
        <span>{item.product_name}</span>
        <span>{item.total_quantity_sold} units</span>
      </div>
      <div className="w-full bg-gray-300 rounded">
        <div
          className={`${colors[index % colors.length]} h-4 rounded`}
          style={{ width: `${(item.percentage_of_total_sales/100) * 100}%` }}
        ></div>
      </div>
    </div>))):(<>No Data</>)}
              {/* {!loading && salesData.length === 0 && !error && <p>No data available.</p>} */}

</div>

      <div className=" mt-8">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-lg font-semibold">Sales Details</h2>
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
    <div className="flex items-center space-x-2">
  {/* Start Date Picker */}
  <DatePicker
    selected={filters.startDate}
    onChange={(date) => setFilters((prev) => ({ ...prev, startDate: date }))}
    placeholderText="Start Date"
    className="border border-gray-300 rounded px-1 py-1 w-28"
  />

  {/* 'To' Label */}
  <span className="text-gray-600 font-medium">To</span>
  {/* End Date Picker */}
  <DatePicker
    selected={filters.endDate}
    onChange={(date) => setFilters((prev) => ({ ...prev, endDate: date }))}
    placeholderText="End Date"
    className="border border-gray-300 rounded px-1 py-1 w-28"
  />
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



  {/* Sales Table */}
  <div className=" h-56 overflow-x-auto">
  <table className="w-full border-collapse border border-gray-300">
    <thead>
      <tr className="bg-gray-200">
        <th className="border border-gray-300 px-2 py-2">Product Name</th>
        <th className="border border-gray-300 px-2 py-2">Category Name</th>
        {/* <th className="border border-gray-300 px-4 py-2">Price</th> */}
        <th className="border border-gray-300 px-2 py-2">Sale Quantity</th>
        <th className="border border-gray-300 px-2 py-2">Sale Amount</th>
      </tr>
    </thead>
    <tbody>
    {Array.isArray(soldProducts) && soldProducts.length > 0 ? (
      soldProducts.map((item, index) => (
        <tr key={index} className="hover:bg-gray-100 text-sm">
          <td className="border border-gray-300 px-2 py-2">{item.product_name}</td>
          <td className="border border-gray-300 px-2 py-2">{item.category_name}</td>
          {/* <td className="border border-gray-300 px-4 py-2">{item.final_price}</td> */}
          <td className="border border-gray-300 px-2 py-2 ">{item.quantity_sold}</td>
          <td className="border border-gray-300 px-2 py-2">Rs. {item.final_price}</td>
        </tr>
      ))
    ):(<>NO DATA AVILABLE</>)}
    </tbody>
  </table>
  </div>
</div>
    </div>
  );
};

export default SalesReport;
