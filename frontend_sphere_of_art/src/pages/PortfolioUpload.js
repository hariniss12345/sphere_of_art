import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadPortfolioWork, clearSuccessMessage } from '../redux/slices/portfolioSlice';

const PortfolioUpload = () => {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [clientErrors, setClientErrors] = useState({});
  const dispatch = useDispatch();
  const { loading, successMessage, error } = useSelector((state) => state.portfolio);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const runClientValidations = () => {
    const errors = {};
    if (!title.trim()) {
      errors.title = "Title is required";
    }
    if (!image) {
      errors.image = "Please choose an image";
    }
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = runClientValidations();
    if (Object.keys(errors).length === 0) {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('image', image);

      dispatch(uploadPortfolioWork(formData));
      setTitle('');
      setImage(null);

      setTimeout(() => {
        dispatch(clearSuccessMessage());
      }, 3000);
    } else {
      setClientErrors(errors);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-gray-900 p-6 rounded-lg shadow-md text-white">
        <h2 className="text-2xl font-semibold mb-4">Upload Portfolio Work</h2>
        {successMessage && <p className="text-green-400">{successMessage}</p>}
        {error && <p className="text-red-400">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-700 rounded-md bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {clientErrors.title && <p className="text-red-500 text-sm mt-1">{clientErrors.title}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300">Upload Image</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-300 border border-gray-700 rounded-md bg-gray-800 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {clientErrors.image && <p className="text-red-500 text-sm mt-1">{clientErrors.image}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PortfolioUpload;
