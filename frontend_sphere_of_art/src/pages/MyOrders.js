import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchCustomerOrders, setSelectedOrder, confirmOrder } from "../redux/slices/orderSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faTimes,
  faComment,
  faMoneyBill,
  faArrowLeft,
  faStar,
  faEye,
} from "@fortawesome/free-solid-svg-icons";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const MyOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { customerOrders, selectedOrder, loading, error } = useSelector((state) => state.order);
  const { customerId } = useParams();

  useEffect(() => {
    if (customerId) {
      dispatch(fetchCustomerOrders(customerId));
    }
  }, [dispatch, customerId]);

  const handleCustomerAction = (action) => {
    if (!selectedOrder) return;
    dispatch(confirmOrder({ orderId: selectedOrder._id, action }));
  };

  const handleReviewOrder = () => {
    if (!selectedOrder) return;
    navigate(`/review/order/${selectedOrder._id}/artist/${selectedOrder.artist._id}`);
  };

  const handleChat = () => {
    if (!selectedOrder) return;
    navigate(`/chat/order/${selectedOrder._id}/artist/${selectedOrder.artist}`);
  };

  return (
    <div className="min-h-screen bg-black p-5 text-white">
      <h2 className="text-3xl font-bold mb-6 text-center">Track Your Orders and Stay Updated on Their Progress</h2>

      {loading && <p className="text-center text-gray-400">Loading orders...</p>}
      {error && <p className="text-red-500 text-center">{typeof error === "object" ? JSON.stringify(error) : error}</p>}

      {!selectedOrder ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {customerOrders.map((order) => (
            <div
              key={order._id}
              className="bg-gray-900 p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300 border border-gray-700"
            >
              <h3 className="text-lg font-semibold">{order.artist?.username || "Unknown Artist"}</h3>
              <p className="text-gray-400">Status: {order.status}</p>
              <button
                className="mt-3 bg-blue-500 text-white px-4 py-2 rounded flex items-center justify-center w-full hover:bg-blue-600 hover:-translate-y-1 transition-transform duration-200"
                onClick={() => dispatch(setSelectedOrder(order))}
              >
                <FontAwesomeIcon icon={faEye} className="mr-2" />
                View Details
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-gray-700 p-6 rounded shadow bg-gray-900 grid md:grid-cols-2 gap-6">
          {/* Left Side - Artwork Image */}
          <div className="flex justify-center items-center">
            {selectedOrder.arts?.length > 0 && selectedOrder.arts[0].image ? (
              <img
                src={`${API_BASE_URL}/${selectedOrder.arts[0].image[0].path}`}
                alt={selectedOrder.arts[0].title}
                className="w-full h-auto max-h-96 object-cover rounded"
              />
            ) : (
              <p className="text-gray-400">No image available</p>
            )}
          </div>

          {/* Right Side - Order Details */}
          <div>
            <h3 className="text-xl font-bold mb-4">Artist Details</h3>
            <p><strong>Name:</strong> {selectedOrder.artist?.username || "Unknown"}</p>
            <p><strong>Email:</strong> {selectedOrder.artist?.email || "No Email"}</p>
            <p><strong>Status:</strong> {selectedOrder.status}</p>

            <div className="mt-6 p-4 border border-gray-700 rounded bg-gray-800">
              <h4 className="font-semibold">Price Details</h4>
              <p><strong>Price:</strong> {selectedOrder.price}/-</p>
              <p><strong>Delivery Charges:</strong> {selectedOrder.deliveryCharges}/-</p>
              <p><strong>Due Date:</strong> {new Date(selectedOrder.dueDate).toDateString()}</p>
              <p><strong>Total Price:</strong> {selectedOrder.totalPrice}/-</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Action Buttons */}
      {selectedOrder && (
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          {!selectedOrder.customerHasAccepted ? (
            <>
              <button className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 hover:-translate-y-1 transition-transform duration-200" onClick={() => handleCustomerAction("confirm")}>
                <FontAwesomeIcon icon={faCheck} className="mr-2" /> Confirm
              </button>
              <button className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 hover:-translate-y-1 transition-transform duration-200" onClick={() => handleCustomerAction("decline")}>
                <FontAwesomeIcon icon={faTimes} className="mr-2" /> Decline
              </button>
            </>
          ) : (
            <>
              {!selectedOrder.isPaid && (
                <button className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 hover:-translate-y-1 transition-transform duration-200" onClick={() => navigate(`/payment/${selectedOrder._id}`)}>
                  <FontAwesomeIcon icon={faMoneyBill} className="mr-2" /> Pay Now
                </button>
              )}
              <button className="bg-purple-500 px-4 py-2 rounded hover:bg-purple-600 hover:-translate-y-1 transition-transform duration-200" onClick={handleReviewOrder}>
                <FontAwesomeIcon icon={faStar} className="mr-2" /> Review Order
              </button>
              <button className="bg-teal-500 px-4 py-2 rounded hover:bg-teal-600 hover:-translate-y-1 transition-transform duration-200" onClick={handleChat}>
                <FontAwesomeIcon icon={faComment} className="mr-2" /> Chat with Artist
              </button>
            </>
          )}
        </div>
      )}

      {/* Back to List Button */}
      {selectedOrder && (
        <div className="mt-5 flex justify-center">
         <button onClick={() => dispatch(setSelectedOrder(null))} className="text-blue-500 flex items-center hover:-translate-y-1 transition-transform duration-200">
         <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> Back to List
         </button>
        </div>
      )}
    </div>
  );
};

export default MyOrders;