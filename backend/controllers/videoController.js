import Video from '../models/videoModel.js';
import { uploadFileToS3 } from '../configs/awsS3.js'; // Import the correct function
import Course from '../models/courseModel.js';



// Function to upload video to S3 and save video details to database
export const uploadVideo = async (req, res) => {

  try {
    const { title, description, courseId } = req.body;
    const { file } = req; // Assuming you are using multer middleware for file upload
    const uploaderId = req.user._id; // Assuming you have user information in the request

    if (!file) {
      return res.status(400).json({ message: 'Please upload a video file' });
    }

    // Upload to S3
    const videoUrl = await uploadFileToS3(file.path, file.filename);

    if (!videoUrl) {
      return res.status(500).json({ message: 'Failed to upload video to S3' });
    }

    // Save video details to database
    const newVideo = new Video({
      title,
      description,
      videoUrl,
      courseId,
      uploaderId,
      level: 'Beginner', // Set a default level for the new video/lecture
    });


    await newVideo.save();

    // Also, add the video to the course's video list
    const course = await Course.findById(courseId);
    if (course) {
      course.videos.push(newVideo._id);
      await course.save();
    }

    res.status(201).json({ message: 'Video uploaded successfully', video: newVideo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to upload video' });
  }
};


// Function to get all videos for a specific course
export const getVideosByCourseId = async (req, res) => {

  try {
    const { courseId } = req.params;
    const videos = await Video.find({ courseId });
    res.status(200).json({ videos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get videos' });
  }
};

// Other video controller functions (update, delete, etc.) can be added here
