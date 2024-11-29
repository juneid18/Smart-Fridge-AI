const mongoose = require("mongoose");
const User = require("../../model/UserModel");

async function UpdateItem(req, res) {
  try {
    const { email, itemID, name, quantity } = req.body;

    if (!email || !itemID || !name || quantity <= 0) {
        return res.status(400).json({ message: "Invalid input." });
      }


    const UpdatedItem = await User.findOneAndUpdate(
      {
        email: email,
        "items._id": itemID,
      },
      {
        $set:{
            'items.$.item_name': name,
            'items.$.quantity' : quantity,
        }
      },
      {new:true}
    );

    if (!UpdatedItem) {
        return res.json({
            error: 'User or item not found'
        })
    }

    return res.json({
        success: true,
        message: 'Item is updated'
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `An error occurred: ${error.message}`,
    });
  }
}

module.exports = UpdateItem;
