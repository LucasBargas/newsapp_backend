import mongoose from 'mongoose';

const User = mongoose.model(
  'User',
  mongoose.Schema(
    {
      name: String,
      email: String,
      bio: String,
      password: String,
    },
    { timestamps: true },
  ),
);

export default User;
