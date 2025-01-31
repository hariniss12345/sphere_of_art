import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchArtists } from "../redux/slices/artistSlice"; // Import action to fetch artists from Redux slice
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons'; // FontAwesome icon for default profile picture
import { Link } from "react-router-dom"; // Import Link for navigation to artist profile page

const FindArtist = () => {
  const dispatch = useDispatch();
  const { artists, loading, error } = useSelector((state) => state.artists); // Retrieve artists state from Redux store

  useEffect(() => {
    dispatch(fetchArtists()); // Fetch artists when component mounts
  }, [dispatch]);

  if (loading) return <p>Loading artists...</p>; // Display loading message while fetching data
  if (error) return <p>Error: {error}</p>; // Display error message if API call fails

  return (
    <div>
      <h1>Meet Our Artists</h1>
      <h2>Explore the talents ready to bring your vision to life</h2>
      
      {/* Flexbox to align artist cards */}
      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
        {artists.map((artist) => (
          <div key={artist._id} style={{ margin: "20px", textAlign: "center" }}>
            {/* Artist profile image or default icon */}
            <div style={{ marginBottom: "10px" }}>
              {artist.profileImage ? (
                <img
                  src={artist.profileImage} // Display artist's profile image if available
                  alt="Artist"
                  style={{ width: "80px", height: "80px", borderRadius: "50%" }} // Circular profile image
                />
              ) : (
                <FontAwesomeIcon icon={faUserCircle} size="5x" /> // Default icon if no profile image
              )}
            </div>
            {/* Clickable username that navigates to the artist's profile page */}
            <Link to={`/artist-profile/${artist._id}`}>
              <span>{artist.user.username}</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FindArtist;
