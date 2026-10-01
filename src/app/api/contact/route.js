import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, serviceType, message, source = "Home Page Form" } = body;

    // Server-side validation
    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
    }
    if (!phone || phone.trim().length < 10) {
      return NextResponse.json({ error: "A valid phone number (at least 10 digits) is required" }, { status: 400 });
    }

    const leadDocument = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      serviceType: serviceType || "General Inquiry",
      message: (message || "").trim(),
      source,
      createdAt: new Date(),
      status: "new",
    };

    // Attempt MongoDB save if configured
    const conn = await connectToDatabase();
    if (conn && conn.db) {
      const collection = conn.db.collection('inquiries');
      await collection.insertOne(leadDocument);
      console.log("[MongoDB] Inquiry inserted successfully:", leadDocument.email);
    } else {
      console.log("[Dynamic Mode] Lead received (MongoDB URI not configured, ready for dynamic connection):", leadDocument);
    }

    return NextResponse.json({
      success: true,
      message: "Thank you! Your request has been received. Our team will contact you shortly.",
      data: { name: leadDocument.name, email: leadDocument.email }
    });
  } catch (error) {
    console.error("API Error in contact route:", error);
    return NextResponse.json({ error: "Failed to submit inquiry. Please try again." }, { status: 500 });
  }
}
