import React, { useEffect, useState } from "react";
import { AiOutlineCalendar, AiOutlineBarChart, AiOutlineRise, AiOutlinePieChart } from "react-icons/ai";
import { fetchInvoices } from "../../Api/apiservices";
import PaginationComponent from "../../Components/PaginationComponent";
import {getIncomeReport} from '../../Api/apiservices';
import { toast } from "react-toastify";
import { AiOutlineEye, AiOutlineEyeInvisible, } from "react-icons/ai";
// import Month from "react-datepicker/dist/month";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Ensure this is included


const IncomePage = () => {
  const [incomeData, setIncomeData] = useState({
    today: 0,
    month: 0,
    sixmonth: 0,
    year: 0,
  });
  const [invoices, setInvoices] = useState([]);
  const [incomeList, setIncomeList] = useState([]);
  const [loading,setLoading] = useState([]);
  const [error , setError] = useState([]);
  const [limit, setLimit] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showIncome, setShowIncome] = useState(false);



  useEffect(() => {
    const fetchAllReports = async () => {
      try {
        setLoading(true);
        const [daily,monthly,sixmonth, yearly] = await Promise.all([
          getIncomeReport("DAILY"),
          getIncomeReport("MONTHLY"),
          getIncomeReport("6MONTH"),
          getIncomeReport("YEARLY"),
        ]);
        // Update state with fetched values
        console.log("Daily Income Report:", daily.data.total_income);
        console.log("Monthly Income Report:", monthly.data.total_income);
        console.log("Weekly Income Report:", sixmonth.data.total_income);
        console.log("Yearly Income Report:", yearly.data.total_income);
        getIncomeReport("daily").then(console.log).catch(console.error);
        setIncomeData({
          today: daily.data.total_income || 0,
          month: monthly.data.total_income || 0,
          sixmonth: sixmonth.data.total_income || 0,
          year: yearly.data.total_income || 0,
        });
        // console.log("Updated Income Data:", {
        //   today: daily?.total_income || 0,
        //   week: weekly?.total_income || 0,
        //   month: monthly?.total_income || 0,
        //   year: yearly?.total_income || 0,
        // });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllReports();
  }, []);

  useEffect(() => {
    const invoicelist = async () => {
      try {
        const data = await fetchInvoices(currentPage, limit);
        console.log("Income Data", data);
        setLimit(data.limit);
        setTotalPages(data.total_page);
        setCurrentPage(data.page)
        setInvoices(data.data);
      } catch (err) {
        setError("Failed to fetch invoices");
      } finally {
        setLoading(false);
      }
    };
    invoicelist();
  }, [currentPage]);

  const cards = [
    { title: "Today", value: incomeData.daily, icon: <AiOutlineCalendar />, bgColor: "from-blue-500 to-blue-300" },
    { title: "This Month", value:incomeData.month, icon: <AiOutlinePieChart />, bgColor: "from-yellow-500 to-yellow-300" },
    { title: "Six Month", value: incomeData.sixmonth, icon: <AiOutlineBarChart />, bgColor: "from-green-500 to-green-300" },
    { title: "This Year", value:incomeData.year, icon: <AiOutlineRise />, bgColor: "from-purple-500 to-purple-300" },
  ];

  return (
    <div className="p-2">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Income Overview</h1>
      {/* <div className="relative">
      <button
        onClick={() => setShowIncome(!showIncome)}
        className="absolute top-2 right-2 bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition"
      >
        {showIncome ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
        {[
          { label: "Today", value: incomeData.today, icon: <AiOutlineCalendar />, bgColor: "bg-blue-400" },
          { label: "This Month", value: incomeData.month, icon: <AiOutlineRise />, bgColor: "bg-yellow-400" },
          { label: "Six Months ", value: incomeData.sixmonth, icon: <AiOutlineBarChart />, bgColor: "bg-green-400" },
          { label: "This Year", value: incomeData.year, icon: <AiOutlinePieChart />, bgColor: "bg-purple-400" },
        ].map((card, index) => (
          <div
            key={index}
            className={`bg-gradient-to-r ${card.bgColor} shadow-lg rounded-lg p-6 flex items-center gap-4 transform hover:scale-105 transition duration-300 overflow-hidden`}
          >
            <div className="text-white text-4xl">{card.icon}</div>
            <div>
              <h2 className="text-white text-lg font-medium">{card.label}</h2>
              <p className="text-white text-3xl font-bold">
                {showIncome ? `₹${card.value.toLocaleString()}` : "****"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div> */}
    <div className="relative min-h-[50px]">
    <button
  onClick={() => setShowIncome(!showIncome)}
  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-400 transition z-50"
>
  {showIncome ?   <AiOutlineEyeInvisible size={20} />: <AiOutlineEye size={20} />  }
</button>
  
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mt-10 relative">
    {[
      { label: "Today", value: incomeData.today, icon: <AiOutlineCalendar />, bgColor: "bg-blue-400" },
      { label: "This Month", value: incomeData.month, icon: <AiOutlineRise />, bgColor: "bg-yellow-400" },
      { label: "Six Months", value: incomeData.sixmonth, icon: <AiOutlineBarChart />, bgColor: "bg-green-400" },
      { label: "This Year", value: incomeData.year, icon: <AiOutlinePieChart />, bgColor: "bg-purple-400" },
    ].map((card, index) => (
      <div
        key={index}
        className={`bg-gradient-to-r ${card.bgColor} shadow-lg rounded-lg p-6 flex items-center gap-2 transform hover:scale-105 transition duration-300 overflow-hidden`}
      >
        <div className="text-white text-4xl">{card.icon}</div>
        <div>
          <h2 className="text-white text-lg font-medium">{card.label}</h2>
          <div className="flex ">
  <p className="text-white text-3xl font-bold flex-1 truncate">
    {showIncome ? `₹${card.value.toLocaleString()}` : "*****"}
  </p>
</div>
        </div>
      </div>
    ))}
  </div>
</div>
       <div className="mt-4 h-[62vh] shadow-lg rounded-lg p-6 h-1/2 overflow-auto scrollbar-hidden">
       <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800 mb-1">Income List</h2>
        <PaginationComponent
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage} />
          </div>
        <div className="overflow-y-scroll h-[70vh]  scrollbar-hidden">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-[#027483] text-white text-left">
                <th className="px-4 py-2 border border-gray-300">Invoice ID</th>
                <th className="px-4 py-2 border border-gray-300">Date</th>
                <th className="px-4 py-2 border border-gray-300">Amount</th>
                {/* <th className="px-4 py-2 border border-gray-300">Detail</th> */}
              </tr>
            </thead>
            <tbody>
            {invoices.map((invoice, index) => (
              // {incomeList.map((income, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border border-gray-300">{invoice.invoice_number}</td>
                  {/* <td className="px-4 py-2 border border-gray-300">{invoice.category}</td> */}
                  <td className="px-4 py-2 border border-gray-300">{invoice.invoice_created_at.split("T")[0]}</td>
                  <td className="px-4 py-2 border border-gray-300">₹{invoice.finalPriceWithGST}</td>
                  {/* <td className="px-4 py-2 border border-gray-300">{invoice.detail}</td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default IncomePage;
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// const incomeData = [
//   { date: 'Nov 21', income: 870 },
//   { date: 'Nov 28', income: 1400 },
//   { date: 'Nov 29', income: 240 },
// ];

// export default function Income() {
//   return (
//     <div className="p-6">
//       {/* Summary Cards */}
//       <div className="grid grid-cols-4 gap-4 mb-6">
//         {["Today", "This Week", "This Month", "This Year"].map((label, index) => (
//           <div key={index} className="bg-white shadow-md p-4 rounded-lg flex flex-col items-center">
//             <h3 className="text-lg font-semibold">{label}</h3>
//             <p className="text-2xl font-bold text-blue-600">₹0</p>
//           </div>
//         ))}
//       </div>

//       {/* Income Trend Chart */}
//       <div className="bg-white shadow-md p-6 rounded-lg">
//         <h3 className="text-lg font-semibold mb-4">Income Trend</h3>
//         <ResponsiveContainer width="100%" height={300}>
//           <LineChart data={incomeData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="date" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Line type="monotone" dataKey="income" stroke="#8884d8" strokeWidth={3} />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>

//       {/* Income Table */}
//       <div className="bg-white shadow-md p-6 rounded-lg mt-6">
//         <h3 className="text-lg font-semibold mb-4">Income List</h3>
//         <table className="w-full border-collapse border">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="border p-2">Invoice ID</th>
//               <th className="border p-2">Date</th>
//               <th className="border p-2">Amount</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr className="text-center">
//               <td className="border p-2">INV-20241121-001</td>
//               <td className="border p-2">2024-11-21</td>
//               <td className="border p-2">₹290</td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
