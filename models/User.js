// models/User.js
import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, 
    name: { type: String }, // Name from GitHub or email prefix
    provider: { type: String, enum: ['credentials', 'github'], default: 'credentials' },
    githubId: { type: String, sparse: true }, // GitHub user ID without duplicate index
    createdAt: { type: Date, default: Date.now },
  },
  {
    collection: 'users', 
  }
)

export default mongoose.models.User || mongoose.model('User', UserSchema)
