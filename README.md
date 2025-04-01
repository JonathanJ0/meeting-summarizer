# AudioBrief

**AudioBrief** is a web application designed to transform meetings and text into actionable insights. It allows users to summarize text, extract tasks and deadlines, and record meetings with real-time transcription, summarization, and task extraction. The front-end is built with React and TypeScript, while the back-end is powered by Flask, leveraging NLP tools like spaCy and Hugging Face transformers for text processing.

## Features

- **Summarize Text**: Convert lengthy text into concise summaries using the `facebook/bart-large-cnn` model.
- **Extract Tasks**: Identify actionable tasks and deadlines from text using spaCy.
- **Record Meetings**: Transcribe audio in real-time, summarize the transcription, and extract tasks and deadlines using `speech_recognition`, spaCy, and Hugging Face transformers.
- **State-Based Navigation**: Seamlessly switch between sections (Home, Summarize, Extract Tasks, Record Meeting) without URL-based routing.
- **Responsive Design**: Built with a mobile-first approach using custom CSS.

## Tech Stack

### Front-End
- **React**: JavaScript library for building user interfaces.
- **TypeScript**: Adds static types to JavaScript for better code reliability.
- **Vite**: Fast build tool and development server.
- **Bun**: Package manager for installing dependencies.
- **Lucide React**: Icon library for UI elements (e.g., `ArrowLeft`, `Mic`).
- **Custom CSS**: For styling the application (e.g., `index.css`, `main.css`).

### Back-End
- **Flask**: Lightweight Python web framework for the API.
- **spaCy**: NLP library for task and deadline extraction.
- **Hugging Face Transformers**: For text summarization (`facebook/bart-large-cnn` model).
- **speech_recognition**: Python library for real-time audio transcription.
- **Flask-CORS**: To handle cross-origin requests between the front-end and back-end.

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** (for Bun compatibility): [Download](https://nodejs.org/)
- **Bun**: [Installation Guide](https://bun.sh/)
- **Python 3.8+**: [Download](https://www.python.org/downloads/)
- **pip**: Python package manager (comes with Python)
- **Git**: For cloning the repository.

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/audio-brief.git
cd audio-brief

