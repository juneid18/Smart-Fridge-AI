const User = require("../../model/UserModel");

async function DeleteItem(req, res) {
  try {
    const { email, itemID } = req.body;

    // Validate inputs
    if (!email || !itemID || itemID <= 0) {
      return res.status(400).json({ message: "Invalid input." });
    }

    // Find the user by email
    const FindUser = await User.findOne({ email });

    if (!FindUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // Find the item to delete (assuming it's an array of items inside the user document)
    const itemIndex = FindUser.items.findIndex(item => item._id.toString() === itemID.toString());

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found." });
    }

    // Remove the item from the array
    FindUser.items.splice(itemIndex, 1);

    // Save the updated user document
    await FindUser.save();

    return res.status(200).json({ message: "Item deleted successfully." });
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `An error occurred: ${error.message}`,
    });
  }
}

module.exports = DeleteItem;
