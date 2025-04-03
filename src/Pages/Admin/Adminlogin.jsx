import React, { useState } from 'react'
// import { admin } from '../../assets/Image';
import { MdEmail } from "react-icons/md";
import { FaUnlock } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import loginbg from '../../assets/Image/Loginbg.jpg'
import { FaUserAlt } from "react-icons/fa";


function Adminlogin() {
    const [logindata, setLogindata] = useState({
        role:" ",
        email: " ",
        password: " "
      });
    
      const navigate = useNavigate()
    
      const handleChange = (e) => {
        setLogindata({
          ...logindata,
          [e.target.name]: e.target.value,
        });
      };
    
    
      const adminLogin = async (e) => {
        // e.preventDefault();
        try {
          const data = await apiCalls.Login(logindata);
          toast.success("Login Successful!");
          localStorage.setItem("authToken", logindata.token);
          localStorage.setItem("logindata", JSON.stringify({ role: data.logindata.role ,name:data.logindata.name ,id:data.logindata.id}));
          navigate("/Admin/AdminDashboard")
        //   window.location.reload();
        } catch (error) {
          console.error("Login failed:", error.message || error);
          alert(data.message)
          navigate("/Login")
        }
      };

  return (
      <>
{/* <div className="flex  items-center justify-center bg-gradient-to-bl from-[#86efac] via-[#fcd34d] to-[#f9a8d4]"> */}
{/* <div className="flex h-screen items-center justify-center bg-gradient-to-b from-sky-400 to-sky-200"> */}
{/* <div className="flex h-screen items-center justify-center bg-gradient-to-r from-orange-300 to-rose-300"> */}
<div className="flex h-screen items-center justify-center bg-cover bg-center bg-no repeat bg-fixed "
  style={{ backgroundImage: `url(${loginbg})` }}
>
      {/* Image and Form Container */}
      {/* <div className="w-full max-w-md p-1 mt-6 mb-16 rounded-lg shadow-[-2px_6px_16px_17px_rgba(0,_0,_0,_0.2)]"> */}
      <div className="w-full max-w-md p-1 mt-6 mb-16 rounded-lg bg-gray-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100">
        {/* Image Section */}
        {/* <div className="flex items-center justify-center opacity-900">
          <img
            src={admin}
            alt="AdminLogin"
            className="rounded-lg object-fit h-44 w-34 bg-gray-20"
          />
        </div> */}
        {/* Form Section */}
        <div className="p-4">
          <h2 className="text-2xl font-bold text-center text-[#055D80]">Welcome</h2>
          <p className="mt-2 text-center text-[#055D80]">Login to your account</p>
          <form className="space-y-4 mt-2" onSubmit={adminLogin}>

            {/* Role */}
            <div className="relative">
  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
    {/* <MdOutlineAssignmentInd className="text-gray-400" /> */}
    <FaUserAlt  className="text-gray-400"/>
  </span>
  <select
    name="role"
    value={logindata.role}
    onChange={handleChange}
    className="w-full pl-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    required
  >
    <option value="" disabled>Select Role</option>
    <option value="admin">Admin</option>
    <option value="staff">Staff</option>
  </select>
</div>





            {/* Email Input */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <MdEmail className="text-gray-400" />
              </span>
              <input
                type="email"
                name="email"
                value={logindata.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full pl-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaUnlock className="text-gray-400" />
              </span>
              <input
                type="password"
                name="password"
                value={logindata.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full pl-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2 text-white bg-[019493] rounded-lg bg-[#028090] hover:bg-[#027483] focus:outline-none focus:ring-2 focus:ring-blue-300"
              // style={{backdropDown}}
            >
              Login
            </button>
          </form>

          {/* Footer */}
          {/* <div className="text-center mt-6 text-gray-500 mb-2">
            <p>
              Don't have an account?{" "}
              <a href="Signup" className="text-blue-500 hover:underline">
                Register here
              </a>
            </p>
          </div> */}
        </div>
      </div>
    </div>
    </>
  )
}
export default Adminlogin