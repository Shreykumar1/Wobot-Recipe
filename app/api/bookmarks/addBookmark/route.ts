import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../utils/dbConnect';
import User from '../../../../models/User';
import { IBookmark } from '../../../../models/User';

export async function POST(request: NextRequest) {
    await dbConnect();

    try {
        const { email, bookmark }: { email: string; bookmark: IBookmark } = await request.json();

        if (!email || !bookmark) {
            return NextResponse.json({ message: 'Email and bookmark are required' }, { status: 400 });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Check if the bookmark already exists
        const existingBookmarkIndex = user.bookmarks.findIndex((b: IBookmark) => b.id === bookmark.id);
        if (existingBookmarkIndex !== -1) {
            // If it exists, remove it
            user.bookmarks.splice(existingBookmarkIndex, 1);
            await user.save();
            return NextResponse.json({ message: 'Bookmark removed successfully', user }, { status: 200 });
        }

        // If it doesn't exist, add the new bookmark
        user.bookmarks.push(bookmark);
        await user.save();

        return NextResponse.json({ message: 'Bookmark added successfully', user }, { status: 201 });
    } catch (error: any) {
        console.error('Error adding bookmark:', error);
        return NextResponse.json({ message: 'Error adding bookmark: ' + error.message }, { status: 500 });
    }
} 