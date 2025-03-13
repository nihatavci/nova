import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sharedResults } from '@/models/schema';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

// POST /api/share - Create a new shared result
export async function POST(request: NextRequest) {
  try {
    console.log('Starting share request processing');
    
    const body = await request.json();
    console.log('Request body:', body);
    
    const { resultData, score, isProtected, accessPassword } = body;

    // Validate required data
    if (!resultData) {
      console.log('Missing required resultData');
      return NextResponse.json(
        { error: 'Result data is required' },
        { status: 400 }
      );
    }

    // Generate a unique share ID (12 characters)
    const shareId = nanoid(12);
    console.log('Generated shareId:', shareId);

    // Calculate expiration date (30 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    console.log('Attempting database insertion with:', {
      shareId,
      hasResultData: !!resultData,
      hasScore: !!score,
      expiresAt,
      isProtected,
      hasPassword: !!accessPassword
    });

    // Insert the shared result into the database
    try {
      const [newSharedResult] = await db
        .insert(sharedResults)
        .values({
          shareId,
          resultData,
          score,
          expiresAt,
          isProtected: isProtected || false,
          accessPassword: accessPassword || null,
        })
        .returning();
      
      console.log('Successfully inserted shared result:', {
        shareId: newSharedResult.shareId,
        expiresAt: newSharedResult.expiresAt
      });

      // Get the origin from the request headers or URL
      const origin = request.headers.get('origin') || request.nextUrl.origin;
      console.log('Using origin:', origin);

      return NextResponse.json({
        success: true,
        shareId: newSharedResult.shareId,
        shareUrl: `${origin}/shared/${newSharedResult.shareId}`,
        expiresAt: newSharedResult.expiresAt,
      });
    } catch (dbError: any) {
      console.error('Database error:', dbError);
      throw new Error(`Database error: ${dbError?.message || 'Unknown database error'}`);
    }
  } catch (error: any) {
    console.error('Error creating shared result:', {
      error,
      message: error?.message || 'Unknown error',
      stack: error?.stack
    });
    return NextResponse.json(
      { error: `Failed to create shared result: ${error?.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}

// GET /api/share?id=shareId - Get a shared result by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const shareId = searchParams.get('id');

    if (!shareId) {
      return NextResponse.json(
        { error: 'Share ID is required' },
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

    // Check if the result has expired
    if (sharedResult.expiresAt && new Date() > new Date(sharedResult.expiresAt)) {
      return NextResponse.json(
        { error: 'This shared result has expired' },
        { status: 410 }
      );
    }

    // Increment view count
    await db
      .update(sharedResults)
      .set({ viewCount: (sharedResult.viewCount || 0) + 1 })
      .where(eq(sharedResults.id, sharedResult.id));

    // If the result is password protected, don't return the data
    if (sharedResult.isProtected) {
      return NextResponse.json({
        isProtected: true,
        shareId: sharedResult.shareId,
        createdAt: sharedResult.createdAt,
        expiresAt: sharedResult.expiresAt,
      });
    }

    // Return the shared result data
    return NextResponse.json({
      shareId: sharedResult.shareId,
      resultData: sharedResult.resultData,
      score: sharedResult.score,
      createdAt: sharedResult.createdAt,
      expiresAt: sharedResult.expiresAt,
      viewCount: sharedResult.viewCount,
    });
  } catch (error) {
    console.error('Error retrieving shared result:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve shared result' },
      { status: 500 }
    );
  }
} 