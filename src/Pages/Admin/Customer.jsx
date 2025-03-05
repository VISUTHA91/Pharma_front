import React, { useEffect, useState } from "react";
import axios from "axios";
import { Tooltip } from "@/components/ui/tooltip";
import { FcPlus } from "react-icons/fc";

// API Service to fetch customer details
const fetchCustomers = async () => {
  try {
    const response = await axios.get("https://api.example.com/customers");
    return response.data;
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
};

const CustomerTable = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    const getCustomers = async () => {
      const data = await fetchCustomers();
      setCustomers(data);
      setLoading(false);
    };
    getCustomers();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Customer Details</h2>
      <Tooltip content="Add Customer">
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-end text-xl text-white border-black rounded-lg px-2 py-1 gap-1 bg-[#019493]"
        >
          <FcPlus size={28} />
        </button>
      </Tooltip>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border">ID</th>
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-4 border">Email</th>
                <th className="py-2 px-4 border">Phone</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border">
                  <td className="py-2 px-4 border">{customer.id}</td>
                  <td className="py-2 px-4 border">{customer.name}</td>
                  <td className="py-2 px-4 border">{customer.email}</td>
                  <td className="py-2 px-4 border">{customer.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CustomerTable;
