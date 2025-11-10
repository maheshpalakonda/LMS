import React, { useState } from "react";

const ChatBot = ({ isStudent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLevel, setCurrentLevel] = useState("root");
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [customIssue, setCustomIssue] = useState(false);
  const [userMessage, setUserMessage] = useState("");

  const faqs = {
    // MAIN MENU
    root: [
      { q: "Login or Access Issues", next: "login" },
      { q: "Course Related Issues", next: "course" },
      { q: "Watching Recorded Videos", next: "recording" },
      { q: "Payment or Billing Issues", next: "payment" },
      { q: "Technical Errors (Website or App)", next: "technical" },
      { q: "Report an Issue", a: "Please describe your issue or contact support." },
    ],

    // LOGIN ISSUES
    login: [
      { q: "Forgot Password", a: "Click on 'Forgot Password' and reset it via your registered email." },
      { q: "Email Not Verified", a: "Check your spam folder or request a new verification email." },
      { q: "Account Locked", a: "Wait 30 minutes or contact support for manual unlock." },
      { q: "Cannot Login with Google", a: "Clear your browser cache and try again." },
      { q: "Still not resolved", next: "support" },
    ],

    // COURSE ISSUES
    course: [
      { q: "Course Not Loading", a: "Refresh the page or check your internet connection." },
      { q: "Lecture Missing", a: "Your instructor may not have published it yet." },
      { q: "Progress Not Saving", a: "Log out and log back in to sync your progress." },
      { q: "Cannot Enroll", a: "Ensure your payment or access request is complete." },
      { q: "Still not resolved", next: "support" },
    ],

    // WATCHING RECORDED VIDEOS ISSUES
    recording: [
      { q: "Video Not Playing", a: "Try refreshing the page or switching browsers (e.g., Chrome, Edge)." },
      { q: "Audio Not Working", a: "Check system volume and browser site permissions for sound." },
      { q: "Video Buffering or Lagging", a: "Reduce playback quality or use a stable Wi-Fi connection." },
      { q: "Video Stuck or Frozen", a: "Reload the lecture page or clear browser cache." },
      { q: "Playback Speed Not Changing", a: "Try updating your browser or reopening the player." },
      { q: "Cannot View in Fullscreen", a: "Allow fullscreen permission in your browser settings." },
      { q: "Subtitle / Transcript Missing", a: "The instructor may not have uploaded subtitles yet." },
      { q: "Video Crashes the App", a: "Update to the latest app version or use the web browser instead." },
      { q: "Still not resolved", next: "support" },
    ],

    // PAYMENT ISSUES
    payment: [
      { q: "Payment Failed", a: "Retry after a few minutes or try another payment method." },
      { q: "Transaction Pending", a: "Please wait for 30 minutes; some banks take time to confirm." },
      { q: "Refund Request", a: "Contact support with your transaction ID and reason." },
      { q: "Duplicate Payment", a: "Send both receipts to support for review." },
      { q: "Still not resolved", next: "support" },
    ],

    // TECHNICAL ERRORS
    technical: [
      { q: "Website Not Loading", a: "Try another browser or clear cache and cookies." },
      { q: "App Keeps Crashing", a: "Uninstall and reinstall, or update to the latest version." },
      { q: "Error Message on Screen", a: "Take a screenshot and share it with support." },
      { q: "Slow Performance", a: "Close other tabs or restart your device to free memory." },
      { q: "Still not resolved", next: "support" },
    ],

    // SUPPORT
    support: [
      {
        q: "📞 Contact Support",
        a: "Please contact our helpdesk:\nPhone: +91-9876543210\nEmail: support@example.com",
      },
      { q: "🔙 Go Back to Main Menu", next: "root" },
    ],
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setCurrentLevel("root");
      setSelectedAnswer("");
      setCustomIssue(false);
      setUserMessage("");
    }
  };

  const handleOptionClick = (option) => {
    if (option.q === "Report an Issue") {
      setCustomIssue(true);
      setSelectedAnswer("");
      return;
    }

    if (option.a) {
      setSelectedAnswer(option.a);
      setCustomIssue(false);
    } else {
      setSelectedAnswer("");
      setCustomIssue(false);
    }

    if (option.next) {
      setCurrentLevel(option.next);
    }
  };

  if (!isStudent) return null;

  return (
    <>
      {!isOpen && (
        <button
          onClick={toggleChat}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            backgroundColor: "#007bff",
            color: "white",
            fontSize: "28px",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            zIndex: 9999,
          }}
        >
          💬
        </button>
      )}

      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "350px",
            height: "450px",
            background: "white",
            borderRadius: "8px",
            border: "1px solid #ccc",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            fontFamily: "Arial, sans-serif",
            zIndex: 9999,
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: "#007bff",
              color: "white",
              padding: "10px 15px",
              fontWeight: "bold",
              fontSize: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            Help ChatBot
            <button
              onClick={toggleChat}
              style={{
                background: "none",
                border: "none",
                color: "white",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>

          {/* Options */}
          <div
            style={{
              flex: 1,
              padding: "10px",
              overflowY: "auto",
              backgroundColor: "#f9f9f9",
            }}
          >
            <p style={{ fontWeight: "bold", marginBottom: "8px" }}>Select an issue:</p>
            {faqs[currentLevel].map((faq, index) => (
              <label
                key={index}
                onClick={() => handleOptionClick(faq)}
                style={{
                  display: "block",
                  padding: "8px 10px",
                  marginBottom: "5px",
                  backgroundColor: "#f1f1f1",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                {faq.q}
              </label>
            ))}
          </div>

          {/* Answer */}
          {selectedAnswer && (
            <div
              style={{
                padding: "10px",
                borderTop: "1px solid #ddd",
                backgroundColor: "#fff",
                color: "#000",
                fontSize: "14px",
                whiteSpace: "pre-line",
              }}
            >
              <strong>Answer:</strong>
              <p style={{ marginTop: "5px" }}>{selectedAnswer}</p>
            </div>
          )}

          {/* Custom issue input for "Report an Issue" */}
          {customIssue && (
            <div
              style={{
                padding: "10px",
                borderTop: "1px solid #ddd",
                backgroundColor: "#fff",
              }}
            >
              <p style={{ fontWeight: "bold", marginBottom: "5px" }}>Describe your issue:</p>
              <textarea
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Type your issue here..."
                style={{
                  width: "100%",
                  height: "80px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  padding: "8px",
                  fontSize: "14px",
                }}
              />
              <button
                onClick={() => {
                  if (userMessage.trim() === "") {
                    alert("Please describe your issue before submitting.");
                    return;
                  }
                  alert(`Your issue has been submitted: ${userMessage}`);
                  setUserMessage("");
                  setCustomIssue(false);
                  setSelectedAnswer("Thank you! Our support team will get back to you soon.");
                }}
                style={{
                  marginTop: "8px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  padding: "8px 12px",
                  cursor: "pointer",
                }}
              >
                Submit
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ChatBot;
