import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchArtistOrders,
  setSelectedOrder,
  acceptOrder,
} from "../redux/slices/orderSlice";
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

const OrderHub = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { artistId } = useParams();
  const { artistOrders, selectedOrder, loading, error } = useSelector(
    (state) => state.order
  );

  // Local state for order form fields (when accepting/cancelling orders)
  const [showForm, setShowForm] = useState(false);
  const [showCancelReason, setShowCancelReason] = useState(false);
  const [price, setPrice] = useState("");
  const [deliveryCharges, setDeliveryCharges] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    if (artistId) {
      dispatch(fetchArtistOrders(artistId));
    }
  }, [dispatch, artistId]);

  useEffect(() => {
    if (selectedOrder?.artistHasAccepted) {
      setPrice(selectedOrder.price || "");
      setDeliveryCharges(selectedOrder.deliveryCharges || "");
      setDueDate(selectedOrder.dueDate || "");
    }
  }, [selectedOrder]);

  // Update selectedOrder when artistOrders change.
  useEffect(() => {
    if (selectedOrder) {
      const updatedOrder = artistOrders.find(
        (order) => order._id === selectedOrder._id
      );
      if (updatedOrder) {
        dispatch(setSelectedOrder(updatedOrder));
      }
    }
  }, [artistOrders, selectedOrder, dispatch]);

  const handleAcceptOrder = () => {
    setShowForm(true);
    setShowCancelReason(false);
  };

  const handleSaveOrder = () => {
    if (price && deliveryCharges && dueDate) {
      const formData = { action: "accept", price, deliveryCharges, dueDate };
      dispatch(acceptOrder({ orderId: selectedOrder._id, formData })).then(() => {
        dispatch(fetchArtistOrders(artistId)); // Fetch updated orders
      });
      setShowForm(false);
    } else {
      alert("Please fill in all fields.");
    }
  };

  const handleCancelOrder = () => {
    setShowCancelReason(true);
    setShowForm(false);
  };

  const handleSubmitCancelOrder = () => {
    if (cancelReason) {
      const formData = { action: "cancel", cancelReason };
      dispatch(acceptOrder({ orderId: selectedOrder._id, formData })).then(() => {
        dispatch(fetchArtistOrders(artistId)); // Fetch updated orders
      });
      setShowCancelReason(false);
    } else {
      alert("Please provide a reason for cancellation.");
    }
  };

  const handleBackToList = () => {
    dispatch(setSelectedOrder(null));
  };

  // Navigate to the chat view. This button will always be visible when an order is selected.
  const handleChatWithCustomer = () => {
    if (selectedOrder && selectedOrder.customer && selectedOrder.customer._id) {
      navigate(`/chat/order/${selectedOrder._id}/customer/${selectedOrder.customer._id}`);
    } else {
      alert("Customer details are missing.");
    }
  };

  return (
    <div className="min-h-screen bg-black p-5 text-white">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Your vision, our craft – let’s create something beautiful!
      </h2>
  
      {loading && <p className="text-center text-gray-400">Loading orders...</p>}
      {error && (
        <p className="text-red-500 text-center">
          {typeof error === "object" ? JSON.stringify(error) : error}
        </p>
      )}
  
      {!selectedOrder ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {artistOrders.map((order) => (
            <div
              key={order._id}
              className="bg-gray-900 p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300 border border-gray-700"
            >
              <h3 className="text-lg font-semibold">
                {order.customer?.username || "Unknown Customer"}
              </h3>
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
          {/* Left Side - Customer Details */}
          <div>
            <h3 className="text-xl font-bold mb-4">Customer Details</h3>
            <p>
              <strong>Name:</strong> {selectedOrder.customer?.username || "Unknown"}
            </p>
            <p>
              <strong>Email:</strong> {selectedOrder.customer?.email || "No Email"}
            </p>
            <p>
              <strong>Status:</strong> {selectedOrder.status}
            </p>
  
            {/* Ordered Artwork */}
            <div className="mt-4">
              <h4 className="font-semibold">Ordered Artwork</h4>
              {selectedOrder.arts && selectedOrder.arts.length > 0 ? (
                selectedOrder.arts.map((art) => (
                  <div key={art._id} className="border border-gray-700 p-2 mt-2 rounded">
                    <p>
                      <strong>Title:</strong> {art.title}
                    </p>
                    
                    ) : (
                      <p className="text-gray-400">No image available</p>
                    )
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No artwork available</p>
              )}
            </div>
  
            {/* Buttons */}
            <div className="mt-4 space-x-2">
              {!selectedOrder.artistHasAccepted && !selectedOrder.isCancelled ? (
                <>
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    onClick={handleAcceptOrder}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={handleCancelOrder}
                  >
                    Cancel
                  </button>
                </>
              ) : selectedOrder.isCancelled ? (
                <p className="text-red-500">Order Cancelled</p>
              ) : (
                <div className="mt-4">
                  <p>
                    <strong>Price:</strong> {price}/-
                  </p>
                  <p>
                    <strong>Delivery Charges:</strong> {deliveryCharges}/-
                  </p>
                  <p>
                    <strong>Due Date:</strong>{" "}
                    {new Date(selectedOrder.dueDate).toDateString()}
                  </p>
                  <p>
                    <strong>Total Price:</strong> {parseFloat(price) + parseFloat(deliveryCharges)}/-
                  </p>
                </div>
              )}
              <button
                className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600"
                onClick={handleChatWithCustomer}
              >
                Chat with Customer
              </button>
            </div>
          </div>
  
          {/* Right Side - Artwork Image */}
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
        </div>
      )}
  
      {/* Back to List */}
      <button onClick={handleBackToList} className="mt-6 block mx-auto text-blue-400 underline hover:text-blue-500">
        Back to List
      </button>
  
      {/* Pop-up Form */}
      {(showForm || showCancelReason) && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-96">
            {showForm ? (
              <>
                <h3 className="text-xl font-bold mb-4">Accept Order</h3>
                <div className="mb-2">
                  <label className="block font-semibold">Price</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="border border-gray-700 p-2 w-full bg-gray-800 text-white rounded"
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="block font-semibold">Delivery Charges</label>
                  <input
                    type="number"
                    value={deliveryCharges}
                    onChange={(e) => setDeliveryCharges(e.target.value)}
                    className="border border-gray-700 p-2 w-full bg-gray-800 text-white rounded"
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="block font-semibold">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="border border-gray-700 p-2 w-full bg-gray-800 text-white rounded"
                    required
                  />
                </div>
                <button onClick={handleSaveOrder} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Save
                </button>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-4">Cancel Order</h3>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="border border-gray-700 p-2 w-full bg-gray-800 text-white rounded"
                  required
                  placeholder="Provide a reason..."
                />
                <button onClick={handleSubmitCancelOrder} className="bg-red-500 text-white px-4 py-2 mt-2 rounded hover:bg-red-600">
                  Confirm Cancel
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )};
  

export default OrderHub;
