import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch user's analyses
    const analyses = await prisma.analysis.findMany({
      where: {
        userId: session.user.id
      },
      select: {
        id: true,
        url: true,
        seoScore: true,
        aiScore: true,
        overallScore: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50 // Limit to last 50 analyses
    });

    return NextResponse.json(analyses);
    
  } catch (error) {
    console.error('Failed to fetch analyses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analyses' },
      { status: 500 }
    );
  }
}