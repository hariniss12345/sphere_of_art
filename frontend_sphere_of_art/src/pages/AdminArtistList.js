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

    if (loading) return <p className="text-white">Loading...</p>;

    return (
        <div className="p-6 bg-black min-h-screen text-white">
            <h2 className="text-2xl font-semibold mb-6 text-center">
                Review and verify artists before they can start showcasing their work.
                <br />
                <span className="mt-2 block">Grant verification with a single click.</span>
            </h2>

            {/* Added extra space above the card layout */}
            <div className="mt-10">
                {artists && artists.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {artists.map((artist) => (
                            <div key={artist._id} className="bg-gray-800 rounded-lg p-6 shadow-lg flex flex-col items-center text-center">
                                <h3 className="text-lg font-medium mb-2">{artist?.user?.username || "Unknown"}</h3>
                                <div className="flex gap-4 mt-4">
                                    <button
                                        onClick={() => handleVerify(artist._id)}
                                        className={`px-4 py-2 rounded font-semibold transition ${
                                            artist.isVerified
                                                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                                                : "bg-green-500 hover:bg-green-700 text-black"
                                        }`}
                                        disabled={artist.isVerified}
                                    >
                                        Verify
                                    </button>
                                    <button
                                        onClick={() => handleUnverify(artist._id)}
                                        className={`px-4 py-2 rounded font-semibold transition ${
                                            !artist.isVerified
                                                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                                                : "bg-red-500 hover:bg-red-700 text-black"
                                        }`}
                                        disabled={!artist.isVerified}
                                    >
                                        Unverify
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400 text-center">No artists found.</p>
                )}
            </div>
        </div>
    );
};

export default AdminArtistList;
