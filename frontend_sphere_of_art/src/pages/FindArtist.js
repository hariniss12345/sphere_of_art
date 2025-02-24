import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchArtists } from "../redux/slices/artistSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";

const FindArtist = () => {
  const dispatch = useDispatch();
  const { artists, loading, error } = useSelector((state) => state.artists);

  useEffect(() => {
    dispatch(fetchArtists());
  }, [dispatch]);

  if (loading)
    return <p className="text-center text-lg text-white">Loading artists...</p>;
  if (error)
    return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="min-h-screen bg-black px-6 py-8">
      <h1 className="text-3xl font-semibold text-center mb-4 text-white">
        Meet Our Artists
      </h1>
      <h2 className="text-xl text-center mb-6 text-gray-300">
        Explore the talents ready to bring your vision to life
      </h2>
      
      <div className="flex flex-wrap justify-center gap-6">
        {artists.map((artist) => (
          <div
            key={artist._id}
            className="w-1/4 max-w-xs p-4 bg-gray-900 rounded-lg shadow-md text-center"
          >
            <div className="mb-4">
              {artist.profileImage ? (
                <img
                  src={artist.profileImage}
                  alt="Artist"
                  className="w-20 h-20 rounded-full mx-auto"
                />
              ) : (
                <FontAwesomeIcon
                  icon={faUserCircle}
                  size="5x"
                  className="text-gray-500"
                />
              )}
            </div>
            <Link
              to={`/artist-profile/${artist._id}`}
              className="text-lg font-semibold text-blue-400 hover:text-blue-600"
            >
              <span>{artist.user.username}</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FindArtist;
