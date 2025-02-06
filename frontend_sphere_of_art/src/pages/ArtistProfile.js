import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // For accessing the artist ID from the URL
import axios from "axios"; // Import axios

const ArtistProfile = () => {
  const { id } = useParams(); // Get the artist ID from the URL
  const [artist, setArtist] = useState(null); // State to store artist details
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to store error message

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const response = await axios.get(`http://localhost:4800/api/artists/${id}`); // Use axios to fetch artist details
        setArtist(response.data); // Set the artist data
      } catch (err) {
        setError("Something went wrong: " + err.message); // Handle error
      } finally {
        setLoading(false); // Stop loading once the request is completed
      }
    };

    fetchArtist(); // Fetch artist details when the component mounts
  }, [id]); // Runs the effect when the ID changes

  if (loading) {
    return <p>Loading...</p>; // Show loading indicator while fetching data
  }

  if (error) {
    return <p>{error}</p>; // Display error message if something went wrong
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Artist Profile</h1>
      {artist && (
        <div>
          <h2 className="text-xl font-bold">{artist.user.username}</h2>
          <p>{artist.bio || "No bio available"}</p> {/* Display bio or fallback message */}
          <p className="mt-2">Styles: {artist.styles?.join(", ") || "No styles available"}</p>

          {/* Display portfolio images if available */}
          {artist.portfolio?.length > 0 ? (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Portfolio:</h3>
              <div className="flex flex-wrap">
                {artist.portfolio.map((item) => (
                  <div key={item.title} className="w-1/3 p-2">
                    <img
                      src={`http://localhost:4800/${item.filePath}`} // Load image from server
                      alt={item.title}
                      className="w-full h-auto rounded"
                    />
                    <p className="text-center mt-2">{item.title}</p> {/* Display portfolio title */}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p>No portfolio items uploaded.</p> // Display if portfolio is empty
          )}
        </div>
      )}
    </div>
  );
};

export default ArtistProfile;
