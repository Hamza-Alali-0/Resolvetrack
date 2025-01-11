// app/api/display/[id]/route.ts
import { NextResponse } from 'next/server';
import connect from '../../../../utils/db';
import Post from '../../../../models/Post';

export async function GET(request, { params }) {
    const { id } = params;
    await connect();
    const post = await Post.findOne({ _id: id });
    return NextResponse.json({ post }, { status: 200 });
  }
