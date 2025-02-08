"use client";
import React from "react";

function MainComponent() {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content:
        "👋 Hi! I'm your ITR Tax Filing Assistant. I can help you with:\n- Understanding which ITR form to file\n- Required documents for filing\n- Income tax calculation\n- Deductions and exemptions\n\nWould you like me to help you determine which ITR form you should file? (Type 'yes' to start the questionnaire)",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [voiceRecognition, setVoiceRecognition] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [isQuestionnaire, setIsQuestionnaire] = useState(false);
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const govLinks = [
    {
      title: "Income Tax Portal",
      url: "https://www.incometax.gov.in/",
      description: "Official ITR filing site",
    },
    {
      title: "Tax Information Directory",
      url: "https://www.incometaxindia.gov.in/",
      description: "Resources from IT department",
    },
    {
      title: "GST Portal",
      url: "https://www.gst.gov.in/",
      description: "Official GST filing site",
    },
  ];
  const [showCalculator, setShowCalculator] = useState(false);
  const [income, setIncome] = useState("");
  const [deductions, setDeductions] = useState("");
  const [taxAmount, setTaxAmount] = useState(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInputMessage(transcript);
          handleSendMessage({ preventDefault: () => {} });
        };
        recognition.onend = () => {
          setIsListening(false);
        };
        setVoiceRecognition(recognition);
      }
    }
  }, []);

  const questions = [
    "What is your residential status?\nOptions: Resident, Non-Resident, RNOR",
    "What is your age category?\nOptions: Below60, 60-80, Above80",
    "What is your primary source of income?\nOptions: Salary, Business, CapitalGains, Rental, Other",
    "Do you earn income from multiple sources?\nOptions: Yes, No",
    "Do you have capital gains from stocks, property, or mutual funds?\nOptions: Yes, No",
    "Is your total income below ₹50 lakh?\nOptions: Yes, No",
    "Are you opting for Presumptive Taxation under Section 44AD/ADA/AE?\nOptions: Yes, No",
    "Do you have foreign income or foreign assets?\nOptions: Yes, No",
    "Have you received any tax-exempt income like PF withdrawals?\nOptions: Yes, No",
    "Have you claimed deductions under Section 80C, 80D, etc.?\nOptions: Yes, No",
  ];
  const determineITRForm = (answers) => {
    if (answers.length < 10) return null;

    if (
      answers[2].toLowerCase() === "salary" &&
      answers[3].toLowerCase() === "no" &&
      answers[4].toLowerCase() === "no" &&
      answers[5].toLowerCase() === "yes" &&
      answers[7].toLowerCase() === "no"
    ) {
      return "ITR-1 (Sahaj)";
    }

    if (
      answers[2].toLowerCase() === "business" &&
      answers[6].toLowerCase() === "yes"
    ) {
      return "ITR-4 (Sugam)";
    }

    if (
      answers[2].toLowerCase() === "business" ||
      answers[4].toLowerCase() === "yes"
    ) {
      return "ITR-3";
    }

    if (
      answers[7].toLowerCase() === "yes" ||
      answers[2].toLowerCase() === "capitalgains"
    ) {
      return "ITR-2";
    }

    return "ITR-2";
  };
  const simulateResponse = async (query) => {
    const query_lower = query.toLowerCase();

    if (query_lower === "yes" && !isQuestionnaire) {
      setIsQuestionnaire(true);
      return questions[0];
    }

    if (isQuestionnaire) {
      if (currentQuestion < questions.length) {
        userAnswers[currentQuestion] = query;
        const nextQuestion = currentQuestion + 1;
        setCurrentQuestion(nextQuestion);

        if (nextQuestion < questions.length) {
          return questions[nextQuestion];
        } else {
          setIsQuestionnaire(false);
          const recommendedForm = determineITRForm(Object.values(userAnswers));
          let response = `Based on your answers, I recommend filing ${recommendedForm}.\n\n`;

          if (recommendedForm === "ITR-1 (Sahaj)") {
            response +=
              "ITR-1 is for individuals with:\n- Salary income\n- Single house property\n- Other sources (interest)\n- Agricultural income up to ₹5,000\n- Total income below ₹50 lakh";
          } else if (recommendedForm === "ITR-2") {
            response +=
              "ITR-2 is for individuals with:\n- Capital gains\n- Foreign income/assets\n- Multiple house properties\n- Income from other sources";
          } else if (recommendedForm === "ITR-3") {
            response +=
              "ITR-3 is for individuals with:\n- Business/Professional income\n- Capital gains\n- Income from other sources";
          } else if (recommendedForm === "ITR-4 (Sugam)") {
            response +=
              "ITR-4 is for individuals with:\n- Business income under presumptive taxation\n- Professional income\n- Salary and house property";
          }

          response +=
            "\n\nWould you like to know more about the documents required for filing this form? Just ask about 'documents'.";
          return response;
        }
      }
    }

    const responses = {
      default:
        "I can help you understand various aspects of ITR filing. Would you like me to help you determine which ITR form you should file? (Type 'yes' to start)",
      itr: "There are different ITR forms (ITR-1 to ITR-7) based on your income sources:\n- ITR-1 (Sahaj): For salaried individuals with income up to ₹50 lakhs\n- ITR-2: For individuals with capital gains\n- ITR-3: For business income\n- ITR-4 (Sugam): For presumptive business income",
      documents:
        "For ITR filing, you'll typically need:\n- Form 16 from employer\n- Form 26AS (Tax credit statement)\n- Bank statements\n- Investment proofs (80C, 80D, etc.)\n- Rent receipts (if applicable)\n- Capital gains statements (if any)",
      deductions:
        "Common tax deductions include:\n- Section 80C (up to ₹1.5 lakhs): PPF, ELSS, Life Insurance\n- Section 80D: Health Insurance\n- Section 80G: Charitable Donations\n- HRA Exemptions\n- Standard Deduction: ₹50,000\n- NPS: Additional ₹50,000 under 80CCD(1B)",
      deadline:
        "Important ITR deadlines:\n- Regular filing: July 31st, 2025\n- Late filing with penalty: December 31st, 2025\n- Revised return: December 31st, 2025\n\nNote: Late filing incurs penalties under section 234F",
      calculate:
        "To calculate your tax liability, I need:\n1. Your total income\n2. Applicable deductions\n3. Income sources\n\nPlease provide these details for an accurate calculation.",
      help: "I can help you with:\n- Choosing the right ITR form\n- Document requirements\n- Tax calculations\n- Deductions & exemptions\n- Filing deadlines\n- Tax-saving investments\n\nWould you like me to help you determine which ITR form you should file? (Type 'yes' to start)",
      restart:
        "Let's start over with determining your ITR form. What is your residential status?\nOptions: Resident, Non-Resident, RNOR",
    };

    let response = responses.default;

    if (query_lower === "restart" || query_lower === "start over") {
      setCurrentQuestion(0);
      setUserAnswers({});
      setIsQuestionnaire(false);
      response = responses.restart;
    } else if (query_lower.includes("itr") || query_lower.includes("form")) {
      response = responses.itr;
    } else if (query_lower.includes("document")) {
      response = responses.documents;
    } else if (
      query_lower.includes("deduction") ||
      query_lower.includes("80")
    ) {
      response = responses.deductions;
    } else if (
      query_lower.includes("deadline") ||
      query_lower.includes("due date")
    ) {
      response = responses.deadline;
    } else if (
      query_lower.includes("calculate") ||
      query_lower.includes("computation")
    ) {
      response = responses.calculate;
    } else if (query_lower.includes("help") || query_lower.includes("assist")) {
      response = responses.help;
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(response);
      }, 1000);
    });
  };
  const startVoiceRecognition = () => {
    if (voiceRecognition) {
      setIsListening(true);
      voiceRecognition.start();
    }
  };
  const handleQuickLink = (query) => {
    setInputMessage(query);
    handleSendMessage({ preventDefault: () => {} });
  };
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      type: "user",
      content: inputMessage,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const response = await simulateResponse(inputMessage);
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content: response,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content:
            "I apologize, but I'm having trouble responding right now. Please try again.",
        },
      ]);
    }

    setIsTyping(false);
  };
  const calculateTax = () => {
    const incomeNum = parseFloat(income);
    const deductionsNum = parseFloat(deductions) || 0;
    const taxableIncome = Math.max(incomeNum - deductionsNum, 0);

    let tax = 0;
    if (taxableIncome <= 250000) {
      tax = 0;
    } else if (taxableIncome <= 500000) {
      tax = (taxableIncome - 250000) * 0.05;
    } else if (taxableIncome <= 750000) {
      tax = 12500 + (taxableIncome - 500000) * 0.1;
    } else if (taxableIncome <= 1000000) {
      tax = 37500 + (taxableIncome - 750000) * 0.15;
    } else if (taxableIncome <= 1250000) {
      tax = 75000 + (taxableIncome - 1000000) * 0.2;
    } else if (taxableIncome <= 1500000) {
      tax = 125000 + (taxableIncome - 1250000) * 0.25;
    } else {
      tax = 187500 + (taxableIncome - 1500000) * 0.3;
    }

    setTaxAmount(tax);
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
      />
      <nav
        className={`fixed w-full z-10 ${
          isDarkMode
            ? "bg-gray-800/90 backdrop-blur-md"
            : "bg-white/90 backdrop-blur-md"
        } shadow-lg`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg bg-[#0047AB] flex items-center justify-center mr-2">
                <i className="fas fa-calculator text-white"></i>
              </div>
              <span className="font-bold text-xl">TaxBuddy</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowChat(true)}
                className="bg-[#0047AB] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#003380] transition-colors flex items-center gap-2"
              >
                <i className="fas fa-headset"></i>
                Get Help
              </button>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <i
                  className={`fas ${isDarkMode ? "fa-sun" : "fa-moon"} text-xl`}
                ></i>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="pt-16">
        <section
          className={`min-h-screen flex items-center ${
            isDarkMode
              ? "bg-gray-800"
              : "bg-gradient-to-r from-[#6366f1] to-[#a855f7]"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-white">
                <h1 className="text-5xl font-bold mb-6 leading-tight">
                  Smart Income Tax Filing Made Simple
                </h1>
                <p className="text-xl mb-8 text-white/80">
                  Simplify your tax filing process with our AI-powered
                  assistant. Get expert guidance every step of the way.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="#services"
                    className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-arrow-right"></i>
                    Explore Services
                  </a>
                </div>
              </div>
              <div className="hidden md:block">
                <img
                  src="https://ucarecdn.com/2d20226c-bbb8-40ec-93b6-39663e8eb216/-/format/auto/"
                  alt="Tax preparation illustration showing a professional working on tax documents with calculator and computer"
                  className="w-full h-auto rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>
        <section
          id="services"
          className={`py-24 ${isDarkMode ? "bg-gray-900" : "bg-[#faf5ff]"}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-6">Our Services</h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Comprehensive tax solutions powered by cutting-edge AI
                technology
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div
                onClick={() => setShowChat(true)}
                className={`p-8 rounded-2xl ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                } shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer`}
              >
                <div className="bg-[#6366f1]/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                  <i className="fas fa-robot text-[#6366f1] text-3xl"></i>
                </div>
                <h3 className="text-2xl font-semibold mb-4">
                  AI Tax Assistant
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  24/7 intelligent support for all your tax-related queries with
                  real-time responses
                </p>
              </div>
              <div
                className={`p-8 rounded-2xl ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                } shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1`}
              >
                <div className="bg-[#6366f1]/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                  <i className="fas fa-file-invoice text-[#6366f1] text-3xl"></i>
                </div>
                <h3 className="text-2xl font-semibold mb-4">ITR Filing</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Streamlined and guided ITR filing process with error checks
                  and maximized deductions
                </p>
              </div>
              <div
                onClick={() => setShowCalculator(true)}
                className={`p-8 rounded-2xl ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                } shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer`}
              >
                <div className="bg-[#6366f1]/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                  <i className="fas fa-calculator text-[#6366f1] text-3xl"></i>
                </div>
                <h3 className="text-2xl font-semibold mb-4">Tax Calculator</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Advanced tax calculation tools with support for multiple
                  income sources and investments
                </p>
              </div>
            </div>
          </div>
        </section>
        {showCalculator && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/50">
            <div className="w-full max-w-[500px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Tax Calculator</h3>
                <button
                  onClick={() => setShowCalculator(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Annual Income (₹)
                  </label>
                  <input
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0047AB] dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Enter your annual income"
                    name="income"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Total Deductions (₹)
                  </label>
                  <input
                    type="number"
                    value={deductions}
                    onChange={(e) => setDeductions(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0047AB] dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Enter total deductions"
                    name="deductions"
                  />
                </div>
                <button
                  onClick={calculateTax}
                  className="w-full bg-[#0047AB] text-white py-2 rounded-lg hover:bg-[#003380] transition-colors"
                >
                  Calculate Tax
                </button>
                {taxAmount !== null && (
                  <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <h4 className="text-lg font-semibold mb-2">
                      Tax Calculation Result
                    </h4>
                    <div className="space-y-2">
                      <p>
                        Total Income: ₹
                        {parseFloat(income).toLocaleString("en-IN")}
                      </p>
                      <p>
                        Total Deductions: ₹
                        {parseFloat(deductions || 0).toLocaleString("en-IN")}
                      </p>
                      <p>
                        Taxable Income: ₹
                        {(
                          parseFloat(income) - parseFloat(deductions || 0)
                        ).toLocaleString("en-IN")}
                      </p>
                      <p className="text-lg font-semibold text-[#0047AB]">
                        Tax Amount: ₹{taxAmount.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <section
          className={`py-24 ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-6">Why Choose Us</h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Experience the future of tax filing with our innovative platform
              </p>
            </div>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center p-6 rounded-xl bg-white/5 backdrop-blur-lg">
                <div className="bg-[#0047AB]/10 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <i className="fas fa-clock text-[#0047AB] text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-4">Quick Processing</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Complete your returns in minutes with our efficient system
                </p>
              </div>
              <div className="text-center p-6 rounded-xl bg-white/5 backdrop-blur-lg">
                <div className="bg-[#0047AB]/10 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <i className="fas fa-shield-alt text-[#0047AB] text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-4">100% Secure</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Bank-grade security for all your sensitive financial data
                </p>
              </div>
              <div className="text-center p-6 rounded-xl bg-white/5 backdrop-blur-lg">
                <div className="bg-[#0047AB]/10 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <i className="fas fa-headset text-[#0047AB] text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-4">24/7 Support</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Round-the-clock assistance for all your tax-related queries
                </p>
              </div>
              <div className="text-center p-6 rounded-xl bg-white/5 backdrop-blur-lg">
                <div className="bg-[#0047AB]/10 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <i className="fas fa-check-circle text-[#0047AB] text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-4">Accuracy</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  AI-powered verification for error-free filing
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className={`py-24 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl font-bold mb-6">Important Resources</h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Access official government portals and helpful resources
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {govLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-8 rounded-2xl ${
                    isDarkMode ? "bg-gray-800" : "bg-gray-50"
                  } shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 group`}
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-[#0047AB]/10 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-external-link-alt text-[#0047AB] text-xl group-hover:rotate-45 transition-transform"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-[#0047AB] group-hover:text-[#003380] transition-colors">
                        {link.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {link.description}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      {showChat && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/50">
          <div className="w-full max-w-[600px] h-[500px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700">
            <div
              className={`p-3 ${
                isDarkMode
                  ? "bg-gray-800"
                  : "bg-gradient-to-r from-[#0047AB] to-[#0066CC]"
              } text-white flex justify-between items-center border-b border-gray-200 dark:border-gray-700`}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <i className="fas fa-robot text-lg"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Tax Assistant</h3>
                  <p className="text-xs text-white/80">Always here to help</p>
                </div>
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="hover:bg-white/10 p-2 rounded-full transition-colors"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  } items-end gap-2`}
                >
                  {message.type === "bot" && (
                    <div className="w-6 h-6 rounded-full bg-[#0047AB]/10 flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-robot text-[#0047AB] text-xs"></i>
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 ${
                      message.type === "user"
                        ? "bg-[#0047AB] text-white rounded-br-none"
                        : "bg-gray-100 dark:bg-gray-700 rounded-bl-none"
                    }`}
                  >
                    <p className="whitespace-pre-line text-sm">
                      {message.content}
                    </p>
                  </div>
                  {message.type === "user" && (
                    <div className="w-6 h-6 rounded-full bg-[#0047AB] flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-user text-white text-xs"></i>
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#0047AB]/10 flex items-center justify-center">
                    <i className="fas fa-robot text-[#0047AB] text-xs"></i>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-[#0047AB] rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-[#0047AB] rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-[#0047AB] rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <form
              onSubmit={handleSendMessage}
              className="p-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={startVoiceRecognition}
                  className={`${
                    isListening ? "bg-red-500" : "bg-[#0047AB]"
                  } text-white p-2 rounded-full hover:opacity-90 transition-colors flex items-center justify-center w-10 h-10`}
                  disabled={!voiceRecognition}
                >
                  <i
                    className={`fas ${
                      isListening ? "fa-stop" : "fa-microphone"
                    } text-sm`}
                  ></i>
                </button>
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask about ITR filing..."
                  className="flex-1 p-2 rounded-full border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm focus:outline-none focus:border-[#0047AB] dark:focus:border-[#0047AB] transition-colors"
                  name="message"
                />
                <button
                  type="submit"
                  className="bg-[#0047AB] text-white p-2 rounded-full hover:bg-[#003380] transition-colors flex items-center justify-center w-10 h-10"
                >
                  <i className="fas fa-paper-plane text-sm"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <button
        onClick={() => setShowChat(true)}
        className="fixed bottom-4 right-4 md:right-8 bg-[#0047AB] text-white p-4 rounded-full shadow-lg hover:bg-[#003380] transition-colors z-40 flex items-center justify-center w-14 h-14"
      >
        <i className="fas fa-comments text-xl"></i>
      </button>
    </div>
  );
}

export default MainComponent;