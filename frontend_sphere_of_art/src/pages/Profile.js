import AuthContext from "../context/Auth.js";
import { useContext } from "react";

export default function Profile() {
  const { userState } = useContext(AuthContext);

  if (!userState) {
    return <p className="text-center text-gray-400 text-lg">Loading...</p>;
  }

  const { username, email, role, details } = userState.user;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-4xl p-6 bg-gray-900 shadow-lg rounded-lg text-white">
        <h1 className="text-3xl font-semibold text-white mb-4">Profile Page</h1>

        {/* Common Layout for both Customer & Artist */}
        <div className="flex flex-col md:flex-row items-start border-b border-gray-700 pb-4 mb-4">
          {/* Left Side: Name & Email */}
          <div className="md:w-1/3 mb-4 md:mb-0">
            <h2 className="text-2xl font-medium text-gray-300">{username}</h2>
            <p className="text-gray-400">{email}</p>
          </div>

          {/* Right Side: Artist or Customer Details */}
          <div className="md:w-2/3">
            {role === "customer" && details && (
              <>
                <p className="text-gray-400 mb-2">
                  <span className="font-semibold text-gray-300">Address:</span>{" "}
                  {details.address || "Not provided"}
                </p>
                <p className="text-gray-400">
                  <span className="font-semibold text-gray-300">Contact Number:</span>{" "}
                  {details.contactNumber || "Not provided"}
                </p>
              </>
            )}

            {role === "artist" && details && (
              <>
                <p className="text-gray-400 mb-2">
                  <span className="font-semibold text-gray-300">Bio:</span>{" "}
                  {details.bio || "Not provided"}
                </p>
                <p className="text-gray-400">
                  <span className="font-semibold text-gray-300">Styles:</span>{" "}
                  {details.styles?.join(", ") || "Not provided"}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Portfolio Section for Artists */}
        {role === "artist" && details?.portfolio?.length > 0 && (
          <div className="mt-4">
            <h4 className="text-lg font-semibold text-white mb-2">Portfolio:</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {details.portfolio.map((item) => (
                <div
                  key={item.title}
                  className="p-2 border border-gray-700 rounded-lg shadow-sm bg-gray-800"
                >
                  <img
                    src={`${process.env.REACT_APP_API_BASE_URL}/${item.filePath}`}
                    alt={item.title}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <p className="text-center text-gray-300 mt-2">{item.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
