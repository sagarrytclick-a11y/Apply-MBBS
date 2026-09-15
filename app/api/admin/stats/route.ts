import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Enquiry from '@/models/Enquiry';
import { requireAdmin } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  const auth = requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    await connectDB();
    
    const totalEnquiries = await Enquiry.countDocuments();
    
    const courseStats: any = await Enquiry.aggregate([
      {
        $group: {
          _id: '$courseInterest',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayEnquiries = await Enquiry.countDocuments({
      createdAt: {
        $gte: today,
        $lt: tomorrow
      }
    });
    
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnquiries = await Enquiry.countDocuments({
      createdAt: {
        $gte: weekStart
      }
    });
    
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    
    const monthEnquiries = await Enquiry.countDocuments({
      createdAt: {
        $gte: monthStart
      }
    });
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentEnquiries = await Enquiry.find({
      createdAt: {
        $gte: sevenDaysAgo
      }
    }).sort({ createdAt: -1 }).limit(5);
    
    return NextResponse.json({
      totalEnquiries,
      todayEnquiries,
      weekEnquiries,
      monthEnquiries,
      courseStats: courseStats.reduce((acc: any, stat: any) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
      recentEnquiries,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
