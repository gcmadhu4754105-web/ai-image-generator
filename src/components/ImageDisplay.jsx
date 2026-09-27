import React, { useState } from 'react';
import { Download, RefreshCw, Copy, Check, Info, ZoomIn } from 'lucide-react';

export default function ImageDisplay({ result, onGenerateAgain, onToast }) {
  const [copied, setCopied] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!result || !result.image) return null;

  const { image, metadata } = result;

  const handleDownload = () => {
    try {
      const link = document.createElement('a');
      link.href = image;
      const safePromptName = (metadata?.prompt || 'ai-generated-image')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .substring(0, 30);
      link.download = `vision-ai-${safePromptName}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (onToast) onToast('Image downloaded successfully! 🚀');
    } catch (err) {
      console.error('Download error:', err);
      if (onToast) onToast('Failed to download image. Try right clicking and saving.');
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(metadata?.prompt || '');
    setCopied(true);
    if (onToast) onToast('Prompt copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card result-card">
      {/* Generated Image Container */}
      <div 
        className="image-preview-wrapper"
        style={{ cursor: isZoomed ? 'zoom-out' : 'zoom-in' }}
        onClick={() => setIsZoomed(!isZoomed)}
      >
        <img
          src={image}
          alt={metadata?.prompt || 'AI Generated Image'}
          className="generated-image"
          style={{
            maxHeight: isZoomed ? '85vh' : '520px',
            transform: isZoomed ? 'scale(1.05)' : 'scale(1)'
          }}
        />
      </div>

      {/* Primary Action Buttons */}
      <div className="image-actions-bar">
        <button
          className="btn-action btn-action-primary"
          onClick={handleDownload}
        >
          <Download size={18} />
          <span>Download Image</span>
        </button>

        <button
          className="btn-action btn-action-secondary"
          onClick={onGenerateAgain}
        >
          <RefreshCw size={18} />
          <span>Generate Again</span>
        </button>
      </div>

      {/* Metadata & Prompt Badge */}
      <div className="prompt-info-badge">
        <div className="label-row" style={{ marginBottom: '6px' }}>
          <div className="prompt-info-title">Prompt Details</div>
          <button
            className="btn-mini"
            onClick={handleCopyPrompt}
            title="Copy Prompt"
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <p style={{ color: 'var(--text-primary)', marginBottom: '10px', lineHeight: '1.4' }}>
          "{metadata?.prompt}"
        </p>

        <div className="history-meta">
          <span>📐 Ratio: {metadata?.aspect_ratio} ({metadata?.width}x{metadata?.height})</span>
          <span>•</span>
          <span>🎨 Style: {metadata?.style || 'None'}</span>
          <span>•</span>
          <span>⚙️ Engine: {metadata?.provider || 'pollinations'} ({metadata?.model})</span>
        </div>
      </div>
    </div>
  );
}
