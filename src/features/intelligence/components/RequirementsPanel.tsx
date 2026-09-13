import type { OpportunityClaim } from '../../../api/types';
import { formatExpectedValue } from '../utils';

interface RequirementsPanelProps {
  claim: OpportunityClaim;
}

export function RequirementsPanel({ claim }: RequirementsPanelProps) {
  const requirements = claim.claimed_requirements ?? [];

  return (
    <section className="result-panel">
      <h2 className="result-panel__title">内容中提到的资格条件</h2>
      {requirements.length === 0 ? (
        <p className="muted-copy">当前内容未明确列出资格条件。</p>
      ) : (
        <ul className="req-list">
          {requirements.map((item) => {
            const expected = formatExpectedValue(item.expected_value);

            return (
              <li key={item.key} className="req-item">
                <div className="req-item__head">
                  <span className="req-item__label">{item.label}</span>
                  {item.required ? (
                    <span className="feature-tag">必要条件</span>
                  ) : null}
                </div>
                {item.description ? (
                  <p className="req-item__description">{item.description}</p>
                ) : null}
                {expected ? (
                  <p className="req-item__description">{expected}</p>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
