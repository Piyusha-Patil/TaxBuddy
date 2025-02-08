from flask import Flask, render_template, request, jsonify
import google.generativeai as genai

app = Flask(__name__)

# Configure the API key for Google Gemini AI
genai.configure(api_key="AIzaSyCOb9a7ox4vc-rdnzTGOghIi6R4zXq26JI")

@app.route("/")
def index():
    return render_template("chatbot.html")

@app.route("/get_response", methods=["POST"])
def get_response():
    # Get user input from the frontend
    user_input = request.get_json().get("message")
    try:
        # Initialize the GenerativeModel
        model = genai.GenerativeModel("gemini-pro")  # Replace with your specific model name if different

        # Generate content using the updated method
        response = model.generate_content(user_input)

        # Extract and return the response text
        reply = response.text.strip()
        return jsonify({"response": reply})
    except Exception as e:
        # Handle errors and return an appropriate message
        return jsonify({"response": f"Error: {str(e)}"})

if __name__ == "__main__":
    app.run(debug=True)
