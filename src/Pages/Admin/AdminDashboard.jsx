import React, { useState } from 'react'
import MainContent from './MainContent';
import { HiOutlineUserGroup } from "react-icons/hi";
import { TbLayoutDashboard } from "react-icons/tb";
import { FaShoppingBasket } from "react-icons/fa";
import { GoPlus } from "react-icons/go";
import { GrProductHunt } from "react-icons/gr";
import { FaFirstOrder } from "react-icons/fa";
import { MdReviews } from "react-icons/md";
import { TbLogout2 } from "react-icons/tb";
import Registration from './Registration';
import AdminCategory from './AdminCategory';
import ProductCreation from './ProductCreation';
import Supplier from './Supplier';
import ReturnPage from './ReturnPage';
import Billing from './Billing';
import Income from './Income';
import Invoice from './Invoice';
import Expense from './Expense';
import SalesReport from './SalesReport';
import BinTable from './BinTable';
import { IoSettingsSharp } from "react-icons/io5";
import { IoTrashBin } from "react-icons/io5";
import { FaSackDollar } from "react-icons/fa6";
import { FaHospitalUser } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { RiBillFill } from "react-icons/ri";
import { MdAccountTree } from "react-icons/md"; 
import Settings from './Settings';
import { Outlet, useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { IoIosArrowDropdown } from "react-icons/io";
import { TbLogout } from "react-icons/tb";
import { ImProfile } from "react-icons/im";
import { toast } from 'react-toastify';
import { LuChartNoAxesCombined } from "react-icons/lu";

function AdminDashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [details, setDetails] = useState([]);
  const navigate = useNavigate();
  const handleMenuClick = (option) => {
    console.log(option); // Handle navigation or functionality for each option here
    setIsOpen(false); // Close the dropdown after selection
  };
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("logindata")
    // setIsAuthenticated(false);
    toast.success("Logged Out");
    navigate("/")
    window.location.reload();
  };
  const adminContent = (
    <ul className="space-y-1">
        <li>
        <NavLink to={'/Dashboard'}
          // onClick={() => setCurrentPage("Maincontent")}
          className="flex items-center gap-4 w-full p-2  rounded-lg hover:bg-blue-100 hover:text-blue-800 transition duration-200"
        >
          <TbLayoutDashboard className="text-2xl" />
          Dashboard
        </NavLink>
      </li>

      <li>
        <NavLink
        to={'Registration'}
          // onClick={() => setCurrentPage("Staff")}
          className="flex items-center gap-4 w-full p-2  rounded-lg hover:bg-blue-100 hover:text-blue-800 transition duration-200"
        >
          <FaUser className="text-2xl" />
          Staff
        </NavLink>
      </li>

       {/* Suppliers */}
       <li>
        <NavLink to={'Supplier'}
          // onClick={() => setCurrentPage("Suppliers")}
          className="flex items-center gap-4 w-full p-2  rounded-lg hover:bg-blue-100 hover:text-blue-800 transition duration-200"
        >
          {/* <FaFirstOrder  /> */}
          <FaHospitalUser className="text-2xl" />

          Supplier
        </NavLink>
      </li>

      {/* Category */}
      <li>
        <NavLink
        to={'AdminCategory'}
          // onClick={() => setCurrentPage("Category")}
          className="flex items-center gap-4 w-full p-2  rounded-lg hover:bg-blue-100 hover:text-blue-800 transition duration-200"
        >
          {/* <GrProductHunt className="text-2xl" /> */}
          <MdAccountTree className="text-2xl"/>

          Category
        </NavLink>
      </li>

      {/* Product List */}
      <li>
        <NavLink to={'ProductCreation'}
          // onClick={() => setCurrentPage("Products")}
          className="flex items-center gap-4 w-full p-2 rounded-lg hover:bg-blue-100 hover:text-blue-800 transition duration-200"
        >
          <GrProductHunt className="text-2xl" />
          Products
        </NavLink>
      </li>

       {/* Billing */}
       <li>
        <NavLink to={'Billing'}
          // onClick={() => setCurrentPage("Billing")}
          className="flex items-center gap-4 w-full p-2  rounded-lg hover:bg-blue-100 hover:text-blue-800 transition duration-200"
        >
          <RiBillFill className="text-2xl" />
          Billing
        </NavLink>
      </li>

      {/* Finance */}
      <li>
        <div
            onMouseEnter={() =>  setIsOpen(true)}
            onMouseLeave={() =>  setIsOpen(false)}
            className=" relative flex items-center gap-4 w-full p-2 rounded-lg hover:bg-blue-100 hover:text-blue-800 transition duration-200"
            >
                      {/* <TbLogout2 className="text-2xl" /> */}
            <FaSackDollar className="text-2xl"/>

            Finance <IoIosArrowDropdown className='text-xl ml-20' />

          {isOpen && (
            <div className="absolute left-0 mt-40 text-black w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10">
              <NavLink  to={'Income'}
                // onClick={() => setCurrentPage("Income")}
                onClick={() => setIsOpen(false)}

                className="block w-full px-4 py-2 text-left hover:bg-blue-100 hover:text-blue-800 transition duration-200"
              >
                Income
              </NavLink>
              <NavLink to={'Expense'}
                // onClick={() => setCurrentPage("Expense")}
                className="block w-full px-4 py-2 text-left hover:bg-blue-100 hover:text-blue-800 transition duration-200"
              >
                Expense
              </NavLink>
              <NavLink to={'Invoice'}
                // onClick={() => setCurrentPage("Invoice")}
                onClick={() => setIsOpen(false)}

                className="block w-full px-4 py-2 text-left hover:bg-blue-100 hover:text-blue-800 transition duration-200"
              >
                Invoice
              </NavLink>
            </div>
          )}
        </div>
      </li>

     

    

      <li>
        <div className="relative">
  <button
    onClick={() => setShowDropdown(!showDropdown)}
    className="flex items-center gap-4 w-full p-2 rounded-lg hover:bg-blue-100 hover:text-blue-800 transition duration-200"
  >
    {/* <GrProductHunt className="text-2xl" /> */}
    <LuChartNoAxesCombined  className='text-2xl'/>

    Report <IoIosArrowDropdown className='text-xl ml-20' />
  </button>
  {showDropdown && (
    <div className="absolute top-12 left-0 w-full text-black bg-white border border-gray-200 rounded-lg shadow-md">
      <NavLink to={'SalesReport'}
        onClick={() => setShowDropdown(false)}

        className="block w-full text-left px-4 py-2 hover:bg-blue-100 hover:text-blue-800 transition duration-200"
      >
        Sales Report
      </NavLink>
      <NavLink to={'StockReport'}
            onClick={() => setShowDropdown(false)}
        className="block w-full text-left px-4 py-2 hover:bg-blue-100 hover:text-blue-800 transition duration-200"
      >
        Stock Report
      </NavLink>
    </div>
  )}
</div>

      </li>

        {/* Return */}
        <li>
        <NavLink to={'ReturnPage'}
          // onClick={() => setCurrentPage("Return")}
          className="flex items-center gap-4 w-full p-2 rounded-lg hover:bg-blue-100 hover:text-blue-800 transition duration-200"
        >
          {/* <HiOutlineUserGroup className="text-2xl" /> */}
          <TbLogout2 className="text-2xl" />

          Return
        </NavLink>
      </li>



   

    

      <li>
        <NavLink to={'BinTable'}
          // onClick={() => setCurrentPage("Bin")}
          className="flex items-center gap-4 w-full p-2   rounded-lg hover:bg-blue-100 hover:text-blue-800 transition duration-200"
        >
          {/* <IoSettingsSharp className="text-2xl" /> */}
          <IoTrashBin className="text-2xl" />

          {/* <GrProductHunt className="text-2xl" /> */}
          Bin
        </NavLink>
      </li>

      <li>
        <NavLink to={'Settings'}
          // onClick={() => setCurrentPage("Settings")}
          className="flex items-center gap-4 w-full p-2   rounded-lg hover:bg-blue-100 hover:text-blue-800 transition duration-200"
        >
          {/* <IoSettingsSharp className="text-2xl" /> */}
          <ImProfile  className="text-2xl"/>
          Profile
        </NavLink>
      </li>
      
      <li>
                <button
                  onClick={handleLogout}
                  // className="flex items-center text-gray-300 hover:text-white gap-2">
                  className="flex items-center gap-4 w-full p-2   rounded-lg hover:bg-blue-100 hover:text-blue-800 transition duration-200">
                  <TbLogout className='text-2xl' />
                  <span className="hidden lg:block">LogOut</span>
                </button>
      </li>     
    </ul>
  );

  const staffContent = (
    <ul className="space-y-1">
      {/* Category */}
      <li>
        <NavLink to={'ProductCreation'}
          // onClick={() => setCurrentPage("Products")}
          className="flex items-center gap-4 w-full p-2  rounded-lg hover:bg-blue-100 hover:text-blue-800 transition duration-200"
        >
          <GrProductHunt className="text-2xl" />
          Products
        </NavLink>
      </li>


      {/* Product List */}
      <li>
        <NavLink to={'Billing'}
          // onClick={() => setCurrentPage("Billing")}
          className="flex items-center gap-4 w-full p-2 rounded-lg hover:bg-blue-100 hover:text-blue-800 transition duration-200"
        >
          <GrProductHunt className="text-2xl" />
          Billing
        </NavLink>
      </li>

      {/* Customers */}
      <li>
        <NavLink to={'Invoice'}
          // onClick={() => setCurrentPage("Invoice")}
          className="flex items-center gap-4 w-full p-2 rounded-lg hover:bg-blue-100 hover:text-blue-800 transition duration-200"
        >
          <HiOutlineUserGroup className="text-2xl" />
          Invoice
        </NavLink>
      </li>
      <li>
        <NavLink to={'Income'}
          // onClick={() => setCurrentPage("Sales & Report")}
          className="flex items-center gap-4 w-full p-2   rounded-lg hover:bg-blue-100 hover:text-blue-800 transition duration-200"
        >
          {/* <HiOutlineUserGroup className="text-2xl" /> */}
          <TbLogout2 className="text-2xl" />
          Sales  & Report
        </NavLink>
      </li>
      <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-4 w-full p-2   rounded-lg hover:bg-blue-100 hover:text-blue-800 transition duration-200">
                                      <TbLogout className=' rounded mt-1 text-5xl lg:text-base' />
                  <span className="hidden lg:block">LogOut</span>
                </button>
              </li>
    </ul>
  );

  const token = localStorage.getItem("authToken");
  const Data = JSON.parse(localStorage.getItem("logindata"));
  console.log("............",Data);
  
  return (
    <div className="flex h-screen w-[100%]">
      <div className="bg-[#027483] text-white shadow-[-2px_6px_16px_17px_rgba(0,_0,_0,_0.2)]h-screen ">
        <div className="w-60 bg-[#027483] text-white  mt-2 ml-4  scrollbar-hidden">
          {Data.role === "admin" ? adminContent : staffContent}
        </div>
      </div>
      {/* Main Content */}
      <div className='bg-gray-100 w-full m-1 rounded-lg '>
      {/* <div className="p-8 h-[96%] overflow-auto scrollbar-hidden "> */}
      <div className="h-screen p-2">
        <Outlet />
        </ div>
      </div>
    </div>
  )
}
export default AdminDashboard

   {/* Billing */}
//    <li>
//    <NavLink to={'Billing'}
//      // onClick={() => setCurrentPage("Billing")}
//      className="flex items-center gap-4 w-full p-2  rounded-lg hover:bg-blue-100 hover:text-blue-800 transition duration-200"
//    >
//      <RiBillFill className="text-2xl" />
//      Billing
//    </NavLink>
//  </li>