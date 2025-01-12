// Import the jsonwebtoken library for verifying the JWT
import jwt from 'jsonwebtoken'

// Middleware function to authenticate users based on their JWT
export default function authenticateUser(req, res, next) {
    // Retrieve the token from the 'Authorization' header
    let token = req.headers['authorization']

    // If no token is provided, return a 401 response indicating the token is required
    if (!token) {
        return res.status(401).json({ errors: 'token is required' })
    }

    // Split the token from the 'Bearer <token>' format to extract the token itself
    token = token.split(' ')[1]

    try {
        // Verify the token using the JWT secret key, this will decode the token if valid
        const tokenData = jwt.verify(token, process.env.JWT_SECRET)

        // Attach the decoded user data (userId and role) to the request object for further use
        req.currentUser = { userId: tokenData.userId, role: tokenData.role }

        // Call the next middleware function or route handler if the token is valid
        next()
    } catch (err) {
        // If the token is invalid or expired, return a 401 response with the error message
        return res.status(401).json({ errors: err.message })
    }
}
