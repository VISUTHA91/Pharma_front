import React, { useState , useRef, useEffect} from 'react'
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
  const dropdownRef = useRef(null);

  const navigate = useNavigate();
  const handleMenuClick = (option) => {
    console.log(option); // Handle navigation or functionality for each option here
    setIsOpen(false); // Close the dropdown after selection
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
          className="flex items-center gap-4 w-56 p-2  rounded-lg hover:bg-blue-100 hover:text-blue-800 transition duration-200"
        >
          <TbLayoutDashboard className="text-2xl" />
          Dashboard
        </NavLink>
      </li>

      <li>
        <NavLink
        to={'Registration'}
          // onClick={() => setCurrentPage("Staff")}
          className="flex items-center gap-4 w-56 p-2  rounded-lg hover:bg-blue-100 hover:text-blue-800 transition duration-200"
        >
          <FaUser className="text-2xl" />
          Staff / User
        </NavLink>
      </li>

       {/* Suppliers */}
       <li>
        <NavLink to={'Supplier'}
          // onClick={() => setCurrentPage("Suppliers")}
          className="flex items-center gap-4 w-56 p-2  rounded-lg hover:bg-blue-100 hover:text-blue-800 transition duration-200"
        >
          {/* <FaFirstOrder  /> */}
          <FaHospitalUser className="text-2xl" />

          Supplier / Vendor
        </NavLink>
      </li>

      {/* Category */}
      <li>
        <NavLink
        to={'AdminCategory'}
          // onClick={() => setCurrentPage("Category")}
          className="flex items-center gap-4 w-56 p-2  rounded-lg hover:bg-blue-100 hover:text-blue-800 transition duration-200"
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
          className="flex items-center gap-4 w-56 p-2 rounded-lg hover:bg-blue-100 hover:text-blue-800 transition duration-200"
        >
          <GrProductHunt className="text-2xl" />
          Products
        </NavLink>
      </li>

       {/* Billing */}
       <li>
        <NavLink to={'Billing'}
          className="flex items-center gap-4 w-56 p-2  rounded-lg hover:bg-blue-100 hover:text-blue-800 transition duration-200 "
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
            className=" relative flex items-center gap-4 w-56 p-2 rounded-lg hover:bg-blue-100 hover:text-blue-800 transition duration-200"
            >
                      {/* <TbLogout2 className="text-2xl" /> */}
            <FaSackDollar className="text-2xl"/>

            Finance <IoIosArrowDropdown className='text-xl ml-20' />

          {isOpen && (
            <div className="absolute left-48 mt-40 text-black w-56 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
              <NavLink  to={'Income'}
                // onClick={() => setCurrentPage("Income")}
                onClick={() => setIsOpen(false)}

                className="block w-56 px-4 py-2 text-left hover:bg-blue-100 hover:text-blue-800 transition duration-200"
              >
                Income
              </NavLink>
              <NavLink to={'Expense'}
                // onClick={() => setCurrentPage("Expense")}
                className="block w-56 px-4 py-2 text-left hover:bg-blue-100 hover:text-blue-800 transition duration-200"
              >
                Expense
              </NavLink>
              <NavLink to={'Invoice'}
                // onClick={() => setCurrentPage("Invoice")}
                onClick={() => setIsOpen(false)}

                className="block w-56 px-4 py-2 text-left hover:bg-blue-100 hover:text-blue-800 transition duration-200"
              >
                Invoice
              </NavLink>
            </div>
          )}
        </div>
      </li>

     

    

      <li ref={dropdownRef}>
        <div className="relative">
  <button
    onClick={() => setShowDropdown(!showDropdown)}
    className="flex items-center gap-4 w-56 p-2 rounded-lg hover:bg-blue-100 hover:text-blue-800 transition duration-200"
  >
    {/* <GrProductHunt className="text-2xl" /> */}
    <LuChartNoAxesCombined  className='text-2xl'/>

    Reports <IoIosArrowDropdown className='text-xl ml-20' />
  </button>
  {showDropdown && (
    <div className="absolute top-10 left-48 w-56 text-black bg-white border border-gray-200 rounded-lg shadow-md">
      <NavLink to={'SalesReport'}
        onClick={() => setShowDropdown(false)}
        className="block w-full text-left px-4 py-2 hover:bg-blue-100 hover:text-blue-800 transition duration-200"
      >
        Sales Report
      </NavLink>
      <NavLink to={'StockReport'}
            onClick={() => setShowDropdown(false)}
        className="block w-56 text-left px-4 py-2 hover:bg-blue-100 hover:text-blue-800 transition duration-200"
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
          className="flex items-center gap-4 w-56 p-2 rounded-lg hover:bg-blue-100 hover:text-blue-800 transition duration-200"
        >
          {/* <HiOutlineUserGroup className="text-2xl" /> */}
          <TbLogout2 className="text-2xl" />

          Return
        </NavLink>
      </li>



   

    

      <li>
        <NavLink to={'BinTable'}
          // onClick={() => setCurrentPage("Bin")}
          className="flex items-center gap-4 w-56 p-2   rounded-lg hover:bg-blue-100 hover:text-blue-800 transition duration-200"
        >
          {/* <IoSettingsSharp className="text-2xl" /> */}
          <IoTrashBin className="text-2xl" />

          {/* <GrProductHunt className="text-2xl" /> */}
          Recycle Bin
        </NavLink>
      </li>

      <li>
        <NavLink to={'Settings'}
          // onClick={() => setCurrentPage("Settings")}
          className="flex items-center gap-4 w-56 p-2   rounded-lg hover:bg-blue-100 hover:text-blue-800 transition duration-200"
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
                  className="flex items-center gap-4 w-56 p-2   rounded-lg hover:bg-blue-100 hover:text-blue-800 transition duration-200">
                  <TbLogout className='text-2xl' />
                  <span className="hidden lg:block">LogOut</span>
                </button>
      </li>     
    </ul>
  );

  const staffContent = (
    <ul className="space-y-1">
      <li>
        <NavLink to={'ProductCreation'}
          className="flex items-center gap-4 w-56 p-2  rounded-lg hover:bg-blue-100 hover:text-blue-800 transition duration-200"
        >
          <GrProductHunt className="text-2xl" />
          <span className="hidden md:block">Products</span>
        </NavLink>
      </li>
      <li>
        <NavLink to={'Billing'}
          className="flex items-center gap-4 w-56 p-2 rounded-lg hover:bg-blue-100 hover:text-blue-800 transition duration-200"
        >
          <RiBillFill className="text-2xl" />
          <span className="hidden md:block">Billing</span>
        </NavLink>
      </li>
      {/* Customers */}
      <li>
        <NavLink to={'Invoice'}
          className="flex items-center gap-4 w-56 p-2 rounded-lg hover:bg-blue-100 hover:text-blue-800 transition duration-200"
        >
          <HiOutlineUserGroup className="text-2xl" />
          <span className="hidden md:block">Invoice</span>
        </NavLink>
      </li>
      <li>
        <NavLink to={'StockReport'}
          className="flex items-center gap-4 w-56 p-2   rounded-lg hover:bg-blue-100 hover:text-blue-800 transition duration-200"
        >
          <TbLogout2 className="text-2xl" />
          <span className="hidden md:block">Stock Report</span>

        </NavLink>
      </li>
      <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-4 w-56 p-2   rounded-lg hover:bg-blue-100 hover:text-blue-800 transition duration-200">
                   <TbLogout className='text-2xl' />
                  <span className="hidden md:block">LogOut</span>
                </button>
              </li>
    </ul>
  );

  const token = localStorage.getItem("authToken");
  const Data = JSON.parse(localStorage.getItem("logindata"));  
  return (
    <div className="flex h-screen w-[100%]">
      <div className="bg-[#027483] text-white h-screen shadow-[-2px_6px_16px_17px_rgba(0,_0,_0,_0.2)] w-16 md:w-60 transition-all duration-300">
        <div className="w-60  text-white  mt-2 ml-4  scrollbar-hidden">
          {Data.role === "admin" ? adminContent : staffContent}
        </div>
      </div>
      {/* Main Content */}
      <div className='bg-gray-100 w-full m-1 rounded-lg '>
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