import React, { useState } from "react";
import axios from "../utils/axiosSetup"; // Corrected path
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

const VideoUpload = ({ courseId }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title || !courseId) {
      toast.error("Please provide a title, a video file, and ensure a course is selected.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("video", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("courseId", courseId);

    try {
      const { data } = await axios.post("/api/videos/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      toast.success(data.message);
      // Optionally, you can trigger a refresh or update the UI
      setTitle("");
      setDescription("");
      setFile(null);
      e.target.reset(); // Reset the form
    } catch (error) {
      toast.error(error.response?.data?.message || "Video upload failed.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="video-upload-form p-4 border-t mt-6">
      <h3 className="text-lg font-medium mb-4">Upload New Video</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Video Title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-black focus:outline-none" />
        <textarea placeholder="Video Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-black focus:outline-none h-24 resize-none" />
        <input type="file" accept="video/*" onChange={handleFileChange} required className="w-full border border-gray-300 rounded-md p-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-gray-700 file:text-white hover:file:bg-gray-500" />
        <button type="submit" disabled={loading} className="w-full bg-black text-white py-3 rounded-md text-sm font-medium hover:bg-gray-700 transition disabled:bg-gray-400">
          {loading ? <ClipLoader size={20} color="white" /> : "Upload Video"}
        </button>
      </form>
    </div>
  );
};

export default VideoUpload;