import AuthContext from "../context/Auth.js";
import { useContext } from "react";

export default function Profile() {
  const { userState } = useContext(AuthContext);

  // If userState is null or undefined, show a loading message
  if (!userState) {
    return <p>Loading...</p>;
  }

  // Extract basic user details and role
  const { username, email, role, details } = userState.user;

  return (
    <div>
      <h1>Profile Page</h1>
      <h2>Name: {username}</h2>
      <h2>Email: {email}</h2>

      {/* Conditionally render role-based details */}
      {role === "customer" && details && (
        <div>
          <h3>Customer Details:</h3>
          <p>Address: {details.address || "Not provided"}</p>
          <p>Contact Number: {details.contactNumber || "Not provided"}</p>
        </div>
      )}

      {role === "artist" && details && (
        <div>
          <p>Bio: {details.bio || "Not provided"}</p>
          <p>Styles: {details.styles?.join(", ") || "Not provided"}</p>
          <div>
            <h4>Portfolio:</h4>
            {details.portfolio?.length > 0 ? (
              details.portfolio.map((item) => (
                <div key={item.title}>
                  <img
                    src={`${process.env.REACT_APP_API_BASE_URL}/${item.filePath}`}
                    alt={item.title}
                    style={{ width: "200px", margin: "10px 0" }}
                  />
                  <p>{item.title}</p>
                </div>
              ))
            ) : (
              <p>No portfolio items uploaded.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
