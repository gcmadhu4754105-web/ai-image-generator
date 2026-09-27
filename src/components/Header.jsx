import React from 'react';
import { Sparkles, History, Cpu } from 'lucide-react';

export default function Header({ historyCount, onToggleHistory, isGenerating }) {
  return (
    <header className="app-header">
      <div className="brand">
        <div className="brand-icon-wrapper">
          <Sparkles className="brand-icon" />
        </div>
        <div>
          <span className="brand-title">VisionAI</span>
          <span className="brand-tag" style={{ marginLeft: '8px' }}>FLUX & DALL-E</span>
        </div>
      </div>

      <div className="header-actions">
        <button
          className="btn-header-action"
          onClick={onToggleHistory}
          title="View Prompt History"
        >
          <History size={18} />
          <span>History</span>
          {historyCount > 0 && (
            <span className="history-badge">{historyCount}</span>
          )}
        </button>
      </div>
    </header>
  );
}
