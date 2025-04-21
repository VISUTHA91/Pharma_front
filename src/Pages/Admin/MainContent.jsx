import React from 'react'
import { Link } from 'react-router-dom'
import { getpharmacydetails } from '../../Api/apiservices';
import { useEffect } from 'react';
import { useState } from 'react';
import {getMostSoldItems} from '../../Api/apiservices';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

import { getTotalSalesAmount } from '../../Api/apiservices';
import { getTotalProductCount } from '../../Api/apiservices';
import { getTotalCustomerCount } from '../../Api/apiservices';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import {getCategorywithoutpagination} from '../../Api/apiservices';
import { fetchInvoices} from '../../Api/apiservices';
import {fetchProductsforreport} from '../../Api/apiservices';





function MainContent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [details, setDetails] = useState([]);
  const [totalSales, setTotalSales] = useState(null);
  const [totalproducts, setTotalproducts] = useState(null);
  const [totalCategory, setTotalCategory] = useState(null);
  const [totalCustomer, setTotalCustomer] = useState(null);
  const [showPrice, setShowPrice] = useState(false); // State to toggle price visibility
  const [data , setData] = useState([]);
  const [salesData , setSalesData] = useState([]);
  const [totalInvoice , setTotalInvoice] = useState([]);



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
    const fetchInvoiceCount = async () => {
      try {
        const data = await fetchInvoices();
        setTotalInvoice(data.total_invoice);
        console.log("Total Invoive:",data.total_invoice)
      } catch (err) {
        setError("Failed to fetch total sales amount");
      } finally {
        setLoading(false);
      }
    };
    fetchInvoiceCount();
  }, []);

  useEffect(() => {
    const fetchTotalCategory = async () => {
      try {
        const data = await getCategorywithoutpagination();
        setTotalCategory(data.data?.length);
        console.log("Data Length:", data.data?.length);
        console.log("total Category",data.data)
      } catch (err) {
        setError("Failed To Fetch Total Products");
      } finally {
        setLoading(false);
      }
    };
    fetchTotalCategory();
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

// useEffect(() => {
//   const fetchStockData = async () => {
//       try {
//         const data = await fetchProductsforreport(); // Fetch all products when no filter is selected
//           setData(data.data);
//           console.log("MAIN DATA",data.data)
//         }
//        catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchStockData();
//   },[]);

// useEffect(() => {
//   const fetchStockData = async () => {
//     try {
//       const response = await fetchProductsforreport();
//       console.log("DATA<><><>",response.data)
//       const formattedData = response.data.map(item => ({
//         name: item.product_name,
//         value: item.product_quantity
//       }));
//       setData(formattedData);
//     } catch (err) {
//       console.error("Error fetching data:", err);
//     }
//   };
//   fetchStockData();
// }, []);
  
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await getMostSoldItems("1month"); // Fetch data
      console.log("API Response:", response.data); // Debugging log
      setSalesData(response.data || []); // Ensure it's always an array
    } catch (error) {
      console.error("Error fetching data:", error);
      setSalesData([]); // Set to empty array on error
    }
  };

  fetchData();
}, []);

const pieData = {
  labels:  salesData.map(item => item.product_name) , // Extract product names safely
  datasets: [
    {
      data: salesData.map(item => item.total_quantity_sold),
      backgroundColor: ["#10B981", "#EF4444", "#14B8A6", "#F59E0B", "#6366F1"],
      hoverOffset: 4,
    },
  ],
};

const barData = {
  labels:  salesData.map(item => item.product_name) , // Extract product names safely
  datasets: [
    {
      data: salesData.map(item => item.total_sales_amount),
      backgroundColor: ["#10B981", "#EF4444", "#14B8A6", "#F59E0B", "#6366F1"],
      hoverOffset: 4,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false, // Allow manual control of height/width
};

return (
    <div className="flex-grow">
      <h1 className="text-3xl font-semibold mb-8 mt-2"> WelCome To<span className='text-[#027483]'> {details.pharmacy_name}</span></h1>
      {/* Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
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
              <div className="text-center text-xl">Category</div>
              <div className="text-center text-2xl font-bold">{totalCategory}</div>
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
            <div className="text-center text-2xl font-bold">{totalInvoice}</div>
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
      <div className="flex h-[50vh]  w-full">
        {/* Bar Chart */}
         <div className="shadow-lg rounded-lg w-1/2">
          <h2 className="text-xl font-semibold text-gray-700"> Sale Amount </h2>
            <div style={{ width: "400px", height: "220px" }}>
              <Pie data={barData} options={options} />
            </div>
         </div> 
        {/* Pie Chart */}
        <div className="bg-white shadow-lg rounded-lg p-4 w-1/2 ">
          <h2 className="text-xl font-semibold  text-gray-700">Medicine Sold</h2>
           <div style={{ width: "400px", height: "220px" }}>
              <Pie data={pieData} options={options} />
            </div>
        </div>
        {/* <div className="flex flex-col lg:flex-row h-auto w-full gap-4"> */}
  {/* Bar Chart */}
  {/* <div className="shadow-lg rounded-lg p-4 w-full lg:w-1/2">
    <h2 className="text-xl font-semibold text-gray-700">Sale Amount</h2>
    <div className="w-full h-[220px]">
      <Pie data={barData} options={options} />
    </div>
  </div> */}

  {/* Pie Chart */}
  {/* <div className="bg-white shadow-lg rounded-lg p-4 w-full lg:w-1/2">
    <h2 className="text-xl font-semibold text-gray-700">Medicine Sold</h2>
    <div className="w-full h-[220px]">
      <Pie data={pieData} options={options} />
    </div>
  </div> */}
{/* </div> */}

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
  // const barData = {
  //   labels: ["Products", "Orders", "Users", "Out of Stock"],
  //   datasets: [
  //     {
  //       label: "Counts",
  //       backgroundColor: ["#10B981", "#EF4444", "#14B8A6", "#F59E0B"],
  //       data: [789654, 789654, 784521, 258],
  //     },
  //   ],
  // };

  // const pieData = {
  //   labels: ["Products", "Orders", "Users"],
  //   datasets: [
  //     {
  //       data: [789654, 789654, 784521],
  //       backgroundColor: ["#10B981", "#EF4444", "#14B8A6"],
  //       hoverOffset: 4,
  //     },
  //   ],
  // };