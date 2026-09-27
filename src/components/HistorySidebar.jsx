import React from 'react';
import { X, Trash2, Download, ArrowUpRight, History } from 'lucide-react';

export default function HistorySidebar({
  isOpen,
  onClose,
  history,
  onSelectHistoryItem,
  onDeleteHistoryItem,
  onClearHistory
}) {
  return (
    <div className={`history-drawer-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="history-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-title">
            <History size={20} style={{ color: 'var(--accent-purple)' }} />
            <span>Prompt History</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {history.length > 0 && (
              <button
                className="btn-mini btn-mini-danger"
                onClick={onClearHistory}
                title="Clear All History"
              >
                <Trash2 size={13} />
                <span>Clear All</span>
              </button>
            )}
            <button className="btn-close-drawer" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="drawer-body">
          {history.length === 0 ? (
            <div className="empty-history-text">
              No prompt history yet.<br />Generated images will automatically appear here!
            </div>
          ) : (
            history.map((item) => (
              <div key={item.id} className="history-card">
                <img
                  src={item.image}
                  alt={item.metadata?.prompt}
                  className="history-thumb"
                />

                <div className="history-details">
                  <div className="history-prompt-text" title={item.metadata?.prompt}>
                    "{item.metadata?.prompt}"
                  </div>

                  <div className="history-meta">
                    <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span>•</span>
                    <span>{item.metadata?.style || 'Standard'}</span>
                  </div>

                  <div className="history-actions">
                    <button
                      className="btn-mini"
                      onClick={() => {
                        onSelectHistoryItem(item);
                        onClose();
                      }}
                    >
                      <ArrowUpRight size={12} />
                      <span>Use Prompt</span>
                    </button>

                    <button
                      className="btn-mini btn-mini-danger"
                      onClick={() => onDeleteHistoryItem(item.id)}
                      title="Delete item"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
