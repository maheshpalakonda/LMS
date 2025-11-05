import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import { ToastContainer} from 'react-toastify';
import ForgotPassword from './pages/ForgotPassword'
import AuthCallback from './pages/AuthCallback'
import useFetchCurrentUser from './customHooks/useFetchCurrentUser'
import useScreenshotPrevention from './customHooks/useScreenshotPrevention'
import './utils/axiosSetup'
import { useSelector } from 'react-redux'
import Profile from './pages/Profile'
import EditProfile from './pages/EditProfile'
import Dashboard from './pages/admin/Dashboard'
import Courses from './pages/admin/Courses'
import AllCouses from './pages/AllCouses'
import AddCourses from './pages/admin/AddCourses'
import CreateCourse from './pages/admin/CreateCourse'
import CreateLecture from './pages/admin/CreateLecture'
import EditLecture from './pages/admin/EditLecture'
import AdminDashboard from './pages/admin/AdminDashboard'
import UserManagement from './pages/admin/UserManagement'
import SystemSettings from './pages/admin/SystemSettings'
import LiveStream from './components/LiveStream'
import Chatbot from './components/ChatBot'
import { useLocation } from 'react-router-dom'

import getCouseData from './customHooks/getCouseData'
import ViewCourse from './pages/ViewCourse'
import ScrollToTop from './components/ScrollToTop'
import getCreatorCourseData from './customHooks/getCreatorCourseData'
import EnrolledCourse from './pages/EnrolledCourse'
import ViewLecture from './pages/ViewLecture'
import SearchWithAi from './pages/SearchWithAi'
import Wishlist from './pages/Wishlist'
import Notifications from './pages/Notifications'
import getAllReviews from './customHooks/getAllReviews'

//export const serverUrl = "http://localhost:8000"
 export const serverUrl = "http://72.60.219.208:8000"



function App() {

  let {userData} = useSelector(state=>state.user)

   // ADD: read current URL path
  const location = useLocation();

  useFetchCurrentUser()
  useScreenshotPrevention()
  getCouseData()
  getCreatorCourseData()
  getAllReviews()

  // Detect if the current page is a course or lecture page
const isCoursePage =
  location.pathname.startsWith("/viewcourse") ||
  location.pathname.startsWith("/viewlecture");

  return (
    <>
      <ToastContainer />
      <ScrollToTop/>
      <div className="screenshot-overlay"></div>
      <div className="flash-overlay" id="flashOverlay"></div>
      {/* inside App.jsx (bottom part of return) */}
      {userData?.role === "student" && !location.pathname.includes("/viewcourse") && (
      <Chatbot isStudent={true} />
       )}
      <Routes>
        {/* Public homepage always visible */}
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={!userData ? <SignUp/> : <Navigate to={'/'}/>}/>

        {/* Protected routes: only redirect to login if not authenticated */}
        <Route path='/profile' element={userData ? <Profile/> : <Navigate to={'/login'}/>}/>
        <Route path='/allcourses' element={userData ? <AllCouses/> : <Navigate to={'/login'}/>}/>
        <Route path='/viewcourse/:courseId' element={userData ? <ViewCourse/> : <Navigate to={'/login'}/>}/>
        <Route path='/editprofile' element={userData ? <EditProfile/> : <Navigate to={'/login'}/>}/>
        <Route path='/enrolledcourses' element={userData ? <EnrolledCourse/> : <Navigate to={'/login'}/>}/>
        <Route path='/viewlecture/:courseId' element={userData ? <ViewLecture/> : <Navigate to={'/login'}/>}/>
        <Route path='/live/:lectureId' element={userData ? <LiveStream /> : <Navigate to={'/login'}/> }/>
        <Route path='/searchwithai' element={userData ? <SearchWithAi/> : <Navigate to={'/login'}/>}/>
        <Route path='/wishlist' element={userData?.role === 'student' ? <Wishlist/> : <Navigate to={'/login'}/>}/>
        <Route path='/notifications' element={userData ? <Notifications/> : <Navigate to={'/login'}/>}/>

        {/* Educator/admin protected routes */}
        <Route path='/dashboard' element={userData?.role === 'educator' ? <Dashboard/> : <Navigate to={'/login'}/>}/>
        <Route path='/courses' element={userData?.role === 'educator' ? <Courses/> : <Navigate to={'/login'}/>}/>
        <Route path='/addcourses/:courseId' element={userData?.role === 'educator' ? <AddCourses/> : <Navigate to={'/login'}/>}/>
        <Route path='/createcourses' element={userData?.role === 'educator' ? <CreateCourse/> : <Navigate to={'/login'}/>}/>
        <Route path='/createlecture/:courseId' element={userData?.role === 'educator' ? <CreateLecture/> : <Navigate to={'/login'}/>}/>
        <Route path='/editlecture/:courseId/:lectureId' element={userData?.role === 'educator' ? <EditLecture/> : <Navigate to={'/login'}/>}/>

        <Route path='/admin/dashboard' element={userData?.role === 'admin' ? <AdminDashboard /> : <Navigate to={'/login'}/>}/>
        <Route path='/admin/users' element={userData?.role === 'admin' ? <UserManagement /> : <Navigate to={'/login'}/>}/>
        <Route path='/admin/settings' element={userData?.role === 'admin' ? <SystemSettings /> : <Navigate to={'/login'}/>}/>

        {/* Public routes */}
        <Route path='/forgotpassword' element={<ForgotPassword/>}/>
        <Route path='/auth/callback' element={<AuthCallback/>}/>
      </Routes>
    </>
  )
}

export default App






