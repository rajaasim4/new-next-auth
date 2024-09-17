const { default: mongoose } = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please Provide User Name"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please Provide Email"],
    unique: true,
  },

  phonenumber: {
    type: String,
    required: [true, "Please Provide Phone Number"],
  },
  password: {
    type: String,
    required: [true, "Please Provide Password"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },

  isAdmin: {
    type: Boolean,
    default: false,
  },
  verifyToken: String,
  verifyTokenExpiry: Date,
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
});

//Next js don't know about that either is it first time created or not so we do that if model is created than return that model and if not than create new one
const User = mongoose.models.users || mongoose.model("users", UserSchema);

export default User;
