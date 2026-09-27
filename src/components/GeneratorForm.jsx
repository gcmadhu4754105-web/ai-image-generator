import React, { useState } from 'react';
import { Sparkles, X, Wand2, SlidersHorizontal, Image as ImageIcon, Layers, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { samplePrompts, stylePresets, aspectRatios } from '../data/samplePrompts';

export default function GeneratorForm({
  prompt,
  setPrompt,
  selectedStyle,
  setSelectedStyle,
  aspectRatio,
  setAspectRatio,
  model,
  setModel,
  enhance,
  setEnhance,
  negativePrompt,
  setNegativePrompt,
  onGenerate,
  isGenerating
}) {
  const maxCharCount = 500;
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleClear = () => {
    setPrompt('');
  };

  const handlePresetClick = (sampleText) => {
    setPrompt(sampleText);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    onGenerate();
  };

  return (
    <form className="glass-card" onSubmit={handleSubmit}>
      <div className="panel-title">
        <Wand2 className="panel-title-icon" size={22} />
        <span>Create High-Accuracy AI Artwork</span>
      </div>

      {/* Main Textarea */}
      <div className="form-group">
        <div className="label-row">
          <label className="form-label" htmlFor="prompt-input">
            Image Prompt Description
          </label>
          <span className="char-counter">
            {prompt.length} / {maxCharCount}
          </span>
        </div>

        <div className="textarea-wrapper">
          <textarea
            id="prompt-input"
            className="prompt-textarea"
            placeholder="Describe the image in detail... (e.g. A futuristic city at night with flying cars, neon skyscrapers, cinematic lighting, hyper realistic)"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value.slice(0, maxCharCount))}
            disabled={isGenerating}
            rows={4}
          />
          {prompt && !isGenerating && (
            <button
              type="button"
              className="btn-clear-prompt"
              onClick={handleClear}
              title="Clear Prompt"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* AI Magic Enhancer Toggle Bar */}
      <div 
        style={{
          background: 'rgba(139, 92, 246, 0.12)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Zap size={18} style={{ color: 'var(--accent-purple)' }} />
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              ✨ AI Magic Prompt Enhancer
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Automatically refines prompts for maximum accuracy & photorealism
            </div>
          </div>
        </div>

        <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={enhance}
            onChange={(e) => setEnhance(e.target.checked)}
            disabled={isGenerating}
            style={{ opacity: 0, width: 0, height: 0 }}
          />
          <span
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: enhance ? 'var(--accent-purple)' : 'rgba(255,255,255,0.2)',
              borderRadius: '24px',
              transition: '0.3s'
            }}
          >
            <span
              style={{
                position: 'absolute',
                content: '""',
                height: '18px',
                width: '18px',
                left: enhance ? '22px' : '3px',
                bottom: '3px',
                backgroundColor: 'white',
                borderRadius: '50%',
                transition: '0.3s'
              }}
            />
          </span>
        </label>
      </div>

      {/* Quick Inspiration Pills */}
      <div className="presets-section">
        <span className="form-label" style={{ fontSize: '0.8rem' }}>
          💡 High-Fidelity Prompt Ideas
        </span>
        <div className="chip-container">
          {samplePrompts.slice(0, 4).map((sample, idx) => (
            <button
              key={idx}
              type="button"
              className="preset-chip"
              onClick={() => handlePresetClick(sample.prompt)}
              disabled={isGenerating}
            >
              {sample.icon} {sample.title}
            </button>
          ))}
        </div>
      </div>

      {/* Options Grid */}
      <div className="options-grid">
        {/* Style Selector */}
        <div className="option-select-group">
          <label className="form-label" htmlFor="style-select">
            <SlidersHorizontal size={14} /> Art Style
          </label>
          <select
            id="style-select"
            className="custom-select"
            value={selectedStyle}
            onChange={(e) => setSelectedStyle(e.target.value)}
            disabled={isGenerating}
          >
            {stylePresets.map((st) => (
              <option key={st.id} value={st.id}>
                {st.icon} {st.label}
              </option>
            ))}
          </select>
        </div>

        {/* Aspect Ratio Selector */}
        <div className="option-select-group">
          <label className="form-label" htmlFor="ratio-select">
            <ImageIcon size={14} /> Aspect Ratio
          </label>
          <select
            id="ratio-select"
            className="custom-select"
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value)}
            disabled={isGenerating}
          >
            {aspectRatios.map((ar) => (
              <option key={ar.id} value={ar.id}>
                {ar.label} ({ar.desc})
              </option>
            ))}
          </select>
        </div>

        {/* Specialized AI Engine Selector */}
        <div className="option-select-group" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label" htmlFor="model-select">
            <Layers size={14} /> AI Model Engine (Select specialized model for accuracy)
          </label>
          <select
            id="model-select"
            className="custom-select"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            disabled={isGenerating}
          >
            <option value="flux">⚡ FLUX.1 Schnell (Highest Prompt Adherence & Detail)</option>
            <option value="flux-realism">📸 FLUX Realism (Hyper-Photorealistic Details)</option>
            <option value="flux-anime">🎨 FLUX Anime / Digital Illustration</option>
            <option value="flux-3d">💎 FLUX 3D Render & Claymation</option>
            <option value="turbo">🚀 Stable Diffusion Turbo</option>
            <option value="dall-e-3">🤖 OpenAI DALL-E 3 (Requires OPENAI_API_KEY in .env)</option>
            <option value="huggingface">🤗 HuggingFace FLUX (Requires HF_TOKEN in .env)</option>
          </select>
        </div>
      </div>

      {/* Advanced Settings Toggle */}
      <div style={{ marginBottom: '20px' }}>
        <button
          type="button"
          className="btn-mini"
          style={{ width: '100%', justifyContent: 'center', padding: '8px' }}
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <span>{showAdvanced ? 'Hide Advanced Controls' : 'Show Negative Prompt & Fine-Tuning'}</span>
          {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {showAdvanced && (
          <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>
              🚫 Negative Prompt (What to exclude from image)
            </label>
            <input
              type="text"
              className="custom-select"
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              placeholder="e.g. blurry, bad anatomy, ugly, extra fingers, text, watermark"
              disabled={isGenerating}
            />
          </div>
        )}
      </div>

      {/* Generate Action Button */}
      <button
        type="submit"
        className="btn-generate"
        disabled={!prompt.trim() || isGenerating}
      >
        <Sparkles size={20} />
        {isGenerating ? 'Synthesizing Artwork...' : 'Generate Image'}
      </button>
    </form>
  );
}
