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
    <div className="order-form">
      <h2>Create Your Order</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Style</label>
          <input
            type="text"
            name="styles"
            value={formData.styles}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Choose Artist</label>
          {loading ? (
            <p>Loading artists...</p>
          ) : error ? (
            <p>Error loading artists</p>
          ) : (
            <select name="artist" value={formData.artist} onChange={handleInputChange} required>
              <option value="">Select an Artist</option>
              {artists.map((artist) => (
                <option key={artist._id} value={artist.user._id}>
                  {artist.user.username}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label>Upload Image</label>
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
};

export default OrderForm;