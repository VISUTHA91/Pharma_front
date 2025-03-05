import React, { useState } from "react";
import { MdRestore } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { Tooltip , tooltipClasses } from "@mui/material";

import { styled } from '@mui/material/styles';
import { getBinList } from "../../Api/apiservices";
import { useEffect } from "react";
import { restoreProduct } from "../../Api/apiservices";
import { productpermanentdelete } from "../../Api/apiservices";
import { toast } from "react-toastify";



const BinTable = () => {
  const [binData, setBinData] = useState([]);
  const [error,setError] = useState([]);
  const [loading , setLoading] = useState([]);
  
  useEffect(() => {
    const fetchBinList = async () => {
      try {
        const response = await getBinList();
        setBinData(response.data);
      } catch (err) {
        setError("Failed to fetch bin list");
      } finally {
        setLoading(false);
      }
    };

    fetchBinList();
  }, []); 

  const handleRestore = async (id) => {
    try {
      await restoreProduct(id);
      console.log(`Product with ID ${id} restored successfully!`);
      
      // Remove restored product from the binData state
      setBinData((prevData) => prevData.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Failed to restore product:", error);
    }
  };
  const BootstrapTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: theme.palette.common.black,
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.black,
    },
  }));

    const handlepermanentdelete = async (productId) => {  
      console.log(" ID for Product Delete",productId)
      try {
        await productpermanentdelete(productId);
        // console.log("Product Permanently Deleted successfully!");
        toast.success("Product Permanently Deleted successfully!");
        // Optionally, update the UI by refetching categories
        setBinData((prevProducts) =>
          prevProducts.filter((product) => product.id !== productId)
        );
      } catch (error) {
        // console.error("Failed to delete Product:", error);
        toast.error("Failed to Delete Product",error);
      }
    };


  return (
    <div className="m-4 mt-8">
      <h2 className=" font-bold mb-4">Deleted Products</h2>
      <table className=" w-[100%] bg-white rounded-lg text-left ">
        <thead className="bg-[#027483] text-white">
          <tr className="text-sm">
            <th className="px-2 py-1">Product ID</th>
            <th className="px-2 w-32 overflow-hidden truncate whitespace-nowrap">Medicine Name</th>
            <th className="px-2 py-2">Supplier Name</th>
            <th className="px-2 py-2">Category Name</th>
            <th className="px-2 py-2">Brand Name</th>
            <th className="px-2 py-2">Created Date</th>
            <th className="px-2 py-2">Delete Date</th>
            <th className="px-2 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {binData.length > 0 ? (
            binData.map((item) => (
              <tr key={item.id} className="text-sm">
                <td className=" px-4 py-2">{item.id}</td>
                <td className=" px-4 py-2 overflow-hidden truncate">{item.product_name}</td>
                <td className=" px-4 py-2">{item.supplier_name}</td>
                <td className=" px-4 py-2">{item.product_category}</td>
                <td className=" px-4 py-2">{item.brand_name}</td>
                <td className=" px-4 py-2">{item.created_at ? item.created_at.split("T")[0] : "N/A"}</td>
                 <td className=" px-4 py-2">{item.deleted_at ? item.deleted_at.split("T")[0] : "N/A"}</td>
                <td className=" flex gap-2 px-2 py-2">
                <BootstrapTooltip title="Restore"placement="top">
                  <button
                    onClick={() => handleRestore(item.id)}
                    className="bg-[#027483] text-white px-2 py-1 rounded hover:bg-cyan-700"
                  >
                    <MdRestore  className="text-2xl"/>
                  </button>
                  </BootstrapTooltip>
                  <BootstrapTooltip title="Delete"placement="top">
                  <button
                    onClick={() => handlepermanentdelete(item.id)}
                    className="bg-[#027483] text-white px-2 py-1 rounded hover:bg-cyan-700">
                  <MdDelete className="text-2xl"/>
                  </button>
                  </BootstrapTooltip>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="8"
                className="border px-4 py-2 text-center text-gray-500"
              >
                No deleted products available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BinTable;
