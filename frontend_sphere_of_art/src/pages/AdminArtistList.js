import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyArtist, unverifyArtist } from "../redux/slices/adminSlice";
import { fetchArtists } from "../redux/slices/artistSlice"; 

const AdminArtistList = () => {
    const dispatch = useDispatch();
    const { artists, loading } = useSelector((state) => state.artists);

    useEffect(() => {
        dispatch(fetchArtists()); // Fetch artists on mount
    }, [dispatch]);

    const handleVerify = async (artistId) => {
        console.log("Verifying artist:", artistId);
        await dispatch(verifyArtist(artistId));
        dispatch(fetchArtists()); 
    };

    const handleUnverify = async (artistId) => {
        console.log("Unverifying artist:", artistId);
        await dispatch(unverifyArtist(artistId));
        dispatch(fetchArtists());
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Manage Artist Verification</h2>
            <ul>
                {artists && artists.length > 0 ? (
                    artists.map((artist) => (
                        <li key={artist._id} className="flex justify-between items-center border-b py-2">
                            <div>
                                <h3 className="text-lg font-medium">{artist?.user?.username || "Unknown"}</h3>
                                <p>{artist.bio || "No bio available"}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleVerify(artist._id)}
                                    className={`px-4 py-2 rounded ${artist.isVerified ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-700 text-white"}`}
                                    disabled={artist.isVerified} 
                                >
                                    Verify
                                </button>
                                <button
                                    onClick={() => handleUnverify(artist._id)}
                                    className={`px-4 py-2 rounded ${!artist.isVerified ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-700 text-white"}`}
                                    disabled={!artist.isVerified}
                                >
                                    Unverify
                                </button>
                            </div>
                        </li>
                    ))
                ) : (
                    <p>No artists found.</p>
                )}
            </ul>
        </div>
    );
};

export default AdminArtistList;
