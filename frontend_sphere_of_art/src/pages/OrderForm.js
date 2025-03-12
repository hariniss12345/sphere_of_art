import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { placeOrder } from '../redux/slices/orderSlice';
import Swal from 'sweetalert2';

const OrderForm = () => {
  const { id: artistId } = useParams();  
  const dispatch = useDispatch();

  const [orderId, setOrderId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    styles: '',
    images: null,
  });
  const [formErrors, setFormErrors] = useState({
    title: '',
    styles: '',
    images: '',
  });
  const [uploading, setUploading] = useState(false);

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
      isValid = false;
    } else if (formData.title.length < 3) {
      errors.title = 'Title should be at least 3 characters';
      isValid = false;
    }
    if (!formData.styles.trim()) {
      errors.styles = 'Styles are required';
      isValid = false;
    }
    if (!formData.images) {
      errors.images = 'Please upload an image';
      isValid = false;
    } else if (!['image/jpeg', 'image/png'].includes(formData.images.type)) {
      errors.images = 'Please upload a valid image (JPEG or PNG)';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      setTimeout(() => {
        setFormData(prev => ({ ...prev, images: file }));
        setUploading(false);
      }, 1000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formDataToSubmit = new FormData();
    formDataToSubmit.append('title', formData.title);
    formDataToSubmit.append('styles', formData.styles);
    formDataToSubmit.append('artist', artistId);
    formDataToSubmit.append('images', formData.images);

    const resultAction = await dispatch(placeOrder(formDataToSubmit));
    if (placeOrder.fulfilled.match(resultAction)) {
      const newOrder = resultAction.payload.order;
      setOrderId(newOrder._id);

      Swal.fire({
        icon: 'success',
        title: 'Order Placed!',
        text: 'Your order has been placed successfully.',
        confirmButtonText: 'OK'
      });
    }
  };

  const isFormValid = 
    formData.title.trim().length >= 3 &&
    formData.styles.trim().length > 0 &&
    formData.images &&
    !uploading;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-gray-900 p-6 rounded-lg shadow-md text-white">
        <h2 className="text-2xl font-semibold mb-4">Create Your Order</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter title"
              className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formErrors.title && <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Styles</label>
            <input
              type="text"
              name="styles"
              value={formData.styles}
              onChange={handleInputChange}
              placeholder="Enter styles"
              className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formErrors.styles && <p className="text-red-500 text-sm mt-1">{formErrors.styles}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Upload Image</label>
            <input
              type="file"
              name="images"
              onChange={handleFileChange}
              disabled={uploading}
              className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {uploading && <p className="text-blue-500 text-sm mt-1">Uploading image...</p>}
            {formErrors.images && <p className="text-red-500 text-sm mt-1">{formErrors.images}</p>}
          </div>
          <button
            type="submit"
            disabled={!isFormValid}
            className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;
