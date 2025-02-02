import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchArtistOrders, setSelectedOrder } from "../redux/slices/orderSlice";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

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
                <td className="border px-4 py-2">
                  {order.customer?.username || "Unknown Customer"}
                </td>
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
          <p>
            <strong>Customer Name:</strong> {selectedOrder.customer?.username || "Unknown"}
          </p>
          <p>
            <strong>Email:</strong> {selectedOrder.customer?.email || "No Email"}
          </p>
          <p>
             <strong>Status:</strong> {selectedOrder.status}
          </p>

          {/* Display Art Title and Image */}
          <div className="mt-4">
            <h4 className="font-semibold">Ordered Artwork</h4>
            {selectedOrder.arts && selectedOrder.arts.length > 0 ? (
              selectedOrder.arts.map((art) => (
                <div key={art._id} className="border p-2 mt-2 rounded">
                  <p><strong>Title:</strong> {art.title}</p>
                  {art.image && art.image.length > 0 ? (
                    <img
                      src={`${API_BASE_URL}/${art.image[0].path}`}
                      alt={art.title}
                      className="mt-2 w-40 h-40 object-cover rounded"
                    />
                
                  ) : (
                    <p className="text-gray-500">No image available</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No artwork available</p>
            )}
          </div>

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
