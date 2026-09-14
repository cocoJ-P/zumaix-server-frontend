import { useMemo, useState } from 'react';
import { ApiError } from '../../../api/errors';
import type { OpportunityListItem } from '../../../api/types';
import { formatDate, formatOpportunityType } from '../../intelligence/utils';
import { useOpportunities } from '../hooks';
import { filterOpportunities, formatDiscoveryDeadline } from '../utils';

interface OpportunityPickerProps {
  selectedId: string | null;
  disabled?: boolean;
  onSelect: (opportunity: OpportunityListItem) => void;
}

export function OpportunityPicker({
  selectedId,
  disabled,
  onSelect,
}: OpportunityPickerProps) {
  const query = useOpportunities();
  const [keyword, setKeyword] = useState('');
  const items = query.data;
  const filtered = useMemo(
    () => filterOpportunities(items ?? [], keyword),
    [items, keyword],
  );
  const error = query.error instanceof ApiError ? query.error : null;

  if (query.isError && error) {
    return (
      <div className="analysis-error" role="alert">
        <p className="analysis-error__message">暂时无法加载机会列表</p>
        <button type="button" className="btn" onClick={() => void query.refetch()}>
          重新加载
        </button>
      </div>
    );
  }

  return (
    <div className="discovery-picker">
      <div className="field">
        <label className="field__label" htmlFor="opportunity-search">
          搜索机会
        </label>
        <input
          id="opportunity-search"
          className="field__control"
          type="search"
          value={keyword}
          disabled={disabled || query.isLoading}
          placeholder="按标题或发布主体筛选"
          onChange={(event) => setKeyword(event.target.value)}
        />
      </div>
      <p className="discovery-picker__hint">
        当前仅在已加载的 {items?.length ?? 0} 条机会中筛选。
      </p>

      {query.isLoading ? (
        <p className="muted-copy">正在加载机会…</p>
      ) : filtered.length === 0 ? (
        <p className="muted-copy">
          {!items?.length ? '暂无可选机会' : '没有匹配的已加载机会'}
        </p>
      ) : (
        <div className="discovery-picker__list" role="listbox" aria-label="机会列表">
          {filtered.map((item) => (
            <OpportunityCard
              key={item.id}
              item={item}
              selected={item.id === selectedId}
              disabled={disabled}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function OpportunityCard({
  item,
  selected,
  disabled,
  onSelect,
}: {
  item: OpportunityListItem;
  selected: boolean;
  disabled?: boolean;
  onSelect: (opportunity: OpportunityListItem) => void;
}) {
  const deadline = formatDiscoveryDeadline(item.deadline);
  const region = item.region?.trim();
  const meta = [region, deadline].filter(Boolean).join(' · ');

  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      disabled={disabled}
      className={`discovery-pick-card${selected ? ' discovery-pick-card--selected' : ''}`}
      onClick={() => onSelect(item)}
    >
      <div className="discovery-pick-card__type">
        {formatOpportunityType(item.type)}
      </div>
      <div className="discovery-pick-card__title">{item.title}</div>
      {item.issuer ? (
        <div className="discovery-pick-card__meta">{item.issuer}</div>
      ) : null}
      {meta ? <div className="discovery-pick-card__meta">{meta}</div> : null}
      {item.deadline && !deadline ? (
        <div className="discovery-pick-card__meta">截止 {formatDate(item.deadline)}</div>
      ) : null}
    </button>
  );
}
