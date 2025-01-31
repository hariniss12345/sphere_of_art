import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // For accessing the artist ID from the URL

const ArtistProfile = () => {
  const { id } = useParams(); // Get the artist ID from the URL
  const [artist, setArtist] = useState(null); // Store artist details
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const response = await fetch(`http://localhost:4700/api/artists/${id}`); // Get artist details by ID
        const data = await response.json();

        if (response.ok) {
          setArtist(data); // Set artist data
        } else {
          setError(data.error); // Set error if artist not found
        }
      } catch (err) {
        setError("Something went wrong"); // Set error for network issues
      } finally {
        setLoading(false); // Set loading to false once the request is done
      }
    };

    fetchArtist(); // Fetch artist details
  }, [id]); // Fetch when the component mounts or the ID changes

  if (loading) {
    return <p>Loading...</p>; // Show loading message while fetching data
  }

  if (error) {
    return <p>{error}</p>; // Show error message if something went wrong
  }

  return (
    <div>
      <h1>Artist Profile</h1>
      {artist && (
        <div>
          <h2>Name-{artist.user.username}</h2>
          <h2>Email-{artist.user.email}</h2>
          <p>Bio-{artist.bio || "No bio available"}</p>
          <p>Styles: {artist.styles?.join(", ") || "No styles available"}</p>
          
          {artist.portfolio?.length > 0 ? (
            <div>
              <h3>Portfolio:</h3>
              {artist.portfolio.map((item) => (
                <div key={item.title}>
                  <img
                    src={`http://localhost:4700/${item.filePath}`} // Display portfolio image
                    alt={item.title}
                    style={{ width: "200px", margin: "10px 0" }}
                  />
                  <p>{item.title}</p>
                </div>
              ))}
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
