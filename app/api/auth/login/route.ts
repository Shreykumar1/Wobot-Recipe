import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../utils/dbConnect'; // Ensure you have a dbConnect utility
import User from '../../../../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; 

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Use a secure secret

export async function POST(request: NextRequest) {
    await dbConnect();

    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        return NextResponse.json({ token, user: { email: user.email, bookmarks: user.bookmarks } }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error logging in', error }, { status: 500 });
    }
}