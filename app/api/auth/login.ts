import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../utils/dbConnect'; // Ensure you have a dbConnect utility
import User from '../../../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; 

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Use a secure secret

export default async function loginHandler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'POST') {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
      return res.status(200).json({ token, user: { email: user.email, bookmarks: user.bookmarks } });
    } catch (error) {
      return res.status(500).json({ message: 'Error logging in', error });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}