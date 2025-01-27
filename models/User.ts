import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  email: string;
  password: string;
  bookmarks: IBookmark[];
}
export interface IBookmark extends Document {
  id: number;
  image: string;
  imageType: string;
  title: string;
}

const IBookmarkSchema: Schema = new Schema({
  id: { type: Number, required: true },
  image: { type: String, required: true },
  imageType: { type: String, required: true },
  title: { type: String, required: true },
});

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bookmarks: { type: [IBookmarkSchema], default: [] },
});

console.log("UserSchema", mongoose.models)
// Check if the model already exists to avoid overwriting
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;