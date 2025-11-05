import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
  {
    lectureTitle: {
      type: String,
      required: [true, "Lecture title is required"],
      trim: true,
    },

    videoUrl: {
      type: String,
      default: "",
    },

    isPreviewFree: {
      type: Boolean,
      default: false,
    },

    // ✅ LIVE CLASS SETTINGS
    isLive: {
      type: Boolean,
      default: false,
    },

    liveStartTime: {
      type: Date,
      default: null,
    },

    liveRoomId: {
      type: String,
      default: null,
    },

    // ✅ SECURITY LOGS
    violations: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        violationType: {
          type: String,
          enum: ["screenshot", "screen_recording", "copy", "print", "dev_tools"],
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        ipAddress: {
          type: String,
          default: "",
        },
      },
    ],
  },
  { timestamps: true }
);

const Lecture = mongoose.model("Lecture", lectureSchema);

export default Lecture;
