// Import the User model for checking existing users during registration or login
import User from '../models/user-model.js';

/*
 * Schema for user registration validation.
 * Validates the data entered by the user during the registration process.
*/

export const userRegisterSchema = {
    // Validation rules for the username field
    username: {
        exists: {
            errorMessage: 'username field is required', // Ensures the username is provided
        },
        notEmpty: {
            errorMessage: 'username should not be empty', // Ensures the username is not empty
        },
        isLength: {
            options: { min: 3 }, // Ensures the username is at least 3 characters long
            errorMessage: 'username should be at least 3 characters',
        },
        trim: true, // Removes leading and trailing spaces from the username
    },
    // Validation rules for the email field
    email: {
        exists: {
            errorMessage: 'email field is required', // Ensures the email is provided
        },
        notEmpty: {
            errorMessage: 'email should not be empty', // Ensures the email is not empty
        },
        isEmail: {
            errorMessage: 'email should be in a valid format', // Ensures the email is in a valid format
        },
        trim: true, // Removes leading and trailing spaces from the email
        normalizeEmail: true, // Normalizes the email to a consistent format
        custom: {
            // Custom validation to check if the email already exists in the database
            options: async (value) => {
                const user = await User.findOne({ email: value }); // Search for an existing user with the same email
                if (user) {
                    throw new Error('email is already taken'); // If email is already taken, throw an error
                }
                return true;
            },
        },
    },
    // Validation rules for the password field
    password: {
        exists: {
            errorMessage: 'password field is required', // Ensures the password is provided
        },
        notEmpty: {
            errorMessage: 'password should not be empty', // Ensures the password is not empty
        },
        isStrongPassword: {
            options: {
                minLength: 8, // Minimum length of 8 characters for the password
                minUpperCase: 1, // At least one uppercase letter
                minLowerCase: 1, // At least one lowercase letter
                minNumber: 1, // At least one number
                minSymbol: 1, // At least one symbol
            },
            errorMessage: 'password must contain at least one uppercase letter, one lowercase letter, one number, one symbol, and be at least 8 characters long', // Custom error message for password complexity
        },
        trim: true, // Removes leading and trailing spaces from the password
    },
};

/**
 * Schema for user login validation.
 * Validates the data entered by the user during the login process.
*/

export const userLoginSchema = {
    // Validation rules for the username field
    username: {
        exists: {
            errorMessage: 'username field is required', // Ensures the username is provided
        },
        notEmpty: {
            errorMessage: 'username should not be empty', // Ensures the username is not empty
        },
        isLength: {
            options: { min: 3 }, // Ensures the username is at least 3 characters long
            errorMessage: 'username should be at least 3 characters',
        },
        trim: true, // Removes leading and trailing spaces from the username
    },
    // Validation rules for the email field
    email: {
        exists: {
            errorMessage: 'email field is required', // Ensures the email is provided
        },
        notEmpty: {
            errorMessage: 'email cannot be empty', // Ensures the email is not empty
        },
        isEmail: {
            errorMessage: 'email should be in a valid format', // Ensures the email is in a valid format
        },
        trim: true, // Removes leading and trailing spaces from the email
        normalizeEmail: true, // Normalizes the email to a consistent format
    },
    // Validation rules for the password field
    password: {
        exists: {
            errorMessage: 'password field is required', // Ensures the password is provided
        },
        notEmpty: {
            errorMessage: 'password cannot be empty', // Ensures the password is not empty
        },
        isStrongPassword: {
            options: {
                minLength: 8, // Minimum length of 8 characters for the password
                minUpperCase: 1, // At least one uppercase letter
                minLowerCase: 1, // At least one lowercase letter
                minNumber: 1, // At least one number
                minSymbol: 1, // At least one symbol
            },
            errorMessage: 'password must contain at least one uppercase letter, one lowercase letter, one number, one symbol, and be at least 8 characters long', // Custom error message for password complexity
        },
        trim: true, // Removes leading and trailing spaces from the password
    },
};
