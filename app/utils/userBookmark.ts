"use server";

import dbConnect from './dbConnect';
import User, { IBookmark } from '../../models/User';

export const fetchUser = async (email: string) => {
  await dbConnect();
  
  try {
    const user = await User.findOne({ email });
    return user;
  } catch (error: any) {
    throw new Error('Error fetching user: ' + error.message);
  }
};

export const addBookmark = async (email: string, bookmark: IBookmark) => {
  await dbConnect();
  console.log("Bookmark", bookmark);
  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }

    user.bookmarks.push(bookmark);
    await user.save();
    return user;
  } catch (error: any) {
    throw new Error('Error adding bookmark: ' + error.message);
  }
}; 