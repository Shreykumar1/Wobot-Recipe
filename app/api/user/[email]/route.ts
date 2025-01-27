import { NextRequest, NextResponse } from 'next/server';
import User from "@/models/User";
import dbConnect from "@/app/utils/dbConnect";


export async function GET(request: NextRequest) {
    try {
        await dbConnect();
        const email = request.nextUrl.pathname.split('/')[3];
        if (!email) {
            return NextResponse.json({ message: 'Email is required' }, { status: 400 });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Exclude the password field from the response
        const { password, ...userWithoutPassword } = user.toObject(); // Convert to plain object and omit password

        return NextResponse.json({ user: userWithoutPassword }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Error fetching user: ' + error.message }, { status: 500 });
    }
}   
