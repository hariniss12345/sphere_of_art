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

  if (loading) return <p className="text-center text-lg">Loading artists...</p>; // Display loading message while fetching data
  if (error) return <p className="text-center text-red-500">Error: {error}</p>; // Display error message if API call fails

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-semibold text-center mb-4">Meet Our Artists</h1>
      <h2 className="text-xl text-center mb-6">Explore the talents ready to bring your vision to life</h2>
      
      {/* Flexbox to align artist cards */}
      <div className="flex flex-wrap justify-center gap-6">
        {artists.map((artist) => (
          <div key={artist._id} className="w-1/4 max-w-xs p-4 bg-white rounded-lg shadow-md text-center">
            {/* Artist profile image or default icon */}
            <div className="mb-4">
              {artist.profileImage ? (
                <img
                  src={artist.profileImage} // Display artist's profile image if available
                  alt="Artist"
                  className="w-20 h-20 rounded-full mx-auto" // Circular profile image
                />
              ) : (
                <FontAwesomeIcon icon={faUserCircle} size="5x" className="text-gray-500" /> // Default icon if no profile image
              )}
            </div>
            {/* Clickable username that navigates to the artist's profile page */}
            <Link to={`/artist-profile/${artist._id}`} className="text-lg font-semibold text-blue-600 hover:text-blue-800">
              <span>{artist.user.username}</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FindArtist;
