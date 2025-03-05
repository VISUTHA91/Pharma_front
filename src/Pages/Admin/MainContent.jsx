import React from 'react'
import { Link } from 'react-router-dom'
import { getpharmacydetails } from '../../Api/apiservices';
import { useEffect } from 'react';
import { useState } from 'react';
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);
import { getTotalSalesAmount } from '../../Api/apiservices';
import { getTotalProductCount } from '../../Api/apiservices';
import { getTotalCustomerCount } from '../../Api/apiservices';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
// import { toast } from "react-toastify";



function MainContent() {
  const barData = {
    labels: ["Products", "Orders", "Users", "Out of Stock"],
    datasets: [
      {
        label: "Counts",
        backgroundColor: ["#10B981", "#EF4444", "#14B8A6", "#F59E0B"],
        data: [789654, 789654, 784521, 258],
      },
    ],
  };

  const pieData = {
    labels: ["Products", "Orders", "Users"],
    datasets: [
      {
        data: [789654, 789654, 784521],
        backgroundColor: ["#10B981", "#EF4444", "#14B8A6"],
        hoverOffset: 4,
      },
    ],
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [details, setDetails] = useState([]);
  const [totalSales, setTotalSales] = useState(null);
  const [totalproducts, setTotalproducts] = useState(null);
  const [totalCustomer, setTotalCustomer] = useState(null);
  const [showPrice, setShowPrice] = useState(true); // State to toggle price visibility



  useEffect(() => {
    const pharmacyDetails = async () => {
      try {
        const response = await getpharmacydetails();
        setDetails(response.shops[0]);
        console.log("Fuction list", response)
      } catch (err) {
        setError("Failed to PharmacyDetails");
      } finally {
        setLoading(false);
      }
    };
    pharmacyDetails();
  }, []);


  useEffect(() => {
    const fetchTotalSales = async () => {
      try {
        const data = await getTotalSalesAmount();
        setTotalSales(data);
        // console.log("Total Sales:",data.totalFinalPrice)
      } catch (err) {
        setError("Failed to fetch total sales amount");
      } finally {
        setLoading(false);
      }
    };
    fetchTotalSales();
  }, []);

  useEffect(() => {
    const fetchTotalProducts = async () => {
      try {
        const data = await getTotalProductCount();
        setTotalproducts(data);
      } catch (err) {
        setError("Failed To Fetch Total Products");
      } finally {
        setLoading(false);
      }
    };
    fetchTotalProducts();
  }, []);

  useEffect(() => {
    const fetchTotalCustomerCount = async () => {
      try {
        const data = await getTotalCustomerCount();
        setTotalCustomer(data);
        // console.log("Total Customer:",data)
      } catch (err) {
        setError("Failed To Fetch Total Customer");
      } finally {
        setLoading(false);
      }
    };
    fetchTotalCustomerCount();
  }, []);

  return (
    <div className="flex-grow">
      <h1 className="text-3xl font-semibold mb-8 mt-2"> WelCome To<span className='text-[#027483]'> {details.pharmacy_name}</span></h1>
      {/* Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
        {/* // to="/Admin/AdminProductlist" */}
        {/* <Link className="block mt-4 text-center text-sm hover:text-gray-200">
          {!loading && totalSales !== null ? (
            <div className="bg-blue-400 text-white p-6 rounded-lg shadow-lg">
              <div className="text-center text-xl">Sale Amount</div>
              <div className="text-center text-2xl font-bold">{showPrice ? totalSales.totalFinalPrice : "****"}
              
              <button
                onClick={() => setShowPrice(!showPrice)}
                className="absolute top-2 right-2 text-white text-xl"
              >
                {showPrice ? <AiOutlineEyeInvisible className='text-white' /> : <AiOutlineEye className='text-white' />}
              </button>
              </div>
            </div>) : (<p>No sales data available</p>)}
        </Link> */}
        <div className="mt-4 text-center text-sm">
      {!loading && totalSales !== null ? (
        <div className="bg-blue-400 text-white p-6 rounded-lg shadow-lg relative">
          <div className="text-center text-xl">Sale Amount</div>
          <div className="text-center text-2xl font-bold">
            {showPrice ? totalSales.totalFinalPrice : "****"}
          </div>

          {/* Eye Button */}
          <button 
            onClick={() => setShowPrice(!showPrice)}
            className="absolute top-2 right-2 text-white text-xl"
          >
            {showPrice ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </button>
        </div>
      ) : (
        <p>No sales data available</p>
      )}
    </div>

        {/* Products */}
        <Link
          // to="/Admin/AdminProductlist"
          className="block mt-4 text-center text-sm hover:text-gray-200">
          {!loading && totalproducts !== null ? (
            <div className="bg-green-400 text-white p-6 rounded-lg shadow-lg">
              <div className="text-center text-xl">Products</div>
              <div className="text-center text-2xl font-bold">{totalproducts.total_products}</div>
            </div>) : (<p>No sales data available</p>)}
        </Link>
        {/* Orders */}
        <Link
          // to="/Admin/AdminOrders"
          className="block mt-4 text-center text-sm hover:text-gray-200"
        >
          {/* {!loading && totalSales !== null ? ( */}
          <div className="bg-red-400 text-white p-6 rounded-lg shadow-lg">
            <div className="text-center text-xl">Orders</div>
            <div className="text-center text-2xl font-bold">748</div>
          </div>
          {/* ):(<></>)} */}
        </Link>

        {/* Users */}
        <Link
          // to="/Admin/Userlist"
          className="block mt-4 text-center text-sm hover:text-gray-200"
        >
          {!loading && totalCustomer !== null ? (
            <div className="bg-teal-400 text-white p-6 rounded-lg shadow-lg">
              <div className="text-center text-xl">Customers</div>
              <div className="text-center text-2xl font-bold">{totalCustomer.total_customers}</div>
            </div>
          ) : (<>NO DATA</>)}
        </Link>
      </div>

      {/* Charts Section */}
      <div className="flex gap-6 h-[48vh]  w-full">
        {/* Bar Chart */}
        <div className="shadow-lg rounded-lg w-full">
          <h2 className="text-xl font-semibold text-gray-700">Overview</h2>
          <Bar data={barData} className='h-full' />
        </div>

        {/* Pie Chart */}
        <div className="bg-white shadow-lg rounded-lg p-6 w-1/2 ">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Distribution</h2>
          <Pie data={pieData} />
        </div>
      </div>
    </div>
  )
}
export default MainContent

// <div>
//      <div className="flex-grow p-10">
//             <h1 className="text-3xl font-semibold mb-8">Dashboard</h1>

//             <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
//                 {/* Total Amount */}
//                 <div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg">
//                     <div className="text-center text-xl">Total Amount</div>
//                     <div className="text-center text-2xl font-bold">1824657</div>
//                 </div>

//                 {/* Products */}
//                 <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg">
//                     <div className="text-center text-xl">Products</div>
//                     <div className="text-center text-2xl font-bold">789654</div>
//                     <Link
//                         to="/Admin/AdminProductlist"
//                         className="block mt-4 text-center text-sm underline hover:text-gray-200"
//                     >
//                         View Details
//                     </Link>
//                 </div>

//                 {/* Orders */}
//                 <div className="bg-red-500 text-white p-6 rounded-lg shadow-lg">
//                     <div className="text-center text-xl">Orders</div>
//                     <div className="text-center text-2xl font-bold">789654</div>
//                     <Link
//                         to="/Admin/AdminOrders"
//                         className="block mt-4 text-center text-sm underline hover:text-gray-200"
//                     >
//                         View Details
//                     </Link>
//                 </div>

//                 {/* Users */}
//                 <div className="bg-teal-500 text-white p-6 rounded-lg shadow-lg">
//                     <div className="text-center text-xl">Users</div>
//                     <div className="text-center text-2xl font-bold">784521</div>
//                     <Link
//                         to="/Admin/Userlist"
//                         className="block mt-4 text-center text-sm underline hover:text-gray-200"
//                     >
//                         View Details
//                     </Link>
//                 </div>

//                 {/* Out of Stock */}
//                 <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-lg">
//                     <div className="text-center text-xl">Out of Stock</div>
//                     <div className="text-center text-2xl font-bold">258</div>
//                 </div>
//             </div>
//         </div>
// </div>