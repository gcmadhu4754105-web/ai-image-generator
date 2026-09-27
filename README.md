# VisionAI - Modern AI Image Generator Application

VisionAI is a modern, responsive full-stack web application designed for generating high-quality AI artwork from text prompts. It connects securely to real AI image generation models through a dedicated Express backend server.

---

## 🌟 Key Features

1. **Large Prompt Textarea & Validation**:
   - Clear placeholder: `"Describe the image you want to create..."`
   - Real-time character counter (max 500 chars).
   - Quick **Clear Prompt** button (`X` icon).

2. **Real AI Image Generation API**:
   - Backend logic powered by **FLUX.1 Schnell** & **Stable Diffusion Turbo** by default.
   - Securely supports optional API keys for **Hugging Face (`HF_TOKEN`)** and **OpenAI (`OPENAI_API_KEY` - DALL-E 3)** via environment variables (`.env`).
   - Server converts generated image buffers to base64 Data URLs, avoiding CORS restrictions and enabling reliable instant downloading.

3. **Customization & Style Controls**:
   - **Art Styles**: Photorealistic, Cinematic, Anime, Cyberpunk, Epic Fantasy, 3D Octane Render, Minimalist, Vintage.
   - **Aspect Ratios**: Square (1:1), Landscape (16:9), Portrait (9:16), Standard (4:3), Tall (3:4).
   - **AI Model Selector**: FLUX.1 Schnell, SD Turbo, DALL-E 3, HuggingFace FLUX.

4. **Interactive UI & Animation States**:
   - **Empty-State Screen**: Displayed before any image is generated with sample prompt cards for quick inspiration.
   - **Loading Animation**: Shimmering canvas, spinning ring, step-by-step progress status updates, and animated progress bar.
   - **Error Handling**: Clear error notifications if API calls fail or input is invalid.

5. **Actions & History**:
   - **Download Image**: High-resolution PNG download with sanitized filenames.
   - **Generate Again**: Re-roll and synthesize new variations using randomized seeds.
   - **Prompt History Drawer**: Persistent history stored locally with prompt reuse, metadata preview, and single/bulk deletion.

6. **Responsive Luxury Design**:
   - Built with dark studio glassmorphism aesthetics, Google Fonts (`Outfit` + `Inter`), cyan/purple gradients, and micro-interactions.

---

## 🚀 Getting Started Guide

### Prerequisites
Make sure you have **Node.js** (v18 or higher) installed on your system.

### 1. Clone & Install Dependencies
Run the following command in the project directory:
```bash
npm install
```

### 2. Environment Variables Configuration (`.env`)
Create a `.env` file in the root directory (or copy `.env.example`):
```bash
# Server Port
PORT=5000

# Optional API Keys (Leave blank to use built-in FLUX/SDXL engines)
HF_TOKEN=
OPENAI_API_KEY=
TOGETHER_API_KEY=
STABILITY_API_KEY=
```

> 🔒 **Security Note**: API keys are strictly read by the backend `server.js` and are **never exposed** in the frontend client code.

### 3. Running the Application
To run both the Express backend server and the Vite React frontend concurrently:
```bash
npm run dev
```

- **Frontend Application**: `http://localhost:3000`
- **Backend API Server**: `http://localhost:5000`

---

## 📁 Project Structure

```
ai-image-generator/
├── server.js                 # Express server & API routes
├── vite.config.js            # Vite configuration with API proxy setup
├── index.html                # Main HTML template with Google Fonts
├── package.json              # Project dependencies and npm scripts
├── .env.example              # Template for API keys
├── .env                      # Environment file
├── src/
│   ├── main.jsx              # React mounting entry point
│   ├── App.jsx               # App layout & global state logic
│   ├── index.css             # Glassmorphism design system & styles
│   ├── components/
│   │   ├── Header.jsx        # Top bar with logo and history button
│   │   ├── GeneratorForm.jsx # Prompt textarea, presets, & generate button
│   │   ├── ImageDisplay.jsx  # Active generated image & action buttons
│   │   ├── EmptyState.jsx    # Initial empty state screen with sample prompts
│   │   ├── LoadingState.jsx  # Animated loader with status steps
│   │   └── HistorySidebar.jsx# Slide-over prompt history drawer
│   └── data/
│       └── samplePrompts.js  # Curated example prompts and style presets
└── README.md                 # Documentation
```

---

## 🛠️ API Endpoint Specification

### `POST /api/generate`
**Request Body**:
```json
{
  "prompt": "A futuristic city at night with flying cars, cinematic lighting, ultra realistic",
  "aspect_ratio": "16:9",
  "style": "Cinematic",
  "model": "flux"
}
```

**Response**:
```json
{
  "success": true,
  "image": "data:image/jpeg;base64,...",
  "metadata": {
    "prompt": "A futuristic city at night...",
    "aspect_ratio": "16:9",
    "width": 1280,
    "height": 720,
    "style": "Cinematic",
    "model": "flux",
    "provider": "pollinations"
  }
}
```
