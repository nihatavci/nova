import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sharedResults } from '@/models/schema';
import { eq } from 'drizzle-orm';

// POST /api/share/verify - Verify password for protected shared results
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { shareId, password } = body;

    if (!shareId || !password) {
      return NextResponse.json(
        { error: 'Share ID and password are required' },
        { status: 400 }
      );
    }

    // Find the shared result
    const [sharedResult] = await db
      .select()
      .from(sharedResults)
      .where(eq(sharedResults.shareId, shareId));

    if (!sharedResult) {
      return NextResponse.json(
        { error: 'Shared result not found' },
        { status: 404 }
      );
    }

    // Check if the result is password protected
    if (!sharedResult.isProtected) {
      return NextResponse.json(
        { error: 'This shared result is not password protected' },
        { status: 400 }
      );
    }

    // Check if the password matches
    if (sharedResult.accessPassword !== password) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Return the shared result data
    return NextResponse.json({
      success: true,
      shareId: sharedResult.shareId,
      resultData: sharedResult.resultData,
      score: sharedResult.score,
      createdAt: sharedResult.createdAt,
      expiresAt: sharedResult.expiresAt,
      viewCount: sharedResult.viewCount,
    });
  } catch (error) {
    console.error('Error verifying shared result password:', error);
    return NextResponse.json(
      { error: 'Failed to verify password' },
      { status: 500 }
    );
  }
} 