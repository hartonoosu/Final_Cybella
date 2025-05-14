// src/models/User.ts
import mongoose, { Document, Schema, Model, models, model } from 'mongoose';

// Define user type
export interface IUser extends Document {
  email: string;
  password: string;
}

// Create schema
const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// ✅ Explicitly define the model type
const User: Model<IUser> = models.User || model<IUser>('User', UserSchema);
export default User;
