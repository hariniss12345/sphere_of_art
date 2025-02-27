import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchCustomerOrders, setSelectedOrder, confirmOrder } from "../redux/slices/orderSlice";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const MyOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { customerOrders, selectedOrder, loading, error } = useSelector((state) => state.order);
  const { customerId } = useParams(); // Get customerId from URL

  // Fetch customer orders when component mounts
  useEffect(() => {
    if (customerId) {
      dispatch(fetchCustomerOrders(customerId));
    }
  }, [dispatch, customerId]);

  // Handle Confirm or Decline
  const handleCustomerAction = (action) => {
    if (!selectedOrder) return;
    dispatch(confirmOrder({ orderId: selectedOrder._id, action }));
  };

  // When payment is complete, navigate to the review route.
  const handleReviewOrder = () => {
    if (!selectedOrder) return;
    navigate(`/review/order/${selectedOrder._id}/artist/${selectedOrder.artist._id}`);
  };

  // Navigate to a chat page for this order.
  const handleChat = () => {
    if (!selectedOrder) return;
    navigate(`/chat/order/${selectedOrder._id}/artist/${selectedOrder.artist}`);
  };

  return (
    <div className="min-h-screen bg-black p-5 text-white">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>

      {loading && <p>Loading orders...</p>}
      {error && (
        <p className="text-red-500">
          {typeof error === "object" ? JSON.stringify(error) : error}
        </p>
      )}

      {!selectedOrder ? (
        // Order List
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-800">
              <th className="border border-gray-700 px-4 py-2">Artist Name</th>
              <th className="border border-gray-700 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {customerOrders.map((order) => (
              <tr key={order._id} className="border border-gray-700">
                <td className="border border-gray-700 px-4 py-2">
                  {order.artist?.username || "Unknown Artist"}
                </td>
                <td className="border border-gray-700 px-4 py-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
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
        <div className="border border-gray-700 p-4 rounded shadow bg-gray-900">
          <h3 className="text-xl font-bold mb-2">Order Details</h3>
          <p>
            <strong>Artist Name:</strong> {selectedOrder.artist?.username || "Unknown"}
          </p>
          <p>
            <strong>Email:</strong> {selectedOrder.artist?.email || "No Email"}
          </p>
          <p>
            <strong>Status:</strong> {selectedOrder.status}
          </p>

          {/* Display Art Title and Image */}
          <div className="mt-4">
            <h4 className="font-semibold">Ordered Artwork</h4>
            {selectedOrder.arts && selectedOrder.arts.length > 0 ? (
              selectedOrder.arts.map((art) => (
                <div key={art._id} className="border border-gray-700 p-2 mt-2 rounded bg-gray-800">
                  <p>
                    <strong>Title:</strong> {art.title}
                  </p>
                  {art.image && art.image.length > 0 ? (
                    <img
                      src={`${API_BASE_URL}/${art.image[0].path}`}
                      alt={art.title}
                      className="mt-2 w-40 h-40 object-cover rounded"
                    />
                  ) : (
                    <p className="text-gray-400">No image available</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-400">No artwork available</p>
            )}
          </div>

          {selectedOrder.price && selectedOrder.deliveryCharges && selectedOrder.dueDate && (
            <div className="mt-4 p-3 border border-gray-700 rounded bg-gray-800">
              <p>
                <strong>Price:</strong> ${selectedOrder.price}
              </p>
              <p>
                <strong>Delivery Charges:</strong> ${selectedOrder.deliveryCharges}
              </p>
              <p>
                <strong>Due Date:</strong>{" "}
                {new Date(selectedOrder.dueDate).toDateString()}
              </p>
              <p>
                <strong>Total Price:</strong> ${selectedOrder.totalPrice}
              </p>

              {/* Testing: If order is confirmed, display buttons */}
              {!selectedOrder.customerHasAccepted ? (
                <div className="mt-4">
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600"
                    onClick={() => handleCustomerAction("confirm")}
                  >
                    Confirm
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={() => handleCustomerAction("decline")}
                  >
                    Decline
                  </button>
                </div>
              ) : (
                <div className="mt-4 flex flex-row gap-2">
                  {!selectedOrder.isPaid && (
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      onClick={() => navigate(`/payment/${selectedOrder._id}`)}
                    >
                      Pay Now
                    </button>
                  )}
                  <button
                    className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                    onClick={handleReviewOrder}
                  >
                    Review Your Order
                  </button>
                  <button
                    className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600"
                    onClick={handleChat}
                  >
                    Chat with Artist
                  </button>
                </div>
              )}
            </div>
          )}

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

export default MyOrders;
