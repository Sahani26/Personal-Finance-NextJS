import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["income", "expense", "credit", "credit_payment"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  description: String,
  category: {
    type: String,
    default: "Other",
  },
  tags: [String],
  paymentMethod: {
    type: String,
    enum: ["cash", "card", "upi", "bank_transfer", "other"],
    default: "cash",
  },
  isRecurring: {
    type: Boolean,
    default: false,
  },
  recurringFrequency: {
    type: String,
    enum: ["daily", "weekly", "monthly", "yearly"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
TransactionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);
