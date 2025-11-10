import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeftLong, FaCreditCard } from "react-icons/fa6";
import axios from 'axios'
import { toast } from 'react-toastify'
import { serverUrl } from '../App'

function Profile() {
  let {userData} = useSelector(state=>state.user)
  let navigate = useNavigate()
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  const handlePayment = async () => {
    if (isProcessingPayment) return
    setIsProcessingPayment(true)
    try {
      // Create order
      const orderData = await axios.post(serverUrl + "/api/payment/create-order", {
        courseId: userData.enrolledCourses.length > 0 ? userData.enrolledCourses[0] : null,
        userId: userData._id
      }, { withCredentials: true })

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.data.amount,
        currency: "INR",
        name: "Virtual Courses",
        description: "Course Enrollment Payment",
        order_id: orderData.data.id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(serverUrl + "/api/payment/verify-payment", {
              ...response,
              courseId: userData.enrolledCourses.length > 0 ? userData.enrolledCourses[0] : null,
              userId: userData._id
            }, { withCredentials: true })
            toast.success(verifyRes.data.message)
          } catch (verifyError) {
            toast.error("Payment verification failed.")
            console.error("Verification Error:", verifyError)
          }
        },
        modal: {
          ondismiss: () => setIsProcessingPayment(false)
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      toast.error("Something went wrong while processing payment.")
      console.error("Payment Error:", err)
      setIsProcessingPayment(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10 flex items-center justify-center ">
      
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-xl w-full relative">
        <FaArrowLeftLong  className='absolute top-[8%] left-[5%] w-[22px] h-[22px] cursor-pointer' onClick={()=>navigate("/")}/>
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center">
          {userData.photoUrl ? <img
            src={userData?.photoUrl}
            alt=""
            className="w-24 h-24 rounded-full object-cover border-4 border-[black]"
          /> : <div className='w-24 h-24 rounded-full text-white flex items-center justify-center text-[30px] border-2 bg-black  border-white cursor-pointer'>
         {userData?.name.slice(0,1).toUpperCase()}
          </div>}
          <h2 className="text-2xl font-bold mt-4 text-gray-800">{userData.name}</h2>
          <p className="text-sm text-gray-500">{userData.role}</p>

        </div>

        {/* Profile Info */}
        <div className="mt-6 space-y-4">
          <div className="text-sm">
            <span className="font-semibold text-gray-700">Email: </span>
            <span>{userData.email}</span>
          </div>

          <div className="text-sm">
            <span className="font-semibold text-gray-700">Bio: </span>
            <span>{userData.description}</span>
          </div>

          

          <div className="text-sm">
            <span className="font-semibold text-gray-700">Enrolled Courses: </span>
            <span>{userData.enrolledCourses.length}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-center gap-4">
          <button className="px-5 py-2 rounded bg-[black] text-white active:bg-[#4b4b4b] cursor-pointer transition" onClick={()=>navigate("/editprofile")}>
            Edit Profile
          </button>
          {userData.role === "student" && (
            <button
              className="flex items-center gap-2 px-5 py-2 rounded bg-green-600 text-white active:bg-green-700 cursor-pointer transition"
              onClick={handlePayment}
              disabled={isProcessingPayment}
            >
              <FaCreditCard className="w-5 h-5" />
              {isProcessingPayment ? "Processing..." : "Make Payment"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
