import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLoggedInUsers } from "../redux/slices/adminSlice";
import { Chart } from "react-google-charts";
import { motion } from "framer-motion";

const ManageUsers = () => {
    const dispatch = useDispatch();

    // Fetch logged-in users data
    const { artistsCount: loggedInArtistsCount, customersCount: loggedInCustomersCount } = useSelector(
        state => state.admin.loggedInUsers || {}
    );

    useEffect(() => {
        dispatch(fetchLoggedInUsers());
    }, [dispatch]);

    // Data for Pie Chart
    const data = [
        ["User Type", "Count"],
        ["Artists", loggedInArtistsCount || 0],
        ["Customers", loggedInCustomersCount || 0],
    ];

    const options = {
        title: "Logged-in Users",
        pieHole: 0.4,
        is3D: false,
        backgroundColor: "#1a1a1a",
        titleTextStyle: { color: "#ffffff" },
        legendTextStyle: { color: "#ffffff" },
        colors: ["#4285F4", "#FBBC05"],
        animation: {
            startup: true,
            easing: "out",
            duration: 1000,
        },
    };

    return (
        <div className="p-6 bg-black min-h-screen text-white">
            <h2 className="text-3xl font-bold mb-6 text-center">Monitor and manage currently logged-in artists and customers in real time</h2>

            {/* Card Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                    className="bg-gray-900 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h3 className="text-xl font-semibold">Logged-in Artists</h3>
                    <p className="text-4xl font-bold text-blue-400 mt-2">{loggedInArtistsCount || 0}</p>
                </motion.div>

                <motion.div
                    className="bg-gray-900 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <h3 className="text-xl font-semibold">Logged-in Customers</h3>
                    <p className="text-4xl font-bold text-yellow-400 mt-2">{loggedInCustomersCount || 0}</p>
                </motion.div>
            </div>

            {/* Animated Pie Chart */}
            <div className="mt-8 flex justify-center">
                <Chart
                    chartType="PieChart"
                    width="100%"
                    height="350px"
                    data={data}
                    options={options}
                />
            </div>
        </div>
    );
};

export default ManageUsers;
