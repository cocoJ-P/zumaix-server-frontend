import { useState } from 'react';
import type { IntelligenceEvidence } from '../../../api/types';
import { formatDisplayValue, formatEvidenceKind } from '../utils';

interface EvidencePanelProps {
  evidence: IntelligenceEvidence[];
}

const PREVIEW_COUNT = 5;

export function EvidencePanel({ evidence }: EvidencePanelProps) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? evidence : evidence.slice(0, PREVIEW_COUNT);

  return (
    <section className="result-panel">
      <h2 className="result-panel__title">分析依据</h2>
      {evidence.length === 0 ? (
        <p className="muted-copy">当前没有可展示的分析依据。</p>
      ) : (
        <>
          <ul className="evidence-list">
            {visible.map((item) => (
              <li key={item.id} className="evidence-item">
                <div className="evidence-item__meta">
                  <span className="feature-tag">
                    {formatEvidenceKind(item.kind)}
                  </span>
                  {item.field ? (
                    <span className="result-field__label">{item.field}</span>
                  ) : null}
                </div>
                <p className="evidence-item__text">“{item.text}”</p>
                {item.source ? (
                  <p className="evidence-item__source">
                    {formatDisplayValue(item.source)}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
          {evidence.length > PREVIEW_COUNT && !expanded ? (
            <div className="intelligence-actions">
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => setExpanded(true)}
              >
                查看全部依据
              </button>
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}
