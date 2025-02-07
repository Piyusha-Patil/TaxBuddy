function sendMessage(message) {
    const chatHistory = document.getElementById("chat-history");
    
    // Display user message
    const userMessage = document.createElement("div");
    userMessage.classList.add("message", "user");
    userMessage.innerHTML = `<p>${message}</p>`;
    chatHistory.appendChild(userMessage);

    // Simulate bot response
    setTimeout(() => {
        const botMessage = document.createElement("div");
        botMessage.classList.add("message", "bot");
        botMessage.innerHTML = `<p>Thank you for your query about "${message}". Please wait while I fetch the information.</p>`;
        chatHistory.appendChild(botMessage);

        // Scroll to the bottom of the chat history
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }, 1000);
}
