import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchArtists } from "../redux/slices/artistSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom"; // Import Link for navigation

const FindArtist = () => {
  const dispatch = useDispatch();
  const { artists, loading, error } = useSelector((state) => state.artists);

  useEffect(() => {
    dispatch(fetchArtists());
  }, [dispatch]);

  if (loading) return <p>Loading artists...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Meet Our Artists</h1>
      <h2>Explore the talents ready to bring your vision to life</h2>
      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
        {artists.map((artist) => (
          <div key={artist._id} style={{ margin: "20px", textAlign: "center" }}>
            <div style={{ marginBottom: "10px" }}>
              {artist.profileImage ? (
                <img
                  src={artist.profileImage}
                  alt="Artist"
                  style={{ width: "80px", height: "80px", borderRadius: "50%" }}
                />
              ) : (
                <FontAwesomeIcon icon={faUserCircle} size="5x" />
              )}
            </div>
            {/* Link to navigate to the artist's profile page */}
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
