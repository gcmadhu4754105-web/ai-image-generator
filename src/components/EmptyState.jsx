import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { samplePrompts } from '../data/samplePrompts';

export default function EmptyState({ onSelectSample }) {
  return (
    <div className="glass-card empty-state-box">
      <div className="empty-icon-wrapper">
        <Sparkles size={38} />
      </div>

      <h2 className="empty-title">Ready to Create Amazing AI Art?</h2>
      <p className="empty-desc">
        Describe any scene, character, object, or fantasy world in the prompt box on the left, then click <strong>Generate Image</strong>.
      </p>

      <div className="sample-prompts-heading">Or Try One of These Ideas:</div>
      <div className="sample-list">
        {samplePrompts.map((sample, idx) => (
          <button
            key={idx}
            className="sample-card"
            onClick={() => onSelectSample(sample.prompt)}
          >
            <span>
              {sample.icon} <strong>{sample.title}:</strong> "{sample.prompt.substring(0, 48)}..."
            </span>
            <ArrowRight size={14} className="sample-card-icon" />
          </button>
        ))}
      </div>
    </div>
  );
}
