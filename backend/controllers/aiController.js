import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import Course from "../models/courseModel.js";
dotenv.config();

let genAI = null;
if (process.env.GOOGLE_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
}

// Enhanced fallback responses with course-specific information
const courseDatabase = {
  ai: {
    name: "Artificial Intelligence",
    category: "AI/ML",
    level: "Beginner",
    price: 27000,
    description: "Learn AI fundamentals, machine learning algorithms, neural networks, and practical applications",
    features: ["Machine Learning Basics", "Neural Networks", "Computer Vision", "Natural Language Processing"]
  },
  'web development': {
    name: "Java Full Stack Development",
    category: "Web Development",
    level: "Beginner",
    price: 18000,
    description: "Complete web development course covering frontend and backend technologies",
    features: ["HTML/CSS/JavaScript", "React", "Node.js", "Database Design"]
  },
  'data science': {
    name: "Data Science",
    category: "Data Science",
    level: "Beginner",
    price: 22000,
    description: "Master data analysis, visualization, and machine learning for data-driven decisions",
    features: ["Python Programming", "Data Analysis", "Machine Learning", "Data Visualization"]
  },
  'cybersecurity': {
    name: "Cybersecurity",
    category: "Ethical Hacking",
    level: "Beginner",
    price: 19000,
    description: "Learn ethical hacking, network security, and cyber defense strategies",
    features: ["Network Security", "Ethical Hacking", "Cryptography", "Risk Assessment"]
  },
  'mobile app': {
    name: "Mobile App Development",
    category: "App Development",
    level: "Beginner",
    price: 25000,
    description: "Build native and cross-platform mobile applications",
    features: ["React Native", "Flutter", "iOS Development", "Android Development"]
  },
  'ui/ux': {
    name: "UI/UX Designer",
    category: "UI UX Designing",
    level: "Beginner",
    price: 25000,
    description: "Design beautiful and user-friendly interfaces and experiences",
    features: ["User Research", "Wireframing", "Prototyping", "Design Systems"]
  }
};

let lastResponse = null; // Prevent immediate repetition

function getFallbackResponse(message) {
  const lowerMessage = message.toLowerCase().trim();

  // Handle requests for all courses
  if (lowerMessage.includes('all courses') || lowerMessage.includes('list courses') || (lowerMessage.includes('courses') && !lowerMessage.includes('what') && !lowerMessage.includes('which'))) {
    const courseList = Object.values(courseDatabase).map(course =>
      `🎓 **${course.name}**\n` +
      `📚 Category: ${course.category} | 🎯 Level: ${course.level} | 💰 Price: ₹${course.price.toLocaleString()}\n` +
      `📖 ${course.description}\n` +
      `✨ Features: ${course.features.join(', ')}\n`
    ).join('\n\n');

    const response = `📚 **All Available Courses at SkillSphere**\n\n${courseList}\n\n🚀 Ready to enroll? Visit our platform to start learning!`;
    return response !== lastResponse ? response : getGeneralHelp();
  }

  // Check for course-specific queries
  for (const [key, course] of Object.entries(courseDatabase)) {
    if (lowerMessage.includes(key) || lowerMessage.includes(course.category.toLowerCase())) {
      const response = `🎓 **${course.name}**\n\n` +
        `📚 **Category:** ${course.category}\n` +
        `🎯 **Level:** ${course.level}\n` +
        `💰 **Price:** ₹${course.price.toLocaleString()}\n\n` +
        `📖 **Description:** ${course.description}\n\n` +
        `✨ **What you'll learn:**\n${course.features.map(f => `• ${f}`).join('\n')}\n\n` +
        `Ready to start your learning journey? You can enroll directly through our platform!`;

      return response !== lastResponse ? response : getGeneralHelp();
    }
  }

  // Handle website-specific queries
  if (lowerMessage.includes('website') || lowerMessage.includes('skillsphere') || lowerMessage.includes('platform') || lowerMessage.includes('about') || lowerMessage.includes('features') || lowerMessage.includes('what is') || lowerMessage.includes('site')) {
    const websiteResponse = "🌟 **Welcome to SkillSphere!**\n\n" +
      "SkillSphere is a comprehensive Learning Management System (LMS) designed to help you advance your career through high-quality online courses.\n\n" +
      "🏆 **Key Features:**\n\n" +
      "📚 **Diverse Course Catalog**\n" +
      "• AI & Machine Learning\n" +
      "• Full Stack Web Development\n" +
      "• Data Science & Analytics\n" +
      "• Cybersecurity & Ethical Hacking\n" +
      "• Mobile App Development\n" +
      "• UI/UX Design\n\n" +
      "🤖 **AI-Powered Search**\n" +
      "Find courses instantly using our intelligent AI search feature.\n\n" +
      "📹 **Live Streaming**\n" +
      "Join interactive live sessions with instructors and fellow learners.\n\n" +
      "💬 **Smart Chatbot**\n" +
      "Get instant help and course recommendations through our AI assistant.\n\n" +
      "👨‍🏫 **Dual Role System**\n" +
      "• Students: Enroll, learn, and track progress\n" +
      "• Educators: Create and manage courses, engage with students\n\n" +
      "🎯 **User Experience**\n" +
      "• Responsive design for all devices\n" +
      "• Secure authentication\n" +
      "• Wishlist and enrollment management\n" +
      "• Review and rating system\n\n" +
      "🚀 **Start Your Learning Journey Today!**\n" +
      "Explore courses, enhance your skills, and build your future with SkillSphere.";

    return websiteResponse !== lastResponse ? websiteResponse : "SkillSphere is your gateway to skill development!";
  }

  // Handle common queries
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey') || lowerMessage.length < 3) {
    const greetings = [
      "👋 Hello! I'm your learning assistant. What would you like to know about our courses?",
      "Hi there! Ready to explore our course catalog? What interests you?",
      "Welcome! I'm here to help you find the perfect course. What are you interested in learning?"
    ];
    return getRandomResponse(greetings);
  }

  if (lowerMessage.includes('help') || lowerMessage.includes('assist') || lowerMessage.includes('support')) {
    return getGeneralHelp();
  }

  if (lowerMessage.includes('course') || lowerMessage.includes('learn') || lowerMessage.includes('study')) {
    const courseResponses = [
      "📚 **Available Course Categories:**\n\n" +
      "• 🤖 Artificial Intelligence & Machine Learning\n" +
      "• 💻 Web Development (Full Stack)\n" +
      "• 📊 Data Science & Analytics\n" +
      "• 🔒 Cybersecurity & Ethical Hacking\n" +
      "• 📱 Mobile App Development\n" +
      "• 🎨 UI/UX Design\n\n" +
      "Which area interests you most?",

      "🎯 **Popular Learning Paths:**\n\n" +
      "🔥 **Trending:** AI & Machine Learning\n" +
      "💼 **Career-focused:** Full Stack Development\n" +
      "📈 **High-demand:** Data Science\n\n" +
      "Tell me what you'd like to learn!"
    ];
    return getRandomResponse(courseResponses);
  }

  if (lowerMessage.includes('problem') || lowerMessage.includes('issue') || lowerMessage.includes('error') || lowerMessage.includes('technical')) {
    return getTechnicalHelp();
  }

  // Default response with course suggestions
  return getGeneralHelp();
}

function getRandomResponse(responses) {
  const response = responses[Math.floor(Math.random() * responses.length)];
  lastResponse = response;
  return response;
}

function getGeneralHelp() {
  const helpResponse = "🤖 **I can help you with:**\n\n" +
    "📚 **Course Information**\n" +
    "• Browse courses by category\n" +
    "• Get detailed course descriptions\n" +
    "• Learn about pricing and features\n\n" +
    "🎯 **Learning Guidance**\n" +
    "• Course recommendations\n" +
    "• Career path suggestions\n" +
    "• Study tips and resources\n\n" +
    "🛠️ **Technical Support**\n" +
    "• Platform navigation help\n" +
    "• Account and enrollment assistance\n\n" +
    "💬 **What would you like to know?** Try asking about:\n" +
    "• \"AI courses\"\n" +
    "• \"web development\"\n" +
    "• \"data science\"";

  return helpResponse !== lastResponse ? helpResponse : "What specific course or topic are you interested in?";
}

function getTechnicalHelp() {
  const techResponse = "🛠️ **Technical Support:**\n\n" +
    "🔧 **Common Solutions:**\n" +
    "• Refresh the page\n" +
    "• Clear browser cache\n" +
    "• Try a different browser\n" +
    "• Check your internet connection\n\n" +
    "📞 **For persistent issues:**\n" +
    "• Contact our support team\n" +
    "• Check course access permissions\n" +
    "• Verify your account status\n\n" +
    "What specific technical problem are you facing?";

  return techResponse;
}

export const chat = async (req, res) => {
  // Set headers for Server-Sent Events
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders(); // Flush the headers to establish the connection

  try {
    const { message } = req.body;
    if (!message) {
      throw new Error("Message is required");
    }

    // Try Google Gemini first
    if (process.env.GOOGLE_API_KEY) {
      try {
        // Get the generative model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Generate content with streaming
        const result = await model.generateContentStream(message);

        // Process the stream
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          if (chunkText) {
            // Write each chunk as a server-sent event
            res.write(`data: ${JSON.stringify({ reply: chunkText })}\n\n`);
          }
        }
        res.end();
        return;
      } catch (geminiError) {
        console.log("Google Gemini failed, using fallback response:", geminiError.message);
        // Fall through to fallback
      }
    }

    // Fallback: Use simple rule-based responses
    const fallbackReply = getFallbackResponse(message);

    // Send the complete response (fallback doesn't need streaming)
    res.write(`data: ${JSON.stringify({ reply: fallbackReply })}\n\n`);

  } catch (error) {
    console.error("Error in chat function:", error);

    const errorMessage = "I'm having trouble responding right now. Please try again or contact support if the issue persists.";

    // Send error as streaming response
    res.write(`data: ${JSON.stringify({ reply: errorMessage })}\n\n`);
  } finally {
    // End the response stream
    res.end();
  }
};

export const search = async (req, res) => {
  try {
    const { input } = req.body;
    if (!input) {
      return res.status(400).json({ error: "Input is required" });
    }

    // Search for published courses matching the input in title, description, or category
    const courses = await Course.find({
      isPublished: true,
      $or: [
        { title: { $regex: input, $options: 'i' } },
        { description: { $regex: input, $options: 'i' } },
        { category: { $regex: input, $options: 'i' } }
      ]
    }).limit(10).select('_id title category');

    res.status(200).json(courses);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Failed to search courses" });
  }
};
