import React, { useState } from 'react';
import { MdEmail } from "react-icons/md";
import { FaUnlock, FaUserAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import loginbg from '../assets/Image/loginbgg.jpg';
import * as apiCalls from '../Api/apiservices';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from 'react-toastify';
function Login() {
  const [logindata, setLogindata] = useState({
    email: "",
    password: "",
  });
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const handleChange = (e) => {
    setLogindata({
      ...logindata,
      [e.target.name]: e.target.value,
    });
  };
  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };
  const login = async (e) => {
    e.preventDefault();
    
    try {
      const { email, password } = logindata;
      let data;
      // Call API based on role but don't send the role in the payload
      if (role === "admin") {
        data = await apiCalls.adminlogin({ email, password });
        console.log("Page Data",data.status);
        if (data.status) { 
          toast.success(data.message);
          navigate("/Dashboard");
        } else {
          toast.error("Login Faiild " + data.message);
        }
      } else if (role === "staff") {
        data = await apiCalls.stafflogin({ email, password });
        if (data.status) { 
          toast.success(data.message);
          navigate("/Dashboard");
        } else {
          toast.error("Login Failed");
        }
      } else {
        throw new Error("Please select a role");
      }
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("logindata", JSON.stringify({ email: data.user.email, id: data.user.id , role: data.user.role }));
    } catch (error) {
      console.error("Login failed:", error.message || error);
      toast.error(error.message ||"Login Failed" );
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${loginbg})` }}>
      <div className="w-full max-w-md p-6 rounded-lg bg-gray-400 bg-opacity-10 border border-gray-100 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-center text-[#055D80]">Welcome</h2>
        <p className="mt-2 text-center text-[#055D80]">Login to your account</p>
        <form className="space-y-4 mt-2" onSubmit={login}>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FaUserAlt className="text-gray-400" />
            </span>
            <select
              name="role"
              value={role}
              onChange={handleRoleChange}
              className="w-full pl-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-700"
              >
              <option value="">Select Role</option>
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
              className="w-full pl-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-700"
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FaUnlock className="text-gray-400" />
            </span>
            <input
            type={showPassword ? "text" : "password"}
              name="password"
              value={logindata.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full pl-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-700"
              required
            />
             <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400"
      >
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </button>
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 text-white bg-[#028090] rounded-lg hover:bg-[#027483] focus:outline-none focus:ring-2 focus:ring-cyan-700">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
export default Login;


// import React, { useState } from 'react'
// // import { admin } from '../../assets/Image';
// import { MdEmail } from "react-icons/md";
// import { FaUnlock } from "react-icons/fa";
// import { Link } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
// import loginbg from '../assets/Image/loginbgg.jpg';
// import { FaUserAlt } from "react-icons/fa";
// import  * as apiCalls from '../Api/apiservices';




// function Login() {
//   const [logindata, setLogindata] = useState({
//     email: "",
//     password: ""
//   });

//   const navigate = useNavigate()

//   const handleChange = (e) => {
//     setLogindata({
//       ...logindata,
//       [e.target.name]: e.target.value,
//     });
//   };



//   const login = async (e) => {
//     e.preventDefault();
//     try {
//       const { email, password } = logindata; // Extract only email and password
      
//       let data;
//       // Check the role before making the API call
//       if (role === "admin") {
//         data = await apiCalls.adminlogin({ email, password }); // Call admin API without the role
//       } else (role === "staff") 
//         data = await apiCalls.stafflogin({ email, password }); // Call staff API without the role
      
  
//       // Handle the successful login
//       localStorage.setItem("authToken", data.token); // Use token from response
//       localStorage.setItem("logindata", JSON.stringify({ email: data.user.email, id: data.user.id }));
//       navigate("/Dashboard");  // Navigate to the appropriate dashboard
  
//     } catch (error) {
//       console.error("Login failed:", error.message || error);
//       alert(error.message || "Login failed");
//     }
//   };
  
  
//   // const login = async (e) => {
//   //   e.preventDefault();
  
//   //   try {
//   //     // Static data for login (this can be hardcoded or fetched from a static file)
//   //     const loginData = {
//   //       role: "admin",  // You can set this to "staff" or "admin" for testing
//   //       email: "admin@example.com",  // Static email
//   //       password: "12345",  // Static user ID
//   //     };
  
//   //     const { role, email, id } = loginData;
  
    

  
//   //     // Navigate based on role
//   //     if (role === "admin") {
//   //       navigate("/Admin/AdminDashboard"); // Admin dashboard
//   //     } else if (role === "staff") {
//   //       navigate("/Staff/StaffDashboard"); // Staff dashboard
//   //     } else {
//   //       throw new Error("Invalid role specified");
//   //     }
      
//   //   } catch (error) {
//   //     console.error("Login failed:", error.message || error);
//   //     alert(error.message || "Login failed");
//   //   }
//   // };
  
  
//   return (
//       <div className="flex h-screen items-center justify-center bg-cover bg-center bg-no repeat bg-fixed "
//         style={{ backgroundImage: `url(${loginbg})` }}
//       >
//         {/* Image and Form Container */}
//         <div className="w-full max-w-md p-1 mt-6 mb-16 rounded-lg bg-gray-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100">

//           {/* Form Section */}
//           <div className="p-4">
//             <h2 className="text-2xl font-bold text-center text-[#055D80]">Welcome</h2>
//             <p className="mt-2 text-center text-[#055D80]">Login to your account</p>
//             <form className="space-y-4 mt-2" onSubmit={login}>

//               {/* Role */}
//               <div className="relative">
//                 <span className="absolute inset-y-0 left-0 flex items-center pl-3">
//                   <FaUserAlt className="text-gray-400" />
//                 </span>
//                 <select
//                   name="role"
//                   // value={logindata.role}
//                   // onChange={handleChange}
//                   className="w-full pl-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-700"
//                   required>
//                   <option value="">Select Role</option>
//                   <option value="admin">Admin</option>
//                   <option value="staff">Staff</option>
//                 </select>
//               </div>
//               {/* Email Input */}
//               <div className="relative">
//                 <span className="absolute inset-y-0 left-0 flex items-center pl-3">
//                   <MdEmail className="text-gray-400"/>
//                 </span>
//                 <input
//                   type="email"
//                   name="email"
//                   value={logindata.email}
//                   onChange={handleChange}
//                   placeholder="Email"
//                   className="w-full pl-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-700"
//                   required
//                 />
//               </div>

//               {/* Password Input */}
//               <div className="relative">
//                 <span className="absolute inset-y-0 left-0 flex items-center pl-3">
//                   <FaUnlock className="text-gray-400" />
//                 </span>
//                 <input
//                   type="password"
//                   name="password"
//                   value={logindata.password}
//                   onChange={handleChange}
//                   placeholder="Password"
//                   className="w-full pl-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-700"
//                   required
//                 />
//               </div>

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 className="w-full py-2 text-white bg-[019493] rounded-lg bg-[#028090] hover:bg-[#027483] focus:outline-none focus:ring-2 focus:focus:ring-cyan-700"
//               >
//                 Login
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//   )
// }
// export default Login

// {/* Image Section */ }
// {/* <div className="flex items-center justify-center opacity-900">
//           <img
//             src={admin}
//             alt="AdminLogin"
//             className="rounded-lg object-fit h-44 w-34 bg-gray-20"
//           />
//         </div> */}