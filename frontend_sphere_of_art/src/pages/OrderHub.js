import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchArtistOrders, setSelectedOrder } from "../redux/slices/orderSlice";

const OrderHub = () => {
  const dispatch = useDispatch();
  const { artistOrders, selectedOrder, loading, error } = useSelector(
    (state) => state.order
  );
  const { artistId } = useParams(); // Get artistId from URL

  // Fetch orders when component mounts
  useEffect(() => {
    if (artistId) {
      dispatch(fetchArtistOrders(artistId));
    }
  }, [dispatch, artistId]);

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Order Hub</h2>
      
      {loading && <p>Loading orders...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!selectedOrder ? (
        // Order List
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Customer Name</th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {artistOrders.map((order) => (
              <tr key={order._id} className="border">
                <td className="border px-4 py-2">{order.customer.username}</td>
                <td className="border px-4 py-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                    onClick={() => dispatch(setSelectedOrder(order))}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        // Order Details
        <div className="border p-4 rounded shadow">
          <h3 className="text-xl font-bold mb-2">Order Details</h3>
          <p><strong>Customer Name:</strong> {selectedOrder.customer.username}</p>
          <p><strong>Email:</strong> {selectedOrder.customer.email}</p>
          <p><strong>Status:</strong> {selectedOrder.status}</p>

          <div className="mt-4">
            <button className="bg-green-500 text-white px-4 py-2 mr-2 rounded">
              Accept
            </button>
            <button className="bg-red-500 text-white px-4 py-2 rounded">
              Cancel
            </button>
          </div>

          <button
            onClick={() => dispatch(setSelectedOrder(null))}
            className="mt-4 underline text-blue-500"
          >
            Back to List
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderHub;
