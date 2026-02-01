import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import Transaction from "../../../models/Transaction";

export async function GET(req) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const month = searchParams.get('month');
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    
    let query = {};
    
    if (month) {
      const [year, monthNum] = month.split('-');
      const startDate = new Date(year, monthNum - 1, 1);
      const endDate = new Date(year, monthNum, 0, 23, 59, 59);
      query.date = { $gte: startDate, $lte: endDate };
    }
    
    if (category) {
      query.category = category;
    }
    
    if (type) {
      query.type = type;
    }
    
    const data = await Transaction.find(query).sort({ date: -1 });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    
    // Validation
    if (!body.amount || body.amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }
    
    if (!body.type) {
      return NextResponse.json(
        { error: "Transaction type is required" },
        { status: 400 }
      );
    }
    
    const txn = await Transaction.create(body);
    return NextResponse.json(txn);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    const body = await req.json();
    
    if (!body._id) {
      return NextResponse.json(
        { error: "Transaction ID is required" },
        { status: 400 }
      );
    }
    
    const updated = await Transaction.findByIdAndUpdate(
      body._id,
      {
        amount: body.amount,
        type: body.type,
        description: body.description,
        category: body.category,
        tags: body.tags,
        paymentMethod: body.paymentMethod,
        isRecurring: body.isRecurring,
        recurringFrequency: body.recurringFrequency,
        updatedAt: Date.now(),
      },
      { new: true }
    );
    
    if (!updated) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update transaction" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    const { id } = await req.json();
    
    if (!id) {
      return NextResponse.json(
        { error: "Transaction ID is required" },
        { status: 400 }
      );
    }
    
    const deleted = await Transaction.findByIdAndDelete(id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete transaction" },
      { status: 500 }
    );
  }
}
