import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// ✅ Initialize Gemini AI safely
let genAI = null;
if (process.env.GOOGLE_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  console.log("✅ Google Generative AI initialized");
} 
else {
  console.warn("Running in offline mode (Gemini AI disabled).");
}

// ✅ Expanded offline knowledge base
const offlineKnowledge = [
  // JavaScript / Node.js / Web
  { question: "What is Node.js?", answer: "Node.js is a JavaScript runtime built on Chrome's V8 engine that allows you to run JS on the server side." },
  { question: "What is React?", answer: "React is a JavaScript library for building user interfaces, maintained by Facebook." },
  { question: "What is TypeScript?", answer: "TypeScript is a superset of JavaScript that adds static types for safer and more maintainable code." },

  // Python
  { question: "What is Python?", answer: "Python is a high-level, interpreted programming language known for its readability and versatility in web development, data science, and automation." },
  { question: "What is a Python list?", answer: "A list in Python is an ordered collection of items which can be of mixed types. Lists are mutable and use square brackets [] to define them." },

  // Java
  { question: "What is Java?", answer: "Java is a high-level, object-oriented programming language designed to be platform-independent, running on the JVM (Java Virtual Machine)." },
  { question: "What is a Java class?", answer: "A class in Java is a blueprint for creating objects. It defines properties (fields) and behaviors (methods) that the objects will have." },

  // C++
  { question: "What is C++?", answer: "C++ is a general-purpose programming language that extends C with object-oriented features like classes and inheritance." },
  { question: "What is a pointer in C++?", answer: "A pointer in C++ is a variable that stores the memory address of another variable, allowing direct memory manipulation." },

  // Databases
  { question: "What is SQL?", answer: "SQL (Structured Query Language) is a language used to manage and query relational databases." },
  { question: "What is a primary key?", answer: "A primary key is a unique identifier for a record in a database table." },

  // Misc / Tech
  { question: "What is Git?", answer: "Git is a distributed version control system used to track changes in code and collaborate with other developers." },
  { question: "What is Docker?", answer: "Docker is a platform for creating, deploying, and running applications in lightweight containers." },

  // JavaScript / Node.js / Web
  { question: "What is Node.js?", answer: "Node.js is a JavaScript runtime built on Chrome's V8 engine that allows you to run JS on the server side." },
  { question: "How to install Node.js?", answer: "You can install Node.js from the official website nodejs.org. Download the LTS version for your OS and run the installer, or use a package manager like nvm (Node Version Manager)." },
  { question: "What is React?", answer: "React is a JavaScript library for building user interfaces, maintained by Facebook." },
  { question: "How to install React?", answer: "You can create a new React project using Create React App: `npx create-react-app my-app`. Then navigate into your project folder and run `npm start` to begin development." },
  { question: "What is TypeScript?", answer: "TypeScript is a superset of JavaScript that adds static types for safer and more maintainable code." },
  { question: "How to install TypeScript?", answer: "Install TypeScript globally with `npm install -g typescript`, or add it to your project with `npm install typescript --save-dev`. Then compile TS files with `tsc`." },

  // Python
  { question: "What is Python?", answer: "Python is a high-level, interpreted programming language known for its readability and versatility in web development, data science, and automation." },
  { question: "How to install Python?", answer: "Download Python from python.org and run the installer. Make sure to check 'Add Python to PATH'. On Linux/macOS, you can use `sudo apt install python3` or `brew install python3`." },
  { question: "What is a Python list?", answer: "A list in Python is an ordered collection of items which can be of mixed types. Lists are mutable and use square brackets [] to define them." },
  { question: "How to install Python packages?", answer: "Use pip, Python’s package manager. Example: `pip install requests`. You can also manage dependencies in a virtual environment using `venv` or `conda`." },

  // Java
  { question: "What is Java?", answer: "Java is a high-level, object-oriented programming language designed to be platform-independent, running on the JVM (Java Virtual Machine)." },
  { question: "How to install Java?", answer: "Download and install the JDK (Java Development Kit) from oracle.com or adoptopenjdk.net. After installation, set JAVA_HOME and update your PATH environment variable." },
  { question: "What is a Java class?", answer: "A class in Java is a blueprint for creating objects. It defines properties (fields) and behaviors (methods) that the objects will have." },
  { question: "How to compile and run a Java program?", answer: "Save your file as `MyProgram.java`, compile with `javac MyProgram.java`, and run it with `java MyProgram`." },

  // C++
  { question: "What is C++?", answer: "C++ is a general-purpose programming language that extends C with object-oriented features like classes and inheritance." },
  { question: "How to install C++?", answer: "On Windows, install MinGW or Visual Studio. On macOS, install Xcode Command Line Tools. On Linux, use `sudo apt install g++`." },
  { question: "What is a pointer in C++?", answer: "A pointer in C++ is a variable that stores the memory address of another variable, allowing direct memory manipulation." },
  { question: "How to compile and run a C++ program?", answer: "Use g++ to compile: `g++ main.cpp -o main`, then run it with `./main`." },

  // Databases
  { question: "What is SQL?", answer: "SQL (Structured Query Language) is a language used to manage and query relational databases." },
  { question: "How to install MySQL?", answer: "Download MySQL from mysql.com or install via package manager: `sudo apt install mysql-server` (Linux) or use Homebrew on macOS: `brew install mysql`." },
  { question: "What is a primary key?", answer: "A primary key is a unique identifier for a record in a database table." },
  { question: "How to connect to a MySQL database?", answer: "Use `mysql -u username -p` in your terminal, or connect via a programming language library such as `mysql.connector` in Python or `mysql2` in Node.js." },

  // Testing
  { question: "What is software testing?", answer: "Software testing is the process of evaluating software to ensure it meets requirements and works as expected." },
  { question: "What is Jest?", answer: "Jest is a JavaScript testing framework developed by Facebook, often used for testing React applications." },
  { question: "How to install Jest?", answer: "Run `npm install --save-dev jest` and add a test script in your package.json like `\"test\": \"jest\"`." },
  { question: "What is PyTest?", answer: "PyTest is a popular Python testing framework that simplifies writing small and scalable test cases." },
  { question: "How to install PyTest?", answer: "Install it with `pip install pytest`, then run your tests using the `pytest` command." },
  { question: "What is JUnit?", answer: "JUnit is a unit testing framework for Java applications used to write and run repeatable tests." },
  { question: "How to install JUnit?", answer: "Add JUnit as a dependency in your build tool (e.g., Maven or Gradle). For Maven, include it in your `pom.xml` dependencies." },

  // Misc / Tech
  { question: "What is Git?", answer: "Git is a distributed version control system used to track changes in code and collaborate with other developers." },
  { question: "How to install Git?", answer: "Download Git from git-scm.com or install via package manager: `sudo apt install git` on Linux, `brew install git` on macOS." },
  { question: "What is Docker?", answer: "Docker is a platform for creating, deploying, and running applications in lightweight containers." },
  { question: "How to install Docker?", answer: "Download Docker Desktop from docker.com for Windows/macOS, or install via terminal: `sudo apt install docker.io` on Linux." },
  { question: "What is Kubernetes?", answer: "Kubernetes is an open-source system for automating deployment, scaling, and management of containerized applications." },
  { question: "How to install Kubernetes?", answer: "Install Minikube for local clusters (`brew install minikube` or `choco install minikube`), then run `minikube start` to begin." }
];

// Helper to find offline answers (simple keyword matching)
const findOfflineAnswer = (message) => {
  const msgLower = message.toLowerCase();
  const match = offlineKnowledge.find((entry) =>
    msgLower.includes(entry.question.toLowerCase())
  );
  return match ? match.answer : null;
};

// ✅ Main techChat controller
export const techChat = async (req, res) => {
  console.log("💬 [techChat] Request received");

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const { message } = req.body;
  if (!message) {
    res.write(`data: ${JSON.stringify({ reply: "Please enter a question!" })}\n\n`);
    res.end();
    return;
  }

  console.log("📨 [techChat] Received message:", message);

  // ✅ If Gemini AI is online
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: "models/chat-bison-001" });
      const result = await model.generateContent(message);
const text = result.response.text();

res.write(`data: ${JSON.stringify({ reply: text })}\n\n`);
res.end();
      res.end();
      return;

    } catch (err) {
      console.error("🔥 [techChat] Gemini AI error:", err);
      res.write(
        `data: ${JSON.stringify({
          reply: "Running in offline mode (Gemini AI disabled).",
        })}\n\n`
      );
    }
  }

  // ✅ Offline fallback
  const offlineReply = findOfflineAnswer(message) || "❌ Sorry, I don't have an answer for that offline.";
  res.write(`data: ${JSON.stringify({ reply: offlineReply })}\n\n`);
  res.end();
};
