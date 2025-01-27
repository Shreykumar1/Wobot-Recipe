import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../utils/dbConnect'; // Ensure you have a dbConnect utility
import User from '../../../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Use a secure secret

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    return res.status(200).json({ message: 'Hello World' });
}

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'POST') {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ email, password: hashedPassword });
      await newUser.save();

      const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '1h' });
      return res.status(201).json({ token, user: { email: newUser.email, bookmarks: newUser.bookmarks } });
    } catch (error) {
      return res.status(500).json({ message: 'Error creating user', error });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}