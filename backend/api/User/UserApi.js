const mongoose = require("mongoose");
const User = require("../../model/UserModel");

async function UserApi(req, res) {
    try {
        const { name, email, profile_img, items } = req.body;

        // Validate required fields
        if (!email) {
            return res.status(422).json({
                success: false,
                message: "Name and email are required",
            });
        }

        // Check if the email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(200).json({ // Conflict status code
                success: false,
                message: "Email already exists",
                userData: existingUser, // Sending existing user info for frontend reference
            });
        }

        // Create a new user
        const newUser = new User({
            name,
            email,
            profile_img: profile_img || null, // Defaulting to null if not provided
            items: items || [], // Defaulting to an empty array if not provided
        });

        const savedUser = await newUser.save();

        return res.status(201).json({ // Created status code
            success: true,
            message: "User successfully created",
            data: savedUser,
        });
    } catch (error) {
        console.error("Error in UserApi:", error);

        return res.status(500).json({
            success: false,
            message: "An internal server error occurred",
            error: error.message,
        });
    }
}

module.exports = UserApi;
