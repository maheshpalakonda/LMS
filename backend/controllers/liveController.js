import Lecture from '../models/lectureModel.js';
import Course from '../models/courseModel.js'; // Assuming courseModel exists for enrollment check
import User from '../models/userModel.js'; // For logging violations

// Start live session - Educator only
export const startLiveSession = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const user = req.user; // From auth middleware

    // Check if user is educator and owns the course
    const lecture = await Lecture.findById(lectureId).populate('courseId'); // Assuming lecture has courseId
    if (!lecture) return res.status(404).json({ message: 'Lecture not found' });
    if (lecture.courseId.educatorId.toString() !== user.id) {
      return res.status(403).json({ message: 'Unauthorized to start live session' });
    }

    // Generate room ID (simple UUID or timestamp-based)
    const roomId = `live_${lectureId}_${Date.now()}`;

    // Update lecture
    lecture.isLive = true;
    lecture.liveStartTime = new Date();
    lecture.liveRoomId = roomId;
    await lecture.save();

    res.json({ message: 'Live session started', roomId, startTime: lecture.liveStartTime });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Join live session - Student only, enrolled
export const joinLiveSession = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const user = req.user; // From auth middleware

    const lecture = await Lecture.findById(lectureId).populate('courseId');
    if (!lecture) return res.status(404).json({ message: 'Lecture not found' });
    if (!lecture.isLive) return res.status(400).json({ message: 'Live session not active' });

    // Check enrollment (assuming course has enrolledStudents array)
    const course = lecture.courseId;
    if (!course.enrolledStudents.includes(user.id)) {
      return res.status(403).json({ message: 'Not enrolled in this course' });
    }

    res.json({ roomId: lecture.liveRoomId, startTime: lecture.liveStartTime });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// End live session - Educator only
export const endLiveSession = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const user = req.user;

    const lecture = await Lecture.findById(lectureId).populate('courseId');
    if (!lecture) return res.status(404).json({ message: 'Lecture not found' });
    if (lecture.courseId.educatorId.toString() !== user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    lecture.isLive = false;
    lecture.liveRoomId = null;
    await lecture.save();

    // Emit to room via Socket.io if integrated
    res.json({ message: 'Live session ended' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Report screenshot/screen recording violation
export const reportViolation = async (req, res) => {
  try {
    const { lectureId, violationType } = req.body; // violationType: 'screenshot', 'screen_recording', etc.
    const user = req.user;

    // Log the violation in the lecture or user record
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) return res.status(404).json({ message: 'Lecture not found' });

    // Add violation to lecture's violation log
    if (!lecture.violations) lecture.violations = [];
    lecture.violations.push({
      userId: user.id,
      violationType,
      timestamp: new Date(),
      ipAddress: req.ip || req.connection.remoteAddress
    });
    await lecture.save();

    // Update user's violation history and force logout
    const violatingUser = await User.findById(user.id);
    if (violatingUser) {
      if (!violatingUser.violations) violatingUser.violations = [];
      violatingUser.violations.push({
        lectureId,
        violationType,
        timestamp: new Date()
      });

      // Immediately mark user for forced logout. This will cause auth
      // middleware to reject subsequent requests with 401 and the
      // frontend should handle that by redirecting/logging out the user.
      violatingUser.forceLogout = true;
      // Optionally set a duration. Leave forceLogoutUntil null to require
      // manual unblocking by an admin.
      violatingUser.forceLogoutUntil = null;

      await violatingUser.save();
    }

    // Emit warning to the room via Socket.io (if integrated)
    // This would require passing io instance to controller or using a global
    // For now, just log and respond

    res.json({ message: 'Violation reported and logged' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get violation logs for educator
export const getViolationLogs = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const user = req.user;

    const lecture = await Lecture.findById(lectureId).populate('courseId');
    if (!lecture) return res.status(404).json({ message: 'Lecture not found' });
    if (lecture.courseId.educatorId.toString() !== user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json({ violations: lecture.violations || [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
