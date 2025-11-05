import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpeg";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-black text-gray-300 py-10 px-6">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Header Title */}
        <h2 className="text-xl font-bold text-white text-center lg:text-left">
          Explore top skills and certifications
        </h2>

        {/* ======= TOP GRID ======= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

          {/* In-demand Careers */}
          <div>
            <h3 className="text-white font-semibold mb-3">In-demand Careers</h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer">Data Scientist</li>
              <li className="hover:text-white cursor-pointer">Full Stack Web Developer</li>
              <li className="hover:text-white cursor-pointer">Cloud computing</li>
              <li className="hover:text-white cursor-pointer">Mobile App Development</li>
              <li className="hover:text-white cursor-pointer">devops</li>
              <li className="hover:text-white cursor-pointer">Data analytics</li>
            </ul>
          </div>

          {/* Web Development */}
          <div>
            <h3 className="text-white font-semibold mb-3">Web Development</h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer">Web Development</li>
              <li className="hover:text-white cursor-pointer">JavaScript</li>
              <li className="hover:text-white cursor-pointer">React JS</li>
              <li className="hover:text-white cursor-pointer">Angular</li>
              <li className="hover:text-white cursor-pointer">Java</li>
            </ul>
          </div>

          {/* Data Science */}
          <div>
            <h3 className="text-white font-semibold mb-3">Data Science</h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer">Data Science</li>
              <li className="hover:text-white cursor-pointer">Python</li>
              <li className="hover:text-white cursor-pointer">Machine Learning</li>
              <li className="hover:text-white cursor-pointer">ChatGPT</li>
              <li className="hover:text-white cursor-pointer">ethical Hacking</li>
            </ul>
          </div>

          {/* Communication */}
          <div>
            <h3 className="text-white font-semibold mb-3">Communication</h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer">Communication Skills</li>
              <li className="hover:text-white cursor-pointer">Presentation Skills</li>
              <li className="hover:text-white cursor-pointer">Public Speaking</li>
              <li className="hover:text-white cursor-pointer">Writing</li>
              <li className="hover:text-white cursor-pointer">PowerPoint</li>
            </ul>
          </div>
        </div>

        {/* ======= BOTTOM GRID ======= */}
        <div className="border-t border-gray-700 pt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-10">

          {/* About */}
          <div>
            <h3 className="text-white font-semibold mb-3">About</h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer">About us</li>
              <li className="hover:text-white cursor-pointer">Careers</li>
              <li className="hover:text-white cursor-pointer">Contact us</li>
            </ul>
          </div>

          {/* Legal & Accessibility */}
          <div>
            <h3 className="text-white font-semibold mb-3">Legal & Accessibility</h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer">Accessibility statement</li>
              <li className="hover:text-white cursor-pointer">Privacy policy</li>
              <li className="hover:text-white cursor-pointer">Sitemap</li>
            </ul>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="border-t border-gray-700 mt-10 pt-5 text-sm text-center text-gray-500">
          © {new Date().getFullYear()} LearnAI. All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;
