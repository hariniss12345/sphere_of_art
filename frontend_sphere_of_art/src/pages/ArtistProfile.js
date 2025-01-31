import React, { useEffect, useState } from "react"; 
import { useParams } from "react-router-dom"; // For accessing the artist ID from the URL

const ArtistProfile = () => {
  const { id } = useParams(); // Get the artist ID from the URL
  const [artist, setArtist] = useState(null); // State to store artist details
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to store error message

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const response = await fetch(`http://localhost:4700/api/artists/${id}`); // API call to fetch artist details
        const data = await response.json();

        if (response.ok) {
          setArtist(data); // Store artist data in state
        } else {
          setError(data.error); // Store error message if artist is not found
        }
      } catch (err) {
        setError("Something went wrong"); // Handle network or server errors
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
    <div>
      <h1>Artist Profile</h1>
      {artist && (
        <div>
          <h2>{artist.user.username}</h2> {/* Display artist username */}
          <p>{artist.bio || "No bio available"}</p> {/* Display bio or fallback message */}
          <p>Styles: {artist.styles?.join(", ") || "No styles available"}</p> {/* Display styles or fallback */}

          {/* Display portfolio images if available */}
          {artist.portfolio?.length > 0 ? (
            <div>
              <h3>Portfolio:</h3>
              {artist.portfolio.map((item) => (
                <div key={item.title}>
                  <img
                    src={`http://localhost:4700/${item.filePath}`} // Load image from server
                    alt={item.title}
                    style={{ width: "200px", margin: "10px 0" }}
                  />
                  <p>{item.title}</p> {/* Display portfolio title */}
                </div>
              ))}
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
