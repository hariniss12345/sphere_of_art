import { useEffect, useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/Auth.js";
import { motion } from "framer-motion";

export default function Commission() {
  const [commissions, setCommissions] = useState([]);
  const { userState } = useContext(AuthContext);
  const user = userState?.user; 

  useEffect(() => {
    const fetchCommissions = async () => {
      if (!user?.role || user.role !== "admin") return;

      try {
        const response = await axios.get("http://localhost:4800/api/admin/commissions", {
          headers: { Authorization: localStorage.getItem('token') },
        });
        console.log(response.data);
        setCommissions(response.data);
      } catch (error) {
        console.error("Error fetching commissions:", error);
      }
    };

    fetchCommissions();
  }, [user?.role, user?.token]);

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <h1 className="text-3xl font-bold text-center mb-6">Manage Admin Commissions on Every Order</h1>

      {commissions.length === 0 ? (
        <p className="text-gray-400 text-center">No commission data available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {commissions.map((commission) => (
            <motion.div
              key={commission._id}
              className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-semibold text-blue-400">Commission ID</h2>
              <p className="text-gray-300 break-all">{commission._id}</p>

              <h3 className="text-lg font-semibold mt-3 text-green-400">Total Commission</h3>
              <p className="text-2xl font-bold">${commission.totalCommission}</p>

              <h3 className="text-lg font-semibold mt-3 text-yellow-400">Date</h3>
              <p className="text-gray-300">{new Date(commission.latestDate).toLocaleDateString()}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
