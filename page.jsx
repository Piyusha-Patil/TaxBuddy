"use client";
import { useRouter } from 'next/router';
import React, { useState, useRef, useEffect } from "react";
import {
  BarChart, Bar, PieChart, Pie, Tooltip, Cell, Legend, XAxis, YAxis, ResponsiveContainer
} from "recharts";

function MainComponent() {
  // Add this to your existing state declarations in MainComponent
// Update your state declarations to include:
const [selectedInvestments, setSelectedInvestments] = useState([]);
const [showPlanSummary, setShowPlanSummary] = useState(false);
const [showInvestmentsPage, setShowInvestmentsPage] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
  const collectUserDetails = () => {
    setMessages(prev => [...prev, {
      type: "bot",
      content: "Let's collect some basic details for personalized analysis:\n\n1. What is your approximate annual income?\n2. What is your age group? (Below 30, 30-50, Above 50)\n3. What is your primary source of income? (Salary, Business, Investments)\n\nYou can answer all at once or one by one."
    }]);
    setHasUserDetails(true);
    setIsCollectingDetails(true);
  };
  // Add this near your other state declarations

  const [isCollectingDetails, setIsCollectingDetails] = useState(false);
  const [showSpendingModal, setShowSpendingModal] = useState(false);
  const [showInvestmentsModal, setShowInvestmentsModal] = useState(false);
  const [taxHistory, setTaxHistory] = useState([
    { year: 2023, income: 850000, taxPaid: 75000, deductions: 150000 },
    { year: 2022, income: 750000, taxPaid: 65000, deductions: 120000 },
    { year: 2021, income: 650000, taxPaid: 45000, deductions: 100000 },
  ]);
  const [hasUserDetails, setHasUserDetails] = useState(false);
  const [spendingPatterns, setSpendingPatterns] = useState({
    categories: [
      { name: "Investments", amount: 180000, percentage: 30 },
      { name: "Housing", amount: 120000, percentage: 20 },
      { name: "Transportation", amount: 60000, percentage: 10 },
      { name: "Food", amount: 90000, percentage: 15 },
      { name: "Utilities", amount: 30000, percentage: 5 },
      { name: "Entertainment", amount: 30000, percentage: 5 },
      { name: "Other", amount: 90000, percentage: 15 },
    ],
    totalSpending: 600000,
  });
  
  const [investmentSuggestions, setInvestmentSuggestions] = useState([
    {
      name: "ELSS Mutual Funds",
      description: "Equity Linked Savings Scheme with 3-year lock-in",
      section: "80C",
      maxAmount: 150000,
      risk: "Moderate",
      expectedReturn: "12-15%",
    },
    {
      name: "National Pension System",
      description: "Retirement benefit scheme with additional ₹50,000 deduction",
      section: "80CCD(1B)",
      maxAmount: 50000,
      risk: "Moderate",
      expectedReturn: "10-12%",
    },
    {
      name: "Health Insurance",
      description: "Premium paid for self, spouse, children and parents",
      section: "80D",
      maxAmount: 75000,
      risk: "Low",
      expectedReturn: "NA",
    },
    {
      name: "Public Provident Fund",
      description: "15-year government backed savings scheme",
      section: "80C",
      maxAmount: 150000,
      risk: "Low",
      expectedReturn: "7-8%",
    },
  ]);
  
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content:
        "👋 Hi! I'm your ITR Tax Filing Assistant. I can help you with:\n- Understanding which ITR form to file\n- Required documents for filing\n- Income tax calculation\n- Deductions and exemptions\n\nWould you like me to help you determine which ITR form you should file? (Type 'yes' to start the questionnaire)",
    },
  ]);
  useEffect(() => {
    document.title = "TaxBuddy"; // Set the tab name
  }, []);
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
    
    if (isCollectingDetails) {
      const details = parseUserDetails(query);
      if (details) {
        setUserDetails(details);
        setIsCollectingDetails(false);
        setHasUserDetails(true);
        
        // Generate personalized response based on details
        const personalizedResponse = generatePersonalizedResponse(details);
        return personalizedResponse;
      } else {
        return "I couldn't understand all your details. Please provide:\n1. Annual income\n2. Age group\n3. Income source\n\nExample: '500000, 30-50, Salary'";
      }
    }
  
    if (query_lower.includes("analysis") || query_lower.includes("trend")) {
      if (!hasUserDetails) {
        return "Before I can show your analysis, I need some basic details. Would you like to provide them now? (Type 'yes' to start)";
      }
      return typeof responses.analysis === 'function' ? responses.analysis() : responses.analysis;
    }
  
    if (query_lower.includes("invest") || query_lower.includes("saving")) {
      if (!hasUserDetails) {
        return "I can provide personalized investment suggestions after knowing your financial details. Would you like to share them? (Type 'yes' to start)";
      }
      return typeof responses.investments === 'function' ? responses.investments() : responses.investments;
    }
  
    if (query_lower.includes("spend") || query_lower.includes("expense")) {
      if (!hasUserDetails) {
        return "To analyze your spending patterns, I'll need some information about your expenses. Would you like to provide that now?";
      }
      return responses.spending;
    }
  
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
  const parseUserDetails = (input) => {
    const parts = input.split(',').map(part => part.trim());
    if (parts.length >= 3) {
      const income = parseInt(parts[0].replace(/\D/g, ''));
      const ageGroup = parts[1].toLowerCase();
      const incomeSource = parts[2].toLowerCase();
      
      if (!isNaN(income) && ['below 30', '30-50', 'above 50'].includes(ageGroup) && 
          ['salary', 'business', 'investments'].includes(incomeSource)) {
        return { income, ageGroup, incomeSource };
      }
    }
    return null;
  };
  
  // Generate personalized response based on user details
  const generatePersonalizedResponse = (details) => {
    let response = `Thanks for sharing your details! Here's your personalized analysis:\n\n`;
    
    // Income analysis
    if (details.income < 500000) {
      response += `▪ Your income (₹${details.income.toLocaleString('en-IN')}) is below taxable limit. Consider investments for future planning.\n`;
    } else if (details.income < 1000000) {
      response += `▪ Your income (₹${details.income.toLocaleString('en-IN')}) falls in 20% tax bracket. Maximize deductions under 80C, 80D.\n`;
    } else {
      response += `▪ Your income (₹${details.income.toLocaleString('en-IN')}) falls in 30% tax bracket. Consider tax planning strategies.\n`;
    }
    
    // Age-based suggestions
    if (details.ageGroup === 'below 30') {
      response += `▪ As you're young, consider long-term investments like PPF, NPS for compounding.\n`;
    } else if (details.ageGroup === '30-50') {
      response += `▪ At your life stage, balance growth and security in investments.\n`;
    } else {
      response += `▪ Focus on capital preservation and regular income from investments.\n`;
    }
    
    // Income source specific advice
    if (details.incomeSource === 'salary') {
      response += `▪ As salaried, maximize HRA, standard deduction, and LTA benefits.\n`;
    } else if (details.incomeSource === 'business') {
      response += `▪ As business owner, explore Section 44AD for presumptive taxation.\n`;
    } else {
      response += `▪ With investment income, focus on long-term capital gains benefits.\n`;
    }
    
    response += `\nWould you like to see detailed investment options? (Type 'investments')`;
    
    return response;
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
  const generateAnalysisResponse = () => {
    let response = `Here's your personalized tax analysis:\n\n`;
    
    // Income analysis
    if (userDetails.income < 500000) {
      response += `▪ Your income (₹${userDetails.income.toLocaleString('en-IN')}) is below taxable limit.\n`;
    } else if (userDetails.income < 1000000) {
      response += `▪ Your income (₹${userDetails.income.toLocaleString('en-IN')}) falls in 20% tax bracket.\n`;
    } else {
      response += `▪ Your income (₹${userDetails.income.toLocaleString('en-IN')}) falls in 30% tax bracket.\n`;
    }
    
    // Tax history analysis
    response += `\nTax History:\n`;
    response += taxHistory.map(year => 
      `▸ ${year.year}: Income ₹${year.income.toLocaleString('en-IN')}, Tax ₹${year.taxPaid.toLocaleString('en-IN')} (${((year.taxPaid/year.income)*100).toFixed(1)}%)`
    ).join('\n');
    
    // Spending analysis
    response += `\n\nSpending Patterns:\n`;
    response += spendingPatterns.categories.map(cat => 
      `▸ ${cat.name}: ₹${cat.amount.toLocaleString('en-IN')} (${cat.percentage}%)`
    ).join('\n');
    
    // Suggestions
    response += `\n\nSuggestions:\n`;
    if (userDetails.ageGroup === 'below 30') {
      response += "▪ Focus on long-term growth investments like equity funds.\n";
    } else if (userDetails.ageGroup === '30-50') {
      response += "▪ Balance growth and stability with hybrid investments.\n";
    } else {
      response += "▪ Prioritize capital preservation with fixed income options.\n";
    }
    
    return response;
  };
  
  const generateInvestmentsResponse = () => {
    if (!userDetails) {
      return "I need some basic details to provide personalized investment suggestions. Please provide your income, age group, and income source.";
    }
    
    let response = `Based on your profile (${userDetails.ageGroup}, ₹${userDetails.income.toLocaleString('en-IN')} income), here are recommended investments:\n\n`;
    
    // Filter investments based on user profile
    const filteredInvestments = investmentSuggestions.filter(inv => {
      if (userDetails.income < 700000 && inv.risk === "High") return false;
      if (userDetails.ageGroup === 'above 50' && inv.risk === "High") return false;
      return true;
    });
    
    response += filteredInvestments.map(inv => 
      `📌 ${inv.name} (Section ${inv.section})\n` +
      `- ${inv.description}\n` +
      `- Max Deduction: ₹${inv.maxAmount.toLocaleString('en-IN')}\n` +
      `- Risk: ${inv.risk}, Expected Return: ${inv.expectedReturn}\n`
    ).join('\n');
    
    response += `\n\nYou can explore these options in detail.`;
    
    return response;
  };

  
  const analyzeTaxTrends = () => {
    const currentYear = new Date().getFullYear();
    const last3Years = taxHistory.slice(0, 3);
    
    const totalIncome = last3Years.reduce((sum, year) => sum + year.income, 0);
    const totalTax = last3Years.reduce((sum, year) => sum + year.taxPaid, 0);
    const avgTaxRate = ((totalTax / totalIncome) * 100).toFixed(1);
    
    const incomeGrowth = ((taxHistory[0].income - taxHistory[2].income) / taxHistory[2].income * 100).toFixed(1);
    const taxGrowth = ((taxHistory[0].taxPaid - taxHistory[2].taxPaid) / taxHistory[2].taxPaid * 100).toFixed(1);
    
    return {
      avgTaxRate,
      incomeGrowth,
      taxGrowth,
      suggestedImprovements: taxHistory[0].deductions < 150000 ? 
        "You could save more by maximizing deductions under Section 80C (₹1.5L)" : 
        "Good job maximizing deductions! Consider exploring other sections like 80D for further savings"
    };
  };
  
  const getSpendingAnalysis = () => {
    const investmentPercentage = spendingPatterns.categories.find(c => c.name === "Investments").percentage;
    
    let analysis = "";
    
    if (userDetails) {
      analysis += `Based on your profile (${userDetails.ageGroup}, ${userDetails.incomeSource}):\n`;
      
      if (userDetails.income < 700000) {
        analysis += "▪ Consider increasing your savings rate as your income grows.\n";
      } else {
        analysis += "▪ You have good income potential for wealth building.\n";
      }
      if (userDetails.incomeSource === 'salary') {
        analysis += "▪ As salaried, maximize your Section 80C deductions.\n";
      } else if (userDetails.incomeSource === 'business') {
        analysis += "▪ Consider tax-saving business expenses and investments.\n";
      }
    }
    
    if (investmentPercentage < 20) {
      analysis += "▪ Your investment allocation is below recommended levels (20-30%).";
    } else if (investmentPercentage > 30) {
      analysis += "▪ Your investment allocation is strong.";
    } else {
      analysis += "▪ Your investment allocation is well balanced.";
    }
    
    return analysis;
  };

  const responses = {
    default: "I can help you understand various aspects of ITR filing. Would you like me to help you determine which ITR form you should file? (Type 'yes' to start)",
    itr: "There are different ITR forms (ITR-1 to ITR-7) based on your income sources:\n- ITR-1 (Sahaj): For salaried individuals with income up to ₹50 lakhs\n- ITR-2: For individuals with capital gains\n- ITR-3: For business income\n- ITR-4 (Sugam): For presumptive business income",
    documents: "For ITR filing, you'll typically need:\n- Form 16 from employer\n- Form 26AS (Tax credit statement)\n- Bank statements\n- Investment proofs (80C, 80D, etc.)\n- Rent receipts (if applicable)\n- Capital gains statements (if any)",
    deductions: "Common tax deductions include:\n- Section 80C (up to ₹1.5 lakhs): PPF, ELSS, Life Insurance\n- Section 80D: Health Insurance\n- Section 80G: Charitable Donations\n- HRA Exemptions\n- Standard Deduction: ₹50,000\n- NPS: Additional ₹50,000 under 80CCD(1B)",
    deadline: "Important ITR deadlines:\n- Regular filing: July 31st, 2025\n- Late filing with penalty: December 31st, 2025\n- Revised return: December 31st, 2025\n\nNote: Late filing incurs penalties under section 234F",
    calculate: "To calculate your tax liability, I need:\n1. Your total income\n2. Applicable deductions\n3. Income sources\n\nPlease provide these details for an accurate calculation.",
    help: "I can help you with:\n- Choosing the right ITR form\n- Document requirements\n- Tax calculations\n- Deductions & exemptions\n- Filing deadlines\n- Tax-saving investments\n\nWould you like me to help you determine which ITR form you should file? (Type 'yes' to start)",
    restart: "Let's start over with determining your ITR form. What is your residential status?\nOptions: Resident, Non-Resident, RNOR",
    analysis: generateAnalysisResponse,
    investments: generateInvestmentsResponse,
    spending: `Your spending patterns (last year):\n\n` +
      spendingPatterns.categories.map(cat => 
        `▸ ${cat.name}: ₹${cat.amount.toLocaleString('en-IN')} (${cat.percentage}%)`
      ).join('\n') +
      `\n\nTotal Annual Spending: ₹${spendingPatterns.totalSpending.toLocaleString('en-IN')}\n\n` +
      `Analysis:\n${getSpendingAnalysis()}`
  };
  const calculateTax = () => {
    const incomeNum = parseFloat(income);
    const deductionsNum = parseFloat(deductions) || 0;
    const taxableIncome = Math.max(incomeNum - deductionsNum, 0);
  
    let tax = 0;
    
    // Updated tax slabs as per your requirements
    if (taxableIncome <= 400000) {
      tax = 0;
    } else if (taxableIncome <= 800000) {
      tax = (taxableIncome - 400000) * 0.05;
    } else if (taxableIncome <= 1200000) {
      tax = 20000 + (taxableIncome - 800000) * 0.10;
    } else if (taxableIncome <= 1600000) {
      tax = 60000 + (taxableIncome - 1200000) * 0.15;
    } else if (taxableIncome <= 2000000) {
      tax = 120000 + (taxableIncome - 1600000) * 0.20;
    } else if (taxableIncome <= 2400000) {
      tax = 200000 + (taxableIncome - 2000000) * 0.25;
    } else {
      tax = 300000 + (taxableIncome - 2400000) * 0.30;
    }
  
    // Apply standard deduction of ₹75,000 (as per your requirements)
    const taxableIncomeAfterStandardDeduction = Math.max(taxableIncome - 75000, 0);
    
    // Recalculate tax with standard deduction
    let taxAfterStandardDeduction = 0;
    if (taxableIncomeAfterStandardDeduction <= 400000) {
      taxAfterStandardDeduction = 0;
    } else if (taxableIncomeAfterStandardDeduction <= 800000) {
      taxAfterStandardDeduction = (taxableIncomeAfterStandardDeduction - 400000) * 0.05;
    } else if (taxableIncomeAfterStandardDeduction <= 1200000) {
      taxAfterStandardDeduction = 20000 + (taxableIncomeAfterStandardDeduction - 800000) * 0.10;
    } else if (taxableIncomeAfterStandardDeduction <= 1600000) {
      taxAfterStandardDeduction = 60000 + (taxableIncomeAfterStandardDeduction - 1200000) * 0.15;
    } else if (taxableIncomeAfterStandardDeduction <= 2000000) {
      taxAfterStandardDeduction = 120000 + (taxableIncomeAfterStandardDeduction - 1600000) * 0.20;
    } else if (taxableIncomeAfterStandardDeduction <= 2400000) {
      taxAfterStandardDeduction = 200000 + (taxableIncomeAfterStandardDeduction - 2000000) * 0.25;
    } else {
      taxAfterStandardDeduction = 300000 + (taxableIncomeAfterStandardDeduction - 2400000) * 0.30;
    }
  
    // Add 4% health and education cess
    const totalTax = taxAfterStandardDeduction * 1.04;
  
    setTaxAmount({
      taxBeforeStandardDeduction: tax,
      taxAfterStandardDeduction: taxAfterStandardDeduction,
      totalTax: totalTax,
      standardDeductionApplied: 75000,
      taxableIncome: taxableIncome,
      taxableIncomeAfterStandardDeduction: taxableIncomeAfterStandardDeduction
    });
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
  <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 p-4 overflow-y-auto">
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Tax Calculator</h2>
        <button
          onClick={() => setShowCalculator(false)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className={`p-6 rounded-xl ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
          <h3 className="text-xl font-semibold mb-4">Calculate Your Tax</h3>
          
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
              />
            </div>
            
            
            
            <button
              onClick={calculateTax}
              className="w-full bg-[#0047AB] text-white py-3 rounded-lg hover:bg-[#003380] transition-colors font-medium"
            >
              Calculate Tax
            </button>
          </div>
        </div>
        
        <div className={`p-6 rounded-xl ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
          <h3 className="text-xl font-semibold mb-4">Tax Slabs (FY 2025-26)</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span>Up to ₹4,00,000</span>
              <span className="font-medium">0%</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span>₹4,00,001 - ₹8,00,000</span>
              <span className="font-medium">5%</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span>₹8,00,001 - ₹12,00,000</span>
              <span className="font-medium">10%</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span>₹12,00,001 - ₹16,00,000</span>
              <span className="font-medium">15%</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span>₹16,00,001 - ₹20,00,000</span>
              <span className="font-medium">20%</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
              <span>₹20,00,001 - ₹24,00,000</span>
              <span className="font-medium">25%</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Above ₹24,00,000</span>
              <span className="font-medium">30%</span>
            </div>
          </div>
          
          <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
            <p className="mb-2">* Standard deduction of ₹75,000 is automatically applied</p>
            <p>* 4% health and education cess is added to the tax amount</p>
          </div>
        </div>
      </div>
      
      {taxAmount !== null && (
        <div className={`mt-8 p-6 rounded-xl ${isDarkMode ? "bg-gray-800" : "bg-gray-50"} shadow-md`}>
          <h3 className="text-xl font-semibold mb-4">Tax Calculation Result</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Income:</span>
                  <span>₹{parseFloat(income).toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Taxable Income:</span>
                  <span>₹{(parseFloat(income) - parseFloat(deductions || 0)).toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Standard Deduction:</span>
                  <span>- ₹75,000</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2 font-medium">
                  <span>Final Taxable Income:</span>
                  <span>₹{taxAmount.taxableIncomeAfterStandardDeduction.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
            
            <div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Tax After Standard Deduction:</span>
                  <span>₹{taxAmount.taxAfterStandardDeduction.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Health & Education Cess (4%):</span>
                  <span>₹{(taxAmount.totalTax - taxAmount.taxAfterStandardDeduction).toLocaleString("en-IN", {maximumFractionDigits: 2})}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2 text-lg font-bold text-[#0047AB]">
                  <span>Total Tax Payable:</span>
                  <span>₹{taxAmount.totalTax.toLocaleString("en-IN", {maximumFractionDigits: 2})}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
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
        {/* Add this after your existing sections */}
        <section className={`py-24 ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center max-w-3xl mx-auto mb-16">
      <h2 className="text-4xl font-bold mb-6">Tax Analysis & Insights</h2>
      <p className="text-gray-600 dark:text-gray-400 text-lg">
        Personalized recommendations based on your financial patterns
      </p>
    </div>
    
    <div className="grid md:grid-cols-2 gap-8 mb-12">
      <div className={`p-6 rounded-2xl ${isDarkMode ? "bg-gray-700" : "bg-white"} shadow-lg`}>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <i className="fas fa-chart-line text-[#0047AB]"></i>
          Your Tax Trends
        </h3>
        <div className="space-y-4">
          {taxHistory.slice(0, 3).map((year, index) => (
            <div key={index} className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-600">
              <span className="font-medium">{year.year}</span>
              <div className="text-right">
                <p>Income: ₹{year.income.toLocaleString('en-IN')}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Tax Paid: ₹{year.taxPaid.toLocaleString('en-IN')} ({((year.taxPaid / year.income) * 100).toFixed(1)}%)
                </p>
              </div>
            </div>
          ))}
          <button 
            onClick={() => {
              setShowChat(true);
              setInputMessage("show my tax analysis");
              setTimeout(() => {
                handleSendMessage({ preventDefault: () => {} });
              }, 300);
            }}
            className="mt-4 text-[#0047AB] hover:text-[#003380] font-medium flex items-center gap-2"
          >
            Get Detailed Analysis <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
      
      <div className={`p-6 rounded-2xl ${isDarkMode ? "bg-gray-700" : "bg-white"} shadow-lg`}>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <i className="fas fa-wallet text-[#0047AB]"></i>
          Spending Patterns
        </h3>
        <div className="h-48 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={spendingPatterns.categories}>
              <XAxis dataKey="name" hide />
              <YAxis hide />
              <Tooltip 
                formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Amount']}
                labelFormatter={(label) => `Category: ${label}`}
              />
              <Bar dataKey="amount" fill="#0047AB" radius={[4, 4, 0, 0]}>
                {spendingPatterns.categories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#0047AB' : '#0047AB80'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <button 
  onClick={() => setShowSpendingModal(true)}
  className="text-[#0047AB] hover:text-[#003380] font-medium flex items-center gap-2"
>
          View Full Breakdown <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
    
    <div className={`p-8 rounded-2xl ${isDarkMode ? "bg-gray-700" : "bg-white"} shadow-lg`}>
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <i className="fas fa-piggy-bank text-[#0047AB]"></i>
        Personalized Investment Suggestions
      </h3>
      <div className="grid md:grid-cols-2 gap-6">
        {investmentSuggestions.slice(0, 4).map((investment, index) => (
          <div 
            key={index} 
            className={`p-4 rounded-xl border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} hover:border-[#0047AB] transition-colors`}
          >
            <h4 className="font-semibold text-[#0047AB] mb-2">{investment.name}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{investment.description}</p>
            <div className="flex justify-between text-sm">
              <span className="bg-[#0047AB]/10 text-[#0047AB] px-2 py-1 rounded">
                Section {investment.section}
              </span>
              <span>Up to ₹{investment.maxAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        ))}
      </div>
      <button 
  onClick={() => {
    setShowInvestmentsModal(false);
    setShowInvestmentsPage(true);
  }}
  className="mt-6 bg-[#0047AB] text-white px-6 py-2 rounded-lg hover:bg-[#003380] transition-colors flex items-center gap-2 mx-auto"
>
  <i className="fas fa-external-link-alt"></i> View Full Page
</button>
    </div>
  </div>
</section>
      </main>
      {showInvestmentsPage && (
  <InvestmentsPage 
    investments={investmentSuggestions}
    onClose={() => setShowInvestmentsPage(false)}
    isDarkMode={isDarkMode}
    selectedInvestments={selectedInvestments}
    setSelectedInvestments={setSelectedInvestments}
    setShowPlanSummary={setShowPlanSummary}
  />
)}

{showPlanSummary && (
  <PlanSummaryModal
    selectedInvestments={selectedInvestments}
    onClose={() => setShowPlanSummary(false)}
    isDarkMode={isDarkMode}
  />
)}
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
            {/* Add this inside the chat div, before the form element */}
<div className="px-4 pb-2 flex flex-wrap gap-2">
<button 
    onClick={() => {
      if (!userDetails) {
        collectUserDetails();
      } else {
        handleQuickLink("documents");
      }
    }}
    className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-3 py-1 rounded-full transition-colors"
  >
    <i className="fas fa-file mr-1"></i> Documents
  </button>
  <button 
    onClick={() => {
      if (!userDetails) {
        collectUserDetails();
      } else {
        handleQuickLink("deductions");
      }
    }}
    className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-3 py-1 rounded-full transition-colors"
  >
    <i className="fas fa-percentage mr-1"></i> Deductions
  </button>
  <button 
    onClick={() => {
      if (!userDetails) {
        collectUserDetails();
      } else {
        handleQuickLink("analysis");
      }
    }}
    className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-3 py-1 rounded-full transition-colors"
  >
    <i className="fas fa-chart-pie mr-1"></i> My Analysis
  </button>
  <button 
    onClick={() => {
      if (!userDetails) {
        collectUserDetails();
      } else {
        handleQuickLink("investments");
      }
    }}
    className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-3 py-1 rounded-full transition-colors"
  >
    <i className="fas fa-rupee-sign mr-1"></i> Investments
  </button>
</div>
{/* Spending Patterns Modal */}
{showSpendingModal && (
  <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/50">
    <div className="w-full max-w-[700px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Your Spending Patterns</h3>
        <button
          onClick={() => setShowSpendingModal(false)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
      <div className="h-80 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={spendingPatterns.categories}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              fill="#8884d8"
              dataKey="percentage"
              label={({ name, percentage }) => `${name}: ${percentage}%`}
            >
              {spendingPatterns.categories.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name, props) => [
                `₹${props.payload.amount.toLocaleString('en-IN')}`,
                name
              ]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">Analysis</h4>
        <p>{getSpendingAnalysis()}</p>
      </div>
    </div>
  </div>
)}

{/* Investments Modal */}
{showInvestmentsModal && (
  <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/50">
    <div className="w-full max-w-[700px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Investment Options</h3>
        <button
          onClick={() => setShowInvestmentsModal(false)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
      <div className="space-y-4">
        {investmentSuggestions.map((investment, index) => (
          <div 
            key={index} 
            className={`p-4 rounded-xl border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} hover:border-[#0047AB] transition-colors`}
          >
            <h4 className="font-semibold text-lg text-[#0047AB] mb-2">{investment.name}</h4>
            <p className="text-gray-600 dark:text-gray-300 mb-3">{investment.description}</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">Section:</span> {investment.section}
              </div>
              <div>
                <span className="font-medium">Max Amount:</span> ₹{investment.maxAmount.toLocaleString('en-IN')}
              </div>
              <div>
                <span className="font-medium">Risk:</span> {investment.risk}
              </div>
              <div>
                <span className="font-medium">Expected Return:</span> {investment.expectedReturn}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)}
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
function PlanSummaryModal({ selectedInvestments, onClose, isDarkMode }) {
  const totalDeduction = selectedInvestments.reduce(
    (sum, investment) => sum + investment.maxAmount, 0
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/50">
      <div className={`w-full max-w-2xl rounded-2xl shadow-2xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Your Investment Plan</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="space-y-4 mb-6">
          {selectedInvestments.map((investment, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-xl border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} flex justify-between items-center`}
            >
              <div>
                <h4 className="font-semibold">{investment.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Section {investment.section} (₹{investment.maxAmount.toLocaleString('en-IN')})
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                {investment.risk} risk
              </span>
            </div>
          ))}
        </div>
        
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} mb-6`}>
          <div className="flex justify-between items-center">
            <span className="font-semibold">Total Potential Deduction:</span>
            <span className="text-xl font-bold text-[#0047AB]">
              ₹{totalDeduction.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            {totalDeduction >= 150000 ? (
              "Great! You're maximizing your Section 80C deductions."
            ) : (
              "Consider adding more investments to maximize deductions."
            )}
          </div>
        </div>
        
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition-colors`}
          >
            Back
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-[#0047AB] hover:bg-[#003380] text-white transition-colors"
            onClick={() => {
              // Here you could implement saving the plan or other actions
              alert('Investment plan saved!');
              onClose();
            }}
          >
            Save Plan
          </button>
        </div>
      </div>
    </div>
  );
}
function InvestmentsPage({ investments, onClose, isDarkMode, selectedInvestments, setSelectedInvestments, setShowPlanSummary }) {
  const toggleInvestment = (investment) => {
    setSelectedInvestments(prev => {
      const isSelected = prev.some(item => item.name === investment.name);
      if (isSelected) {
        return prev.filter(item => item.name !== investment.name);
      } else {
        return [...prev, investment];
      }
    });
  };

  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">All Investment Options</h2>
          <div className="flex gap-4">
            {selectedInvestments.length > 0 && (
              <button 
                onClick={() => setShowPlanSummary(true)}
                className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-[#003380] hover:bg-[#0047AB]' : 'bg-[#0047AB] hover:bg-[#003380]'} text-white flex items-center gap-2`}
              >
                <i className="fas fa-file-alt"></i>
                View Plan ({selectedInvestments.length})
              </button>
            )}
            <button 
              onClick={onClose}
              className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {investments.map((investment, index) => {
            const isSelected = selectedInvestments.some(item => item.name === investment.name);
            
            return (
              <div 
                key={index}
                className={`p-6 rounded-xl border ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'} ${
                  isSelected ? (isDarkMode ? 'ring-2 ring-blue-500' : 'ring-2 ring-[#0047AB]') : ''
                }`}
              >
                <h3 className="text-xl font-bold text-[#0047AB] mb-2">{investment.name}</h3>
                <p className="mb-4">{investment.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-semibold">Tax Section</h4>
                    <p>Section {investment.section}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Max Deduction</h4>
                    <p>₹{investment.maxAmount.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Risk Level</h4>
                    <p>{investment.risk}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Expected Return</h4>
                    <p>{investment.expectedReturn}</p>
                  </div>
                </div>
                
                <button 
                  className={`px-4 py-2 rounded-lg ${
                    isSelected 
                      ? (isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600')
                      : (isDarkMode ? 'bg-[#003380] hover:bg-[#0047AB]' : 'bg-[#0047AB] hover:bg-[#003380]')
                  } text-white flex items-center justify-center gap-2`}
                  onClick={() => toggleInvestment(investment)}
                >
                  {isSelected ? (
                    <>
                      <i className="fas fa-check"></i> Added
                    </>
                  ) : (
                    <>
                      <i className="fas fa-plus"></i> Add to Plan
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default MainComponent;