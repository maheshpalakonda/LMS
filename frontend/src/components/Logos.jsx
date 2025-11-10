import React, { useState } from 'react'
import { MdCastForEducation } from "react-icons/md";
import { SiOpenaccess } from "react-icons/si";
import { FaSackDollar } from "react-icons/fa6";
import { BiSupport } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
function Logos() {
  const [activeTab, setActiveTab] = useState(null);
  const [showModal, setShowModal] = useState(false);


  return (
    <div className='w-[100vw] min-h-[90px]  flex items-center justify-center flex-wrap gap-4 md:mb-[50px] '>
        <div className='flex items-center justify-center gap-2  px-5 py-3   rounded-3xl bg-gray-200 cursor-pointer' onClick={() => { setActiveTab('courses'); setShowModal(true); }}>
            <MdCastForEducation className='w-[35px] h-[35px] fill-[#03394b]' />
            <span className='text-[#03394b]'>50+ Courses</span>

        </div>

        <div className='flex items-center justify-center gap-2  px-5 py-3   rounded-3xl bg-gray-200 cursor-pointer' onClick={() => { setActiveTab('access'); setShowModal(true); }}>
            <SiOpenaccess className='w-[30px] h-[30px] fill-[#03394b]' />
            <span className='text-[#03394b]'>Lifetime Access</span>
        </div>

        <div className='flex items-center justify-center gap-2  px-5 py-3   rounded-3xl bg-gray-200 cursor-pointer' onClick={() => { setActiveTab('value'); setShowModal(true); }}>
            <FaSackDollar className='w-[30px] h-[30px] fill-[#03394b]' />
            <span className='text-[#03394b]'>Value For Money</span>
        </div>

        <div className='flex items-center justify-center gap-2  px-5 py-3  rounded-3xl bg-gray-200 cursor-pointer' onClick={() => { setActiveTab('support'); setShowModal(true); }}>
            <BiSupport className='w-[35px] h-[35px] fill-[#03394b]' />
            <span className='text-[#03394b]'>Lifetime Support</span>
        </div>

        <div className='flex items-center justify-center gap-2  px-5 py-3   rounded-3xl bg-gray-200 cursor-pointer' onClick={() => { setActiveTab('community'); setShowModal(true); }}>
            <FaUsers className='w-[35px] h-[35px] fill-[#03394b]' />
            <span className='text-[#03394b]'>Community Support</span>
        </div>


      


      {showModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='w-[90%] max-w-[800px] h-[80%] bg-white rounded-lg shadow-lg overflow-y-auto p-6 relative'>
            <button
              className='absolute top-4 right-4 text-gray-500 hover:text-gray-700'
              onClick={() => setShowModal(false)}
            >
              <IoClose className='w-6 h-6' />
            </button>
            {activeTab === 'courses' && (
              <div>
                <h3 className='text-2xl font-bold mb-4 text-center'>50+ Courses</h3>
                <p className='text-lg leading-relaxed'>Dive into our comprehensive collection of over 50 expertly crafted online courses spanning cutting-edge technology, artificial intelligence, data science, web development, cybersecurity, business strategies, digital marketing, cloud computing, blockchain, and emerging fields like quantum computing and augmented reality. Each course is meticulously designed by industry-leading instructors with real-world experience from top companies like Google, Microsoft, and Amazon, featuring interactive modules, hands-on projects, real-world case studies, quizzes, coding challenges, and industry-recognized certifications. Our curriculum is regularly updated to reflect the latest trends and technologies, ensuring you stay ahead in a rapidly evolving job market. Whether you're a beginner looking to start a new career or a professional aiming to upskill, our courses provide the knowledge and practical skills demanded by top employers worldwide, with flexible learning paths tailored to your goals and pace.</p>
              </div>
            )}

            {activeTab === 'access' && (
              <div>
                <h3 className='text-2xl font-bold mb-4 text-center'>Lifetime Access</h3>
                <p className='text-lg leading-relaxed'>Unlock unparalleled flexibility with lifetime access to every course you enroll in. No deadlines, no expirations—just unrestricted learning at your own pace. Revisit complex topics, refresh your knowledge, or explore advanced modules as your career evolves. Our platform ensures all course materials, updates, and resources remain available forever, providing continuous value and adaptability in a rapidly changing professional landscape. This means you can access new content additions, updated lectures, supplementary materials, and community discussions indefinitely. Perfect for lifelong learners, our lifetime access model allows you to build a personal knowledge library that grows with you, supporting career transitions, skill refresher courses, and staying current with industry advancements without additional costs.</p>
              </div>
            )}

            {activeTab === 'value' && (
              <div>
                <h3 className='text-2xl font-bold mb-4 text-center'>Value For Money</h3>
                <p className='text-lg leading-relaxed'>Experience unmatched value with our competitively priced courses that deliver premium education without compromise. Each course includes high-definition videos, downloadable resources, interactive assignments, personalized feedback from certified instructors, and access to exclusive tools and software. With lifetime access and ongoing updates, you're not just buying a course—you're investing in a transformative learning experience that pays dividends in career advancement, skill mastery, and professional opportunities, far exceeding the cost of traditional education. Our pricing model offers significant savings compared to university degrees or bootcamps, with flexible payment options, money-back guarantees, and the potential for substantial salary increases post-completion. We believe in democratizing education, making world-class learning accessible to everyone, regardless of location or background, ensuring maximum return on your investment through practical, job-ready skills.</p>
              </div>
            )}

            {activeTab === 'support' && (
              <div>
                <h3 className='text-2xl font-bold mb-4 text-center'>Lifetime Support</h3>
                <p className='text-lg leading-relaxed'>Benefit from our commitment to your success with lifetime support that goes beyond the course. Our dedicated support team, comprised of technical experts, career advisors, and subject matter specialists, is available 24/7 via multiple channels including live chat, email, phone, and community forums to assist with course-related queries, technical troubleshooting, and personalized career guidance. Access exclusive webinars, live Q&A sessions with instructors, one-on-one mentoring, resume reviews, interview preparation, and a comprehensive knowledge base of resources including video tutorials, FAQs, and troubleshooting guides. We provide ongoing assistance even after course completion, helping you apply your skills in real-world scenarios, navigate career transitions, and stay updated with industry best practices, fostering a supportive environment that empowers continuous growth, professional development, and long-term success in your chosen field.</p>
              </div>
            )}

            {activeTab === 'community' && (
              <div>
                <h3 className='text-2xl font-bold mb-4 text-center'>Community Support</h3>
                <p className='text-lg leading-relaxed'>Connect with a thriving global community of over 500,000 passionate learners, industry professionals, entrepreneurs, and innovators from 150+ countries through our exclusive forums, live events, and networking opportunities. Share insights, collaborate on open-source projects, participate in mentorship programs with experienced professionals, attend virtual meetups, hackathons, and industry conferences. Our community-driven approach features specialized groups for different technologies, career levels, and interests, providing peer-to-peer learning, code reviews, project feedback, and collaborative problem-solving. This vibrant ecosystem not only enhances your learning experience but also opens doors to collaborations, job opportunities, freelance gigs, startup partnerships, and lifelong friendships. Join study groups, participate in challenges, showcase your projects in our portfolio section, and get discovered by potential employers through our talent network, creating a supportive environment where knowledge is shared, skills are honed, careers are launched, and innovations are born.</p>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  )
}


export default Logos
