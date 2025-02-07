import React, { useEffect, useState } from "react";
import "../styles/TaxBuddy.css"; // Ensure the correct path

const TaxAssistantHub = () => {
  const [showChatbot, setShowChatbot] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    document.title = "Tax Buddy"; // Set tab title
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode");

  };

  return (
    <div className={`min-h-screen p-8 transition-all ${darkMode ? "dark bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className={`text-4xl font-bold flex items-center ${darkMode ? "text-yellow-400" : "text-blue-600"}`}>
          <span role="img" aria-label="tax">🧾</span> Tax Assistant Hub
        </h1>
        <button onClick={toggleDarkMode} className="dark-mode-toggle p-2 border rounded-lg">
          {darkMode ? "🔆 Light Mode" : "☀ Dark Mode"}
        </button>
      </div>

      {/* Layout with Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
        
        {/* Left Side: Quick Links */}
        <div>
          <h2 className={`text-2xl font-semibold ${darkMode ? "text-green-300" : "text-green-600"}`}>
            Quick Tax Information
          </h2>
          <div className="mt-4 space-y-4">
            <a href="https://www.incometax.gov.in/iec/foportal/" target="_blank" rel="noopener noreferrer"
              className="info-card">
              <strong >📂 Income Tax Portal</strong>
              <p>Official Income Tax Filing Portal</p>
            </a>
            <a href="https://incometaxindia.gov.in" target="_blank" rel="noopener noreferrer"
              className="info-card">
              <strong>📘 Tax Information Directory</strong>
              <p>Income Tax Department Resources</p>
            </a>
            <a href="https://www.gst.gov.in/" target="_blank" rel="noopener noreferrer"
              className="info-card">
              <strong>📑 GST Portal</strong>
              <p>Goods and Services Tax Portal</p>
            </a>
          </div>
        </div>

        {/* Right Side: Chatbot */}
        <div>
          {showChatbot ? (
            <div className="chat-container">
              <div className="chat-header">
                <h2>Tax Buddy - Virtual Assistant</h2>
                <button onClick={() => setShowChatbot(false)}>❌</button>
              </div>
              <iframe 
                style={{ width: "100%", height: "500px" }} 
                src="https://www.create.xyz/app/a360554c-8c6b-44c5-ac20-cad7bff505df" 
                title="Tax Assistant Chatbot"
                frameBorder="0">
              </iframe>
            </div>
          ) : (
            <p className="text-gray-400 text-center">Click <strong>Tax Buddy</strong> to open the assistant.</p>
          )}
        </div>
      </div>

      {/* Floating Tax Buddy Button */}
      <button onClick={() => setShowChatbot(true)} className="floating-button">
        💬  Tax Buddy
      </button>
    </div>
  );
};

export default TaxAssistantHub;
