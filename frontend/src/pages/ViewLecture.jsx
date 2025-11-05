import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { FaPlayCircle } from 'react-icons/fa';
import { FaArrowLeftLong } from "react-icons/fa6";
import axios from 'axios';
import { serverUrl } from '../App';
import useScreenshotPrevention from '../customHooks/useScreenshotPrevention';

function ViewLecture() {
  const { courseId } = useParams();
  useScreenshotPrevention(courseId);

  const { courseData } = useSelector((state) => state.course);
  const { userData } = useSelector((state) => state.user);

  const selectedCourse = courseData?.find((course) => course._id === courseId);

  const [selectedLecture, setSelectedLecture] = useState(
    selectedCourse?.lectures?.[0] || null
  );
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [notes, setNotes] = useState('');

  const navigate = useNavigate();

  // ✅ Check if student is enrolled
  useEffect(() => {
    const checkEnrollment = async () => {
      if (!userData || !courseId) return;

      try {
        const res = await axios.get(
          `${serverUrl}/api/courses/enrolled/${courseId}`,
          { withCredentials: true }
        );
        setIsEnrolled(res.data.enrolled);
      } catch {
        setIsEnrolled(false);
      }
    };

    checkEnrollment();
  }, [userData, courseId]);

  // ✅ Load notes from backend
  const loadNotesFromDB = async () => {
    try {
      const res = await axios.post(
        `${serverUrl}/api/notes/get`,
        { courseId, lectureId: selectedLecture._id },
        { withCredentials: true }
      );

      if (res.data.success) {
        setNotes(res.data.notes || "");
      }
    } catch (err) {
      console.log("Error loading notes");
    }
  };

  // ✅ Save notes to backend
  const saveNotesToDB = async (newNotes) => {
    try {
      await axios.post(
        `${serverUrl}/api/notes/save`,
        {
          courseId,
          lectureId: selectedLecture._id,
          notes: newNotes,
        },
        { withCredentials: true }
      );
    } catch (err) {
      console.log("Note save failed");
    }
  };

  // ✅ Load notes when lecture changes
  useEffect(() => {
    if (!selectedLecture) return;
    loadNotesFromDB();
  }, [selectedLecture]);

  // ✅ Auto-save notes (backend + localstorage)
  const handleNotesChange = (e) => {
    const newNotes = e.target.value;
    setNotes(newNotes);

    // local backup
    const key = `${courseId}-${selectedLecture._id}`;
    localStorage.setItem(key, newNotes);

    // backend save
    saveNotesToDB(newNotes);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col md:flex-row gap-6">

      <div className="w-full md:w-2/3 bg-white rounded-2xl shadow-md p-6 border border-gray-200">

        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-[20px] text-gray-800">
            <FaArrowLeftLong
              className="text-black w-[22px] h-[22px] cursor-pointer"
              onClick={() => navigate("/")}
            />
            {selectedCourse?.title}
          </h1>
        </div>

        <div className="aspect-video bg-black rounded-xl overflow-hidden mb-4 border border-gray-300">
          {selectedLecture?.videoUrl ? (
            <video
              src={selectedLecture.videoUrl}
              controls
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
              onContextMenu={(e) => e.preventDefault()}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-white">
              Select a lecture to start watching
            </div>
          )}
        </div>

        {/* ✅ NOTEPAD always under video */}
        {isEnrolled && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">📝 Notes</h3>
            <textarea
              value={notes}
              onChange={handleNotesChange}
              placeholder="Write your notes here..."
              className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <p className="text-xs text-gray-500">Notes auto-saved ✅</p>
          </div>
        )}

        <h2 className="text-lg font-semibold text-gray-800">
          {selectedLecture?.lectureTitle}
        </h2>
      </div>

      {/* Right panel */}
      <div className="w-full md:w-1/3 bg-white rounded-2xl shadow-md p-6 border border-gray-200 h-fit">
        <h2 className="text-xl font-bold mb-4 text-gray-800">All Lectures</h2>

        <div className="flex flex-col gap-3 mb-6">
          {selectedCourse?.lectures?.map((lecture, index) => (
            <button
              key={index}
              onClick={() => setSelectedLecture(lecture)}
              className={`flex items-center justify-between p-3 rounded-lg border transition text-left ${
                selectedLecture?._id === lecture._id
                  ? 'bg-gray-200 border-gray-500'
                  : 'hover:bg-gray-50 border-gray-300'
              }`}
            >
              <h4 className="text-sm font-semibold text-gray-800">
                {lecture.lectureTitle}
              </h4>
              <FaPlayCircle className="text-black text-xl" />
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}

export default ViewLecture;
