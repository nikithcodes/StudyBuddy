import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email"],
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    branch: {
      type: String,
      required: true,
    },

    year: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    subjects: [
      {
        type: String,
        trim: true,
      },
    ],

    skills: [
      {
        name: String,
        level: {
          type: String,
          enum: ["Beginner", "Intermediate", "Advanced"],
        },
      },
    ],

    studyPreference: {
      type: String,
      enum: ["Group", "One-on-One", "Doubt Help"],
      required: true,
    },

    availability: {
      type: [String], // e.g. ["Mon Evening", "Wed Night"]
    },

    points: {
      type: Number,
      default: 0,
    },

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
