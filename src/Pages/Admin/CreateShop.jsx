import React, { useState } from "react";
import { createShopDetails } from '../../Api/apiservices'; // Adjust the import path as necessary
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';





function CreateShop()  {
  const [shopData, setShopData] = useState({
    pharmacy_name: "",
    pharmacy_address: "",
    pincode: "",
    owner_GST_number: "",
    allow_registration: "",
    description: "",
  });
  const navigate = useNavigate();


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setShopData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const shopId = await createShopDetails(shopData);
      console.log("Shop response:", shopId.data.message);
      toast.success(shopId.data.message);
      navigate("/Dashboard");
    } catch (error) {
      console.error("Error creating shop:", error);
      alert("Failed to create shop.");
    }
  };


  return (
    // <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
    //   <h2 className="text-2xl font-bold mb-4 text-center">Create Pharmacy Shop</h2>
    //   <form onSubmit={handleSubmit} className="space-y-4">
    //     <input
    //       type="text"
    //       name="pharmacy_name"
    //       value={shopData.pharmacy_name}
    //       onChange={handleChange}
    //       placeholder="Pharmacy Name"
    //       className="w-full p-2 border rounded"
    //       required
    //     />
    //     <textarea
    //       name="pharmacy_address"
    //       value={shopData.pharmacy_address}
    //       onChange={handleChange}
    //       placeholder="Pharmacy Address"
    //       className="w-full p-2 border rounded"
    //       required
    //     />
    //     <input
    //       type="text"
    //       name="pincode"
    //       value={shopData.pincode}
    //       onChange={handleChange}
    //       placeholder="Pincode"
    //       className="w-full p-2 border rounded"
    //       required
    //     />
    //     <input
    //       type="text"
    //       name="owner_GST_number"
    //       value={shopData.owner_GST_number}
    //       onChange={handleChange}
    //       placeholder="Owner GST Number"
    //       className="w-full p-2 border rounded"
    //     />
    //     <input
    //       type="text"
    //       name="owner_GST_number"
    //       value={shopData.registration_number}
    //       onChange={handleChange}
    //       placeholder="Registration Number"
    //       className="w-full p-2 border rounded"
    //     />

    //     <textarea
    //       name="description"
    //       value={shopData.description}
    //       onChange={handleChange}
    //       placeholder="Description"
    //       className="w-full p-2 border rounded"
    //     />
    //     <button
    //       type="submit"
    //       className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
    //     >
    //       Create Shop
    //     </button>
    //   </form>
    // </div>

    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
  <h2 className="text-2xl font-bold mb-4 text-center">Create Pharmacy Shop</h2>
  <form onSubmit={handleSubmit} className="space-y-4">
    
    <input
      type="text"
      name="pharmacy_name"
      value={shopData.pharmacy_name}
      onChange={handleChange}
      placeholder="Pharmacy Name"
      className="w-full p-2 border rounded"
      required
    />

    <textarea
      name="pharmacy_address"
      value={shopData.pharmacy_address}
      onChange={handleChange}
      placeholder="Pharmacy Address"
      className="w-full p-2 border rounded"
      required
    />

    <input
      type="text"
      name="pincode"
      value={shopData.pincode}
      onChange={handleChange}
      placeholder="Pincode"
      className="w-full p-2 border rounded"
      required
    />

    <input
      type="text"
      name="owner_GST_number"
      value={shopData.owner_GST_number}
      onChange={handleChange}
      placeholder="Owner GST Number"
      className="w-full p-2 border rounded"
    />

    <input
      type="text"
      name="allow_registration"
      value={shopData.allow_registration}
      onChange={handleChange}
      className="w-full p-2 border rounded"
      required
      placeholder="Registration Number"
    />


    <textarea
      name="description"
      value={shopData.description}
      onChange={handleChange}
      placeholder="Description"
      className="w-full p-2 border rounded"
    />

    <button
      type="submit"
      className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
    >
      Create Shop
    </button>
  </form>
</div>

  );
};

export default CreateShop;
