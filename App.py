from flask import Flask, request, jsonify, render_template
from flask_cors import CORS  # Add this import
from transformers import pipeline
import spacy
import re
import speech_recognition as sr
from datetime import datetime
import logging

app = Flask(__name__)

# Enable CORS for all routes, allowing requests from the React app
CORS(app, resources={r"/*": {"origins": "http://localhost:8080"}})

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load models with error handling
try:
    summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
    nlp = spacy.load("en_core_web_sm")
    recognizer = sr.Recognizer()
except Exception as e:
    logger.error(f"Failed to load models: {e}")
    raise

# Rest of your app.py code remains unchanged...

def extract_tasks(text):
    """Extract tasks and deadlines from text with improved regex."""
    doc = nlp(text)
    tasks = []
    deadlines = []
    for sent in doc.sents:
        # Enhanced task extraction
        task_keywords = r"\b(complete|submit|review|fix|discuss|assign|prepare|schedule|update|finish)\b"
        if re.search(task_keywords, sent.text, re.IGNORECASE):
            tasks.append(sent.text.strip())
        
        # Improved deadline extraction
        deadline_pattern = r"\b(by|before|on|due)\b.*?\b(\d{1,2}(st|nd|rd|th)?\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|noon|pm|am)|tomorrow|next\s*\w+)"
        match = re.search(deadline_pattern, sent.text, re.IGNORECASE)
        if match:
            deadlines.append(match.group(0).strip())
    return tasks, deadlines

def transcribe_audio(timeout=20, phrase_limit=30):
    """Transcribe audio with improved error handling and feedback."""
    try:
        with sr.Microphone() as source:
            logger.info("Adjusting for ambient noise...")
            recognizer.adjust_for_ambient_noise(source, duration=2)
            logger.info("Listening... Speak now.")
            audio = recognizer.listen(source, timeout=timeout, phrase_time_limit=phrase_limit)
        
        text = recognizer.recognize_google(audio)
        logger.info(f"Transcription: {text}")
        return text
    except sr.WaitTimeoutError:
        return "No speech detected within timeout period."
    except sr.UnknownValueError:
        return "Could not understand audio."
    except sr.RequestError as e:
        return f"Speech recognition error: {e}"
    except Exception as e:
        logger.error(f"Unexpected error during transcription: {e}")
        return "An unexpected error occurred."

@app.route("/", methods=["GET"])
def home():
    return render_template("index.html", current_date=datetime.now().strftime("%Y-%m-%d"))

@app.route("/summarize", methods=["POST"])
def summarize():
    try:
        data = request.json if request.is_json else request.form
        text = data.get("text", "").strip()
        if not text:
            return jsonify({"error": "No text provided"}), 400
        
        summary = summarizer(text, max_length=150, min_length=50, do_sample=False)[0]["summary_text"]
        return jsonify({"summary": summary})
    except Exception as e:
        logger.error(f"Error in summarize: {e}")
        return jsonify({"error": "Failed to summarize text"}), 500

@app.route("/extract-tasks", methods=["POST"])
def extract():
    try:
        data = request.json if request.is_json else request.form
        text = data.get("text", "").strip()
        if not text:
            return jsonify({"error": "No text provided"}), 400
        
        tasks, deadlines = extract_tasks(text)
        return jsonify({"tasks": tasks, "deadlines": deadlines})
    except Exception as e:
        logger.error(f"Error in extract-tasks: {e}")
        return jsonify({"error": "Failed to extract tasks"}), 500

@app.route("/meeting", methods=["POST"])
def process_meeting():
    try:
        transcription = transcribe_audio()
        if "error" in transcription.lower():
            return jsonify({"error": transcription}), 400
        
        summary = summarizer(transcription, max_length=150, min_length=50, do_sample=False)[0]["summary_text"]
        tasks, deadlines = extract_tasks(transcription)
        return jsonify({
            "transcription": transcription,
            "summary": summary,
            "tasks": tasks,
            "deadlines": deadlines,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        })
    except Exception as e:
        logger.error(f"Error in process_meeting: {e}")
        return jsonify({"error": "Failed to process meeting"}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5001, host="0.0.0.0")