# AI Music Therapy Assistant 🎵

An intelligent music therapy assistant application based on Vue 3 and Flask that analyzes users' emotional states and recommends suitable music to help improve mental health.

## 🌟 Project Overview

AI Music Therapy Assistant is an innovative web application that combines artificial intelligence and music therapy to provide personalized music recommendation services. The application understands users' emotional states through natural language conversations and recommends appropriate music types based on emotions, helping users relieve stress and improve their mood.

## ✨ Core Features

- **Intelligent Emotion Analysis**: AI conversation system based on GPT-4 model that understands and analyzes users' emotional states
- **Personalized Music Recommendations**: Recommends suitable music based on users' emotions (happy, sad, calm, anxious, angry)
- **Real-time Chat Interaction**: User-friendly interface supporting real-time conversations
- **Music Player**: Built-in music player with playback controls
- **Emotion-Music Mapping**: Carefully designed emotion and music type mapping system

## 🎨 Tech Stack

### Frontend
- Vue 3 - Progressive JavaScript Framework
- Vite - Next Generation Frontend Tooling
- Vue Router - Official Router for Vue.js
- Pinia - Intuitive, type safe, light and flexible Store for Vue
- Axios - Promise based HTTP client

### Backend
- Flask - Python Web Framework
- Flask-CORS - A Flask extension for handling Cross Origin Resource Sharing (CORS)
- Requests - HTTP library for Python
- OpenAI API / HKBU GenAI API - AI Model Interface

## 📁 Project Structure

```
MusicTherapyVue/
├── backend/                 # Backend Flask Application
│   ├── app.py              # Main Application File
│   └── templates/          # Template Files
└── frontend/               # Frontend Vue Application
    └── vite-project/
        ├── src/
        │   ├── components/  # Vue Components
        │   │   ├── ChatContainer.vue    # Chat Container Component
        │   │   └── MusicPlayer.vue      # Music Player Component
        │   ├── utils/       # Utility Functions
        │   │   └── emotionMusicMap.js  # Emotion-Music Mapping
        │   ├── App.vue     # Root Component
        │   └── main.js     # Application Entry Point
        ├── public/         # Static Assets
        │   └── music/      # Music Files Directory
        └── package.json    # Project Dependencies
```

## 🚀 Quick Start

### Prerequisites

- Node.js 16.x or higher
- Python 3.8 or higher
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scriptsctivate     # Windows
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure API Key:
Edit the `app.py` file and set your API Key:
```python
self.api_key = "your-api-key-here"
```

5. Start the backend server:
```bash
python app.py
```

The backend service will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend/vite-project
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The frontend application will run on `http://localhost:5173`

## 🎵 Music Recommendation System

The application supports music recommendations for the following 5 emotion types:

| Emotion Type | Music Characteristics | Example Songs |
|-------------|----------------------|---------------|
| happy       | Upbeat and energetic  | Baby Blue, Don't Stop Me Now |
| sad         | Gentle and comforting | Someone Like You, Hurt |
| calm        | Relaxing and peaceful | Emotion, Lullaby of my soul |
| anxious     | Soothing and calming | Breathe, Weightless |
| angry       | Intense and cathartic | Killing in the Name, Enter Sandman |

The core implementation of the music recommendation engine is in the `src/utils/emotionMusicMap.js` file. You can add or modify music mappings as needed.


## 📝 Usage Instructions

1. After opening the application, you will see a friendly chat interface
2. Type your feelings or thoughts in the chat box
3. The AI will analyze your emotional state and respond
4. Based on your emotion, the system will automatically recommend and play suitable music
5. You can control music playback through the music player


