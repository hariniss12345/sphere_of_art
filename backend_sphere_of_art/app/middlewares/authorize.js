// authorizeUser is a middleware function that checks if the current user has the appropriate role(s)
const authorizeUser = (permittedRoles) => {
    // The middleware returns a function that will run for every incoming request
    return (req, res, next) => {
        // Check if the role of the current user is included in the permitted roles
        if(permittedRoles.includes(req.currentUser.role)){
            // If the user's role is allowed, proceed to the next middleware/handler
            next();
        } else {
            // If the user's role is not authorized, return a 403 Forbidden error with an error message
            return res.status(403).json({errors: 'unauthorized access'})
        }
    }
}

// Export the middleware for use in other parts of the application
export default authorizeUser;
