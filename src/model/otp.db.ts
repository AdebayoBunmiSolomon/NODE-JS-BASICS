import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
    },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt`
);

// TTL Index for automatic deletion
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OtpModel = mongoose.model("OTP", otpSchema);
