import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArtists } from '../redux/slices/artistSlice'; // Use artist slice
import { placeOrder } from '../redux/slices/orderSlice';

const OrderForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    styles: '',
    artist: '',
    image: null,
  });

  const dispatch = useDispatch();
  const { artists, loading, error } = useSelector(state => state.artists); // Get from artist slice

  useEffect(() => {
    dispatch(fetchArtists()); // Fetch artists when component mounts
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      image: file,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formDataToSubmit = new FormData();
    // Log the values to verify before appending
    console.log('Title:', formData.title);
    console.log('Styles:', formData.styles);
    console.log('Artist ID:', formData.artist);
    console.log('Image:', formData.image);
    formDataToSubmit.append('title', formData.title);
    formDataToSubmit.append('styles', formData.styles);
    formDataToSubmit.append('artist', formData.artist);
    formDataToSubmit.append('images', formData.image);
    console.log('Form data to submit:', formDataToSubmit);
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
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Choose Artist</label>
          {loading ? (
            <p className="text-sm text-gray-500">Loading artists...</p>
          ) : error ? (
            <p className="text-sm text-red-500">Error loading artists</p>
          ) : (
            <select
              name="artist"
              value={formData.artist}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select an Artist</option>
              {artists.map((artist) => (
                <option key={artist._id} value={artist._id}>
                  {artist.user.username}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Upload Image</label>
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            required
            className="mt-1 block w-full text-sm text-gray-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {loading ? 'Submitting...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
};

export default OrderForm;
