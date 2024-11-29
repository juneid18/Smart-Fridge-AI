const mongoose = require("mongoose");
const User = require("../../model/UserModel");

async function UpdateUser(req, res) {
  try {
    const { email, items } = req.body;

    // Validate if the user data is provided
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Items must be a non-empty array",
      });
    }

    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Add new items to the user's existing items array
    user.items = [...user.items, ...items];
    await user.save();

    res.status(200).json({
      success: true,
      message: "Items added successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `An error occurred: ${error.message}`,
    });
  }
}

module.exports = UpdateUser;
