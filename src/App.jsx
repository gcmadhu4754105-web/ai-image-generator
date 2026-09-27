import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import GeneratorForm from './components/GeneratorForm';
import ImageDisplay from './components/ImageDisplay';
import EmptyState from './components/EmptyState';
import LoadingState from './components/LoadingState';
import HistorySidebar from './components/HistorySidebar';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'vision_ai_prompt_history';

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('None');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [model, setModel] = useState('flux');
  const [enhance, setEnhance] = useState(true);
  const [negativePrompt, setNegativePrompt] = useState('blurry, distorted, low quality, bad anatomy, deformed, ugly, pixelated, watermark');

  const [isGenerating, setIsGenerating] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [error, setError] = useState(null);

  const [history, setHistory] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Load history from localStorage on initial render
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (err) {
      console.error('Failed to parse history from localStorage:', err);
    }
  }, []);

  // Save history to localStorage when changed
  const saveHistory = (newHistory) => {
    setHistory(newHistory);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newHistory));
    } catch (err) {
      console.error('Failed to save history to localStorage:', err);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a description for the image you want to create.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const randomSeed = Math.floor(Math.random() * 10000000);
      const response = await axios.post('/api/generate', {
        prompt: prompt.trim(),
        aspect_ratio: aspectRatio,
        style: selectedStyle,
        model,
        enhance,
        negative_prompt: negativePrompt,
        seed: randomSeed
      });

      if (response.data && response.data.success) {
        const newResult = response.data;
        setCurrentResult(newResult);

        // Add to history
        const historyItem = {
          id: `hist_${Date.now()}`,
          timestamp: new Date().toISOString(),
          image: newResult.image,
          metadata: newResult.metadata
        };

        const updatedHistory = [historyItem, ...history.slice(0, 19)]; // Keep max 20 items
        saveHistory(updatedHistory);
        showToast('High-accuracy image generated! ✨');
      } else {
        setError(response.data?.error || 'Failed to generate image. Please try again.');
      }
    } catch (err) {
      console.error('Generation Error:', err);
      const message = err.response?.data?.error || err.message || 'Error communicating with AI backend server.';
      setError(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectHistoryItem = (item) => {
    if (item && item.metadata) {
      setPrompt(item.metadata.prompt || '');
      setSelectedStyle(item.metadata.style || 'None');
      setAspectRatio(item.metadata.aspect_ratio || '1:1');
      if (item.metadata.model) setModel(item.metadata.model);
      if (typeof item.metadata.enhance === 'boolean') setEnhance(item.metadata.enhance);
      setCurrentResult({ image: item.image, metadata: item.metadata });
      setError(null);
      showToast('Loaded prompt & image from history!');
    }
  };

  const handleDeleteHistoryItem = (itemId) => {
    const updated = history.filter((h) => h.id !== itemId);
    saveHistory(updated);
    showToast('Removed item from history.');
  };

  const handleClearHistory = () => {
    saveHistory([]);
    showToast('Cleared all prompt history.');
  };

  return (
    <div className="app-container">
      <Header
        historyCount={history.length}
        onToggleHistory={() => setIsHistoryOpen(!isHistoryOpen)}
        isGenerating={isGenerating}
      />

      <main className="main-content">
        <div className="generator-grid">
          {/* Left Column: Generator Form & Controls */}
          <GeneratorForm
            prompt={prompt}
            setPrompt={setPrompt}
            selectedStyle={selectedStyle}
            setSelectedStyle={setSelectedStyle}
            aspectRatio={aspectRatio}
            setAspectRatio={setAspectRatio}
            model={model}
            setModel={setModel}
            enhance={enhance}
            setEnhance={setEnhance}
            negativePrompt={negativePrompt}
            setNegativePrompt={setNegativePrompt}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />

          {/* Right Column: Dynamic State Display */}
          <div>
            {/* Error Message Box */}
            {error && (
              <div className="error-box">
                <AlertCircle className="error-icon" />
                <div>
                  <div className="error-title">Generation Failed</div>
                  <div className="error-message">{error}</div>
                </div>
              </div>
            )}

            {/* View State Router */}
            {isGenerating ? (
              <LoadingState prompt={prompt} />
            ) : currentResult ? (
              <ImageDisplay
                result={currentResult}
                onGenerateAgain={handleGenerate}
                onToast={showToast}
              />
            ) : (
              <EmptyState onSelectSample={(sampleText) => setPrompt(sampleText)} />
            )}
          </div>
        </div>
      </main>

      {/* History Slide-over Drawer */}
      <HistorySidebar
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectHistoryItem={handleSelectHistoryItem}
        onDeleteHistoryItem={handleDeleteHistoryItem}
        onClearHistory={handleClearHistory}
      />

      {/* Toast alert popup */}
      {toastMessage && (
        <div className="toast-notification">
          <CheckCircle2 size={18} style={{ color: '#4ade80' }} />
          <span>{toastMessage}</span>
        </div>
      )}

      <footer className="app-footer">
        VisionAI &copy; {new Date().getFullYear()} — Powered by FLUX.1 & Open AI Models. Designed for speed, precision, and privacy.
      </footer>
    </div>
  );
}
