import { prisma } from '@/lib/db';

export class RateLimiter {
  async checkLimit(identifier: string, isAuthenticated: boolean): Promise<{
    allowed: boolean;
    remaining: number;
    limit: number;
    resetAt: Date;
  }> {
    // Authenticated users get unlimited
    if (isAuthenticated) {
      return {
        allowed: true,
        remaining: -1, // Unlimited
        limit: -1,
        resetAt: new Date()
      };
    }

    // For anonymous users, use IP or identifier
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Count analyses for this identifier today
    const count = await prisma.analysis.count({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow
        },
        ipAddress: identifier, // Only count by IP for anonymous users
        userId: null // Make sure we're only counting anonymous analyses
      }
    });

    const limit = 3; // Free tier limit
    const remaining = Math.max(0, limit - count);

    console.log(`Rate limit check for ${identifier}: ${count}/${limit} used`);

    return {
      allowed: count < limit,
      remaining,
      limit,
      resetAt: tomorrow
    };
  }

  async recordUsage(identifier: string, url: string, userId?: string) {
    // Record the analysis
    await prisma.analysis.create({
      data: {
        url,
        userId: userId || null,
        ipAddress: userId ? null : identifier, // Store IP for anonymous users
        seoScore: 0,
        aiScore: 0,
        overallScore: 0,
        technicalSeo: '{}', // Empty JSON string for SQLite
        onPageSeo: '{}', // Empty JSON string for SQLite
        aiOptimization: '{}', // Empty JSON string for SQLite
        recommendations: '[]' // Empty array string for SQLite
      }
    });
  }
}