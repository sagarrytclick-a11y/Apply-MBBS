import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Enquiry from "@/models/Enquiry";
import { requireAdmin } from "@/lib/adminAuth";
import { escapeRegex, sanitizePlainText } from "@/lib/security";

const MAX_LIMIT = 50;
const MAX_SEARCH = 80;

export async function GET(request: NextRequest) {
  const auth = requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, Math.min(1000, parseInt(searchParams.get("page") || "1", 10) || 1));
    const limit = Math.max(
      1,
      Math.min(MAX_LIMIT, parseInt(searchParams.get("limit") || "10", 10) || 10)
    );
    const searchRaw = searchParams.get("search");

    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {};

    if (searchRaw) {
      const search = sanitizePlainText(searchRaw, MAX_SEARCH);
      if (search) {
        const safe = escapeRegex(search);
        query.$or = [
          { name: { $regex: safe, $options: "i" } },
          { email: { $regex: safe, $options: "i" } },
          { mobile: { $regex: safe, $options: "i" } },
          { courseInterest: { $regex: safe, $options: "i" } },
        ];
      }
    }

    const enquiries = await Enquiry.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Enquiry.countDocuments(query);

    return NextResponse.json({
      enquiries,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    console.error("Error fetching enquiries:", error instanceof Error ? error.message : "unknown");
    return NextResponse.json(
      {
        error: "Failed to fetch enquiries",
        enquiries: [],
        pagination: { page: 1, limit: 10, total: 0, pages: 0 },
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const auth = requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    await connectDB();

    const { searchParams } = request.nextUrl;
    let targetId = (searchParams.get("id") || "").trim();

    if (!targetId) {
      try {
        const body = await request.json();
        targetId = String(body?.id || "").trim();
      } catch {
        /* no body */
      }
    }

    if (!targetId) {
      return NextResponse.json({ error: "Enquiry ID is required" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(targetId)) {
      return NextResponse.json({ error: "Invalid enquiry ID" }, { status: 400 });
    }

    const enquiry = await Enquiry.findByIdAndDelete(targetId);

    if (!enquiry) {
      return NextResponse.json(
        { message: "Enquiry already deleted", alreadyDeleted: true },
        { status: 200 }
      );
    }

    return NextResponse.json({ message: "Enquiry deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting enquiry:", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ error: "Failed to delete enquiry" }, { status: 500 });
  }
}
