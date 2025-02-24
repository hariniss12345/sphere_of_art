import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ArtistProfile = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/artists/${id}`);
        setArtist(response.data);
      } catch (err) {
        setError("Something went wrong: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [id]);

  const handleOrderClick = () => {
    navigate(`/order/${artist.user?._id}`);
  };

  if (loading)
    return <p className="text-center text-lg text-white">Loading...</p>;
  if (error)
    return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-black p-4 text-white">
      <h1 className="text-2xl font-semibold mb-4">Artist Profile</h1>
      {artist && (
        <div>
          <h2 className="text-xl font-bold">{artist.user?.username}</h2>
          <p>Bio: {artist.bio || "No bio available"}</p>
          <p className="mt-2">
            Styles: {artist.styles?.join(", ") || "No styles available"}
          </p>

          {/* Display portfolio images */}
          {artist.portfolio?.length > 0 ? (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Portfolio:</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                {artist.portfolio.map((item) => {
                  const imageUrl = item.filePath
                    ? `${API_BASE_URL}/${item.filePath}`
                    : null;
                  return (
                    <div
                      key={item._id}
                      className="p-2 border border-gray-700 rounded-lg shadow-sm bg-gray-900"
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={item.title}
                          className="w-full h-40 object-contain rounded-lg bg-gray-800"
                          onError={(e) => {
                            e.target.src = "/default-image.jpg"; // Fallback image
                          }}
                        />
                      ) : (
                        <p className="text-center text-gray-500">
                          Image not available
                        </p>
                      )}
                      <p className="text-center mt-2 font-medium text-white">
                        {item.title}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p>No portfolio items uploaded.</p>
          )}

          {/* Order Button */}
          <div className="mt-6">
            <button
              onClick={handleOrderClick}
              className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700"
            >
              Place Order with {artist.user?.username}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistProfile;
