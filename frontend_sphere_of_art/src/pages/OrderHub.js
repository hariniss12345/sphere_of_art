import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchArtistOrders, setSelectedOrder, acceptOrder } from "../redux/slices/orderSlice";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const OrderHub = () => {
  const dispatch = useDispatch();
  const { artistOrders, selectedOrder, loading, error } = useSelector(
    (state) => state.order
  );
  const { artistId } = useParams(); // Get artistId from URL
  const [showForm, setShowForm] = useState(false); // Control form visibility
  const [price, setPrice] = useState('');
  const [deliveryCharges, setDeliveryCharges] = useState('');
  const [dueDate, setDueDate] = useState('');

  // Fetch orders when component mounts
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

  const handleAcceptOrder = () => {
    setShowForm(true); // Show the form when "Accept" is clicked
  };

  const handleSaveOrder = () => {
    if (price && deliveryCharges && dueDate) {
      dispatch(acceptOrder({
        orderId: selectedOrder._id,
        price,
        deliveryCharges,
        dueDate,
        action: 'accept',
      }));
      setShowForm(false); // Hide the form after saving
    } else {
      alert("Please fill in all fields.");
    }
  };

  const handleBackToList = () => {
    // When going back to the list, reset selectedOrder to null
    dispatch(setSelectedOrder(null));
  };

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Order Hub</h2>

      {loading && <p>Loading orders...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!selectedOrder ? (
        // Show the table with orders first
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
                    onClick={() => dispatch(setSelectedOrder(order))} // Set selectedOrder when "View" is clicked
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        // Show order details when an order is selected
        <div className="border p-4 rounded shadow">
          <h3 className="text-xl font-bold mb-2">Order Details</h3>
          <p><strong>Customer Name:</strong> {selectedOrder.customer?.username || "Unknown"}</p>
          <p><strong>Email:</strong> {selectedOrder.customer?.email || "No Email"}</p>
          <p><strong>Status:</strong> {selectedOrder.status}</p>

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

          {/* Display Order Pricing & Details */}
          {selectedOrder.artistHasAccepted ? (
            <div className="mt-4">
              <p><strong>Price:</strong> {selectedOrder.price}/-</p>
              <p><strong>Delivery Charges:</strong> {selectedOrder.deliveryCharges}/-</p>
              <p><strong>Total Price:</strong> {selectedOrder.totalPrice}/-</p>
              <p><strong>Due Date:</strong> {new Date(selectedOrder.dueDate).toDateString()}</p>

              {/* Accept & Cancel Buttons Disabled */}
              <div className="mt-4">
                <button className="bg-gray-400 text-white px-4 py-2 mr-2 rounded cursor-not-allowed" disabled>
                  Accept
                </button>
                <button className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed" disabled>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            // Accept/Cancel Buttons
            !showForm ? (
              <div className="mt-4">
                <button
                  className="bg-green-500 text-white px-4 py-2 mr-2 rounded"
                  onClick={handleAcceptOrder}
                >
                  Accept
                </button>
                <button className="bg-red-500 text-white px-4 py-2 rounded">
                  Cancel
                </button>
              </div>
            ) : (
              // Form for Accepting Order
              <div className="mt-4">
                <div className="mb-2">
                  <label htmlFor="price" className="block font-semibold">Price</label>
                  <input
                    type="number"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="border p-2 w-full"
                    required
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="deliveryCharges" className="block font-semibold">Delivery Charges</label>
                  <input
                    type="number"
                    id="deliveryCharges"
                    value={deliveryCharges}
                    onChange={(e) => setDeliveryCharges(e.target.value)}
                    className="border p-2 w-full"
                    required
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="dueDate" className="block font-semibold">Due Date</label>
                  <input
                    type="date"
                    id="dueDate"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="border p-2 w-full"
                    required
                  />
                </div>

                <div className="mt-4">
                  <button
                    onClick={handleSaveOrder}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                </div>
              </div>
            )
          )}

          <button
            onClick={handleBackToList} // Go back to the table view
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
