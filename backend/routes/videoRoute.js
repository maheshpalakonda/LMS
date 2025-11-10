import express from 'express';
const router = express.Router();
import { uploadVideo, getVideosByCourseId } from '../controllers/videoController.js';
import isAuth from '../middlewares/isAuth.js';
import isEducator from '../middlewares/isEducator.js';
import upload from '../middlewares/multer.js';



// Route for uploading a video (protected by isAuth and isEducator middleware)
router.post(
  '/upload',
  isAuth,
  isEducator,
  upload.single('video'), // 'video' should match the field name in the form
  uploadVideo
);

// Route for getting videos by course ID
router.get('/:courseId', getVideosByCourseId);

// Add other video routes here (update, delete, etc.)

export default router;
