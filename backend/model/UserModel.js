const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  profile_img: {
    type: String,
    default: null, 
  },
  items: [
    {
      item_name: {
        type: String,
        default: null, 
      },
      quantity: {
        type: Number,
        default: null,
      },
    },
  ],
});

// Create the User model
const User = mongoose.model("User", UserSchema);

module.exports = User;
