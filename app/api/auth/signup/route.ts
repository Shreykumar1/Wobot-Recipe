import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect'; // Ensure you have a dbConnect utility
import User from '../../../../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Use a secure secret

// Connect to MongoDB
const connectToDatabase = async () => {
    if (mongoose.connection.readyState === 1) return; // Already connected
    await mongoose.connect(process.env.MONGO_URI || 'your_mongodb_uri');
};


export  async function POST(req: Request) {
    await connectToDatabase(); // Ensure database connection
    
    if (req.method === 'POST') {
        const body = await req.json();
        console.log("signupHandler called",body);
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required' },{status:400});
        }

        try {
            // Check if user already exists
            const existingUser = await User.findOne({ email });

            if (existingUser) {
                return NextResponse.json({ message: 'User already exists' },{status:409});
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create the user
            const newUser = new User({ email, password: hashedPassword });
            await newUser.save();

            const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '30d' });
                return NextResponse.json({ token, user: { email: newUser.email, bookmarks: newUser.bookmarks } },{status:201});
        } catch (error) {
            console.error(error);
            return NextResponse.json({ message: 'Internal Server Error' },{status:500});
        }
    }

    return NextResponse.json({ message: 'Method not allowed' },{status:405});
}