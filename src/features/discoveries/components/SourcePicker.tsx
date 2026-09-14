import { useMemo, useState } from 'react';
import { ApiError } from '../../../api/errors';
import type { OpportunitySourceResponse } from '../../../api/types';
import { formatDate } from '../../intelligence/utils';
import { useSourcePickerItems } from '../hooks';
import { filterSources, sourcePickerTitle } from '../utils';

interface SourcePickerProps {
  selectedId: string | null;
  disabled?: boolean;
  onSelect: (source: OpportunitySourceResponse) => void;
}

export function SourcePicker({
  selectedId,
  disabled,
  onSelect,
}: SourcePickerProps) {
  const query = useSourcePickerItems();
  const [keyword, setKeyword] = useState('');
  const items = query.data;
  const filtered = useMemo(
    () => filterSources(items ?? [], keyword),
    [items, keyword],
  );
  const error = query.error instanceof ApiError ? query.error : null;

  if (query.isError && error) {
    return (
      <div className="analysis-error" role="alert">
        <p className="analysis-error__message">暂时无法加载内容源</p>
        <button type="button" className="btn" onClick={() => void query.refetch()}>
          重新加载
        </button>
      </div>
    );
  }

  return (
    <div className="discovery-picker">
      <div className="field">
        <label className="field__label" htmlFor="source-search">
          搜索内容源
        </label>
        <input
          id="source-search"
          className="field__control"
          type="search"
          value={keyword}
          disabled={disabled || query.isLoading}
          placeholder="按标题、发布方或链接筛选"
          onChange={(event) => setKeyword(event.target.value)}
        />
      </div>
      <p className="discovery-picker__hint">
        当前仅在已加载的 {items?.length ?? 0} 条内容源中筛选。未绑定机会的内容源暂不可列出。
      </p>

      {query.isLoading ? (
        <p className="muted-copy">正在加载内容源…</p>
      ) : filtered.length === 0 ? (
        <p className="muted-copy">
          {!items?.length ? '暂无可选内容源' : '没有匹配的已加载内容源'}
        </p>
      ) : (
        <div className="discovery-picker__list" role="listbox" aria-label="内容源列表">
          {filtered.map((item) => (
            <SourceCard
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

function SourceCard({
  item,
  selected,
  disabled,
  onSelect,
}: {
  item: OpportunitySourceResponse;
  selected: boolean;
  disabled?: boolean;
  onSelect: (source: OpportunitySourceResponse) => void;
}) {
  const publishedAt = item.published_at ? formatDate(item.published_at) : null;

  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      disabled={disabled}
      className={`discovery-pick-card${selected ? ' discovery-pick-card--selected' : ''}`}
      onClick={() => onSelect(item)}
    >
      <div className="discovery-pick-card__title">{sourcePickerTitle(item)}</div>
      {item.publisher ? (
        <div className="discovery-pick-card__meta">{item.publisher}</div>
      ) : null}
      {item.url ? (
        <div className="discovery-pick-card__meta discovery-break">{item.url}</div>
      ) : null}
      {publishedAt && publishedAt !== '—' ? (
        <div className="discovery-pick-card__meta">{publishedAt}</div>
      ) : null}
    </button>
  );
}
