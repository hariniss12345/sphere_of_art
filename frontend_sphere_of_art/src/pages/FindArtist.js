// Import React and useEffect hook
import React, { useEffect } from "react"; 
// Import hooks for dispatching actions and accessing Redux state
import { useDispatch, useSelector } from "react-redux";
// Import action to fetch artists data from Redux store
import { fetchArtists } from "../redux/slices/artistSlice"; 
// Import FontAwesomeIcon component to use icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Import a FontAwesome icon for default profile image
import { faUserCircle } from '@fortawesome/free-solid-svg-icons'; 

const FindArtist = () => {
  // Dispatch function to dispatch actions to Redux store
  const dispatch = useDispatch();

  // Destructure the artists, loading, and error state from the Redux store
  const { artists, loading, error } = useSelector((state) => state.artists); // Access artists state from Redux store

  useEffect(() => {
    // Fetch artists data when the component mounts (only once)
    dispatch(fetchArtists()); // Dispatch the fetchArtists action to get the artist data from the backend
  }, [dispatch]); // The dependency array ensures this runs once when the component mounts

  // Show a loading message if the artists data is still being fetched
  if (loading) return <p>Loading artists...</p>;

  // Show an error message if there is an error fetching the artists data
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Meet Our Artists</h1> {/* Heading for the artist section */}
      <h2>Explore the talents ready to bring your vision to life</h2> {/* Subheading for the section */}

      {/* Flex container to display the artist profiles in a row, centered */}
      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
        {artists.map((artist) => (
          <div key={artist._id} style={{ margin: "20px", textAlign: "center" }}>
            {/* Display the artist's profile image if available */}
            <div style={{ marginBottom: "10px" }}>
              {artist.profileImage ? (
                <img 
                  src={artist.profileImage} // If the artist has a profile image, use it
                  alt="Artist" 
                  style={{ width: "80px", height: "80px", borderRadius: "50%" }} // Make the image circular
                />
              ) : (
                // If no profile image is available, display the default FontAwesome icon as a fallback
                <FontAwesomeIcon icon={faUserCircle} size="5x" /> 
              )}
            </div>
            {/* Display the artist's username */}
            <span>{artist.user.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FindArtist;
