import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../redux/slices/adminSlice";
import { Chart } from "react-google-charts";

const ManageOrders = () => {
    const dispatch = useDispatch();
    const orders = useSelector((state) => state.admin.orders || []);
    const loading = useSelector((state) => state.admin.status === "loading");
    const error = useSelector((state) => state.admin.error);

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    // Transform orders data to group by artist
    const artistOrderCounts = orders.reduce((acc, order) => {
        const artistName = order.artistName || "Unknown Artist";
        acc[artistName] = (acc[artistName] || 0) + 1;
        return acc;
    }, {});

    // Convert object to array format for table and chart
    const artists = Object.entries(artistOrderCounts).map(([artistName, orderCount]) => ({
        artistName,
        orderCount,
    }));

    // Ensure zero values are properly displayed in the chart
    const chartData = [["Artist", "Orders"], ...artists.map((artist) => [artist.artistName, artist.orderCount || 0])];

    return (
        <div className="p-4 bg-black min-h-screen text-white">
            <h2 className="text-2xl font-bold mb-4">Artist Order Statistics</h2>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}

            {!loading && !error && (
                <>
                    {/* Table */}
                    <table className="w-full border-collapse border border-gray-500 mb-6 text-white">
                        <thead>
                            <tr className="bg-gray-800 text-white">
                                <th className="border border-gray-500 p-2">Artist Name</th>
                                <th className="border border-gray-500 p-2">Order Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            {artists.map((artist, index) => (
                                <tr key={index} className="border border-gray-500">
                                    <td className="border border-gray-500 p-2">{artist.artistName}</td>
                                    <td className="border border-gray-500 p-2">{artist.orderCount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Bar Chart */}
                    <Chart
                        chartType="Bar"
                        width="100%"
                        height="500px"
                        data={chartData}
                        options={{
                            title: "Orders per Artist",
                            titleTextStyle: { color: "white" },
                            backgroundColor: "black",
                            chartArea: { width: "60%" },
                            hAxis: { title: "Number of Orders", minValue: 0, textStyle: { color: "white" } },
                            vAxis: { title: "Artists", textStyle: { color: "white" } },
                            legendTextStyle: { color: "white" },
                        }}
                    />
                </>
            )}
        </div>
    );
};

export default ManageOrders;
