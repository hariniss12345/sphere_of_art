import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ArtistProfile = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/artists/${id}`);
        console.log("API Response:", response.data); // Debugging
        setArtist(response.data);
      } catch (err) {
        setError("Something went wrong: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Artist Profile</h1>
      {artist && (
        <div>
          <h2 className="text-xl font-bold">{artist.user?.username}</h2>
          <p>Bio: {artist.bio || "No bio available"}</p>
          <p className="mt-2">Styles: {artist.styles?.join(", ") || "No styles available"}</p>

          {/* Display portfolio images with full view and equal size */}
          {artist.portfolio?.length > 0 ? (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Portfolio:</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                {artist.portfolio.map((item) => {
                  const imageUrl = item.filePath ? `${API_BASE_URL}/${item.filePath}` : null;
                  console.log("Image URL:", imageUrl); // Debugging

                  return (
                    <div key={item._id} className="p-2 border rounded-lg shadow-sm">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={item.title}
                          className="w-full h-40 object-contain rounded-lg bg-gray-100"
                          onError={(e) => {
                            e.target.src = "/default-image.jpg"; // Fallback image
                          }}
                        />
                      ) : (
                        <p className="text-center text-gray-500">Image not available</p>
                      )}
                      <p className="text-center mt-2 font-medium">{item.title}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p>No portfolio items uploaded.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ArtistProfile;
