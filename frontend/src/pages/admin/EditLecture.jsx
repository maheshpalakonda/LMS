import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { FaArrowLeft } from "react-icons/fa"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { serverUrl } from '../../App'
import { setLectureData } from '../../redux/lectureSlice'
import { toast } from 'react-toastify'
import { ClipLoader } from 'react-spinners'
function EditLecture() {
    const { courseId, lectureId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { lectureData } = useSelector(state => state.lecture);
    const [selectedLecture, setSelectedLecture] = useState(null);

    const [loading, setLoading] = useState(false);
    const [loading1, setLoading1] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);

    const [lectureTitle, setLectureTitle] = useState('');
    const [videoUrl, setVideoUrl] = useState(null);
    const [isPreviewFree, setIsPreviewFree] = useState(false);

    useEffect(() => {
        const lecture = lectureData.find(lec => lec._id === lectureId);
        if (lecture) {
            setSelectedLecture(lecture);
            setLectureTitle(lecture.lectureTitle);
            setIsPreviewFree(lecture.isPreviewFree || false);
            setPageLoading(false);
        } else {
            // If lecture data is not in redux, fetch it.
            // This assumes you have an endpoint to get a single course with its lectures.
            axios.get(`/api/courses/${courseId}`, { withCredentials: true })
                .then(({ data }) => {
                    dispatch(setLectureData(data.course.lectures));
                })
                .catch(() => toast.error("Failed to fetch lecture data."))
                .finally(() => setPageLoading(false));
        }
    }, [lectureId, lectureData, courseId, dispatch]);
    

    const editLecture = async () => {
      if (!lectureTitle) {
        toast.error("Lecture title cannot be empty.");
        return;
      }

      setLoading(true)
      const formData = new FormData();

      // Only append fields that have a value or have changed
      formData.append("lectureTitle", lectureTitle);
      formData.append("isPreviewFree", isPreviewFree);
      if (videoUrl) {
        formData.append("videoUrl", videoUrl);
      }

      try {
        const result = await axios.post(serverUrl + `/api/course/editlecture/${lectureId}` , formData , {withCredentials:true})
        
        // Correctly update the lecture in the Redux store
        const updatedLectures = lectureData.map(lec => 
            lec._id === lectureId ? result.data : lec
        );
        dispatch(setLectureData(updatedLectures));

        toast.success("Lecture Updated")
        navigate("/courses")
        setLoading(false)
      } catch (error) {
        console.log(error)
        toast.error(error.response.data.message)
        setLoading(false)
      }
    }

    const removeLecture = async () => {
      setLoading1(true)
      try {
        const result = await axios.delete(serverUrl + `/api/course/removelecture/${lectureId}` , {withCredentials:true})
        toast.success("Lecture Removed")
       navigate(`/createlecture/${courseId}`)
        setLoading1(false)
      } catch (error) {
        console.log(error)
        toast.error("Lecture remove error")
        setLoading1(false)
      }
      
    }

    if (pageLoading) {
        return <div className="min-h-screen flex items-center justify-center"><ClipLoader size={50} color="black" /></div>;
    }

    if (!selectedLecture) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Lecture not found</h2>
                    <p className="text-gray-600 mb-6">It might have been deleted or the link is incorrect.</p>
                    <button onClick={() => navigate(`/createlecture/${courseId}`)} className="px-4 py-2 bg-black text-white rounded-md">Go Back</button>
                </div>
            </div>
        );
    }

    return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-6 space-y-6">

        {/* Header Inside Box */}
        <div className="flex items-center gap-2 mb-2">
          <FaArrowLeft className="text-gray-600 cursor-pointer" onClick={()=>navigate(`/createlecture/${courseId}`)} />
          <h2 className="text-xl font-semibold text-gray-800">Update Your Lecture</h2>
        </div>

        {/* Instruction */}
        <div>
         
          <button className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all text-sm" disabled={loading1} onClick={removeLecture}>
            {loading1?<ClipLoader size={30} color='white'/>:"Remove Lecture"}
          </button>
        </div>

        {/* Input Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[black]focus:outline-none"
              placeholder={selectedLecture?.lectureTitle || "Lecture Title"}
              onChange={(e)=>setLectureTitle(e.target.value)}
              value={lectureTitle}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Video *</label>
            <input
              type="file"
              required
              accept='video/*'
              className="w-full border border-gray-300 rounded-md p-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-gray-700 file:text-[white] hover:file:bg-gray-500"
              onChange={(e)=>setVideoUrl(e.target.files[0])}
            />
          </div>

          {/* Toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              
              className="accent-[black] h-4 w-4"
              
              onChange={() => setIsPreviewFree(prev=>!prev)}
            />
            <label htmlFor="isFree" className="text-sm text-gray-700">Is this video FREE</label>
          </div>
        </div>
         <div>
          {loading ?<p>Uploading video... Please wait.</p>:""}
         </div>
        {/* Submit Button */}
        <div className="pt-4">
          <button className="w-full bg-black text-white py-3 rounded-md text-sm font-medium hover:bg-gray-700 transition" disabled={loading} onClick={editLecture}>
            {loading?<ClipLoader size={30} color='white'/> :"Update Lecture"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditLecture
