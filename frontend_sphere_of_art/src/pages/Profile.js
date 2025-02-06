import AuthContext from "../context/Auth.js";
import { useContext } from "react";

export default function Profile() {
  const { userState } = useContext(AuthContext);

  if (!userState) {
    return <p className="text-center text-gray-600 text-lg">Loading...</p>;
  }

  const { username, email, role, details } = userState.user;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-3xl font-semibold text-gray-800 mb-4">Profile Page</h1>
      <div className="border-b pb-4 mb-4">
        <h2 className="text-xl font-medium text-gray-700">Name: {username}</h2>
        <h2 className="text-xl font-medium text-gray-700">Email: {email}</h2>
      </div>

      {role === "customer" && details && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Customer Details:</h3>
          <p className="text-gray-600">Address: {details.address || "Not provided"}</p>
          <p className="text-gray-600">Contact Number: {details.contactNumber || "Not provided"}</p>
        </div>
      )}

      {role === "artist" && details && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Artist Details:</h3>
          <p className="text-gray-600">Bio: {details.bio || "Not provided"}</p>
          <p className="text-gray-600">Styles: {details.styles?.join(", ") || "Not provided"}</p>
          <div className="mt-4">
            <h4 className="text-lg font-semibold text-gray-800">Portfolio:</h4>
            {details.portfolio?.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                {details.portfolio.map((item) => (
                  <div key={item.title} className="p-2 border rounded-lg shadow-sm">
                    <img
                      src={`${process.env.REACT_APP_API_BASE_URL}/${item.filePath}`}
                      alt={item.title}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <p className="text-center text-gray-700 mt-2">{item.title}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No portfolio items uploaded.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
