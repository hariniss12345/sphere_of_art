import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { placeOrder } from '../redux/slices/orderSlice';

const OrderForm = () => {
  const { id } = useParams();  // Get artist ID from URL
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

  const dispatch = useDispatch();

  // Validate the form fields
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

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      images: file,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append('title', formData.title);
    formDataToSubmit.append('styles', formData.styles);
    formDataToSubmit.append('artist', id);  // Send the artist ID from useParams
    formDataToSubmit.append('images', formData.images);

    dispatch(placeOrder(formDataToSubmit));
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Create Your Order</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {formErrors.title && <p className="text-red-500 text-sm">{formErrors.title}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Style</label>
          <input
            type="text"
            name="styles"
            value={formData.styles}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {formErrors.styles && <p className="text-red-500 text-sm">{formErrors.styles}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Upload Image</label>
          <input
            type="file"
            name="images"
            onChange={handleFileChange}
            required
            className="mt-1 block w-full text-sm text-gray-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {formErrors.images && <p className="text-red-500 text-sm">{formErrors.images}</p>}
        </div>

        <button
          type="submit"
          disabled={false}
          className="w-full mt-4 py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Place Order
        </button>
      </form>
    </div>
  );
};

export default OrderForm;
