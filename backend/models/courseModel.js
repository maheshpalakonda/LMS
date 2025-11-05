import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
    },
    subTitle: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Course category is required"],
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    price: {
      type: Number,
      default: 0,
    },
    thumbnail: {
      type: String,
    },
    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ],

    // ✅ Lecture references
    lectures: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture",
      }
    ],

    // ✅ Course Creator
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // ✅ Course publish status
    isPublished: {
      type: Boolean,
      default: false,
    },

    // ✅ Ratings / Reviews
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      }
    ],

    videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      }
    ],
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);

export default Course;
