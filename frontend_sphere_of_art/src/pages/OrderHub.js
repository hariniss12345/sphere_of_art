import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchArtistOrders, setSelectedOrder, acceptOrder } from "../redux/slices/orderSlice";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const OrderHub = () => {
  const dispatch = useDispatch();
  const { artistOrders, selectedOrder, loading, error } = useSelector((state) => state.order);
  const { artistId } = useParams();

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

  // Keep selectedOrder updated when artistOrders change
  useEffect(() => {
    if (selectedOrder) {
      const updatedOrder = artistOrders.find((order) => order._id === selectedOrder._id);
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

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Order Hub</h2>
      {loading && <p>Loading orders...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!selectedOrder ? (
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
                <td className="border px-4 py-2">{order.customer?.username || "Unknown Customer"}</td>
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
        <div className="border p-4 rounded shadow">
          <h3 className="text-xl font-bold mb-2">Order Details</h3>
          <p><strong>Customer Name:</strong> {selectedOrder.customer?.username || "Unknown"}</p>
          <p><strong>Email:</strong> {selectedOrder.customer?.email || "No Email"}</p>
          <p><strong>Status:</strong> {selectedOrder.status}</p>

          {/* Display Ordered Artwork */}
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

          {/* Order Actions */}
          {!selectedOrder.artistHasAccepted && !selectedOrder.isCancelled ? (
            !showForm && !showCancelReason ? (
              <div className="mt-4">
                <button
                  className="bg-green-500 text-white px-4 py-2 mr-2 rounded"
                  onClick={handleAcceptOrder}
                >
                  Accept
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={handleCancelOrder}
                >
                  Cancel
                </button>
              </div>
            ) : showForm ? (
              <div className="mt-4">
                <div className="mb-2">
                  <label className="block font-semibold">Price</label>
                  <input type="number" value={price} onChange={(e) => setPrice(e.target.value)}
                    className="border p-2 w-full" required />
                </div>
                <div className="mb-2">
                  <label className="block font-semibold">Delivery Charges</label>
                  <input type="number" value={deliveryCharges} onChange={(e) => setDeliveryCharges(e.target.value)}
                    className="border p-2 w-full" required />
                </div>
                <div className="mb-2">
                  <label className="block font-semibold">Due Date</label>
                  <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                    className="border p-2 w-full" required />
                </div>
                <button onClick={handleSaveOrder} className="bg-blue-500 text-white px-4 py-2 rounded">
                  Save
                </button>
              </div>
            ) : showCancelReason ? (
              <div className="mt-4">
                <label className="block font-semibold">Cancellation Reason</label>
                <textarea value={cancelReason} onChange={(e) => setCancelReason(e.target.value)}
                  className="border p-2 w-full" required />
                <button onClick={handleSubmitCancelOrder} className="bg-red-500 text-white px-4 py-2 mt-2 rounded">
                  Cancel Order
                </button>
              </div>
            ) : null
          ) : selectedOrder.isCancelled ? (
            <p className="mt-4 text-red-600">Order Cancelled</p>
          ) : (
            <div className="mt-4">
              <p><strong>Price:</strong> ${price}</p>
              <p><strong>Delivery Charges:</strong> ${deliveryCharges}</p>
              <p><strong>Due Date:</strong> {dueDate}</p>
              <p><strong>Total Price:</strong> ${parseFloat(price) + parseFloat(deliveryCharges)}</p>
            </div>
          )}

          <button onClick={handleBackToList} className="mt-4 underline text-blue-500">
            Back to List
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderHub;
