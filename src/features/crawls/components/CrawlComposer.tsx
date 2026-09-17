import { useState, type FormEvent } from 'react';
import type { WhitelistSite } from '../types';

interface CrawlComposerProps {
  open: boolean;
  sites: WhitelistSite[];
  onClose: () => void;
  onCreate: (input: {
    whitelistId: string;
    title: string;
    startUrl: string;
    depth: number;
    intervalSec: number;
  }) => string | null;
}

export function CrawlComposer({
  open,
  sites,
  onClose,
  onCreate,
}: CrawlComposerProps) {
  const enabledSites = sites.filter((site) => site.enabled);
  const [whitelistId, setWhitelistId] = useState(enabledSites[0]?.id ?? '');
  const effectiveId = enabledSites.some((site) => site.id === whitelistId)
    ? whitelistId
    : (enabledSites[0]?.id ?? '');
  const selected = sites.find((site) => site.id === effectiveId);
  const [title, setTitle] = useState('');
  const [path, setPath] = useState(selected?.allowPath ?? '/');
  const [depth, setDepth] = useState(1);
  const [intervalSec, setIntervalSec] = useState(2);
  const [error, setError] = useState<string | null>(null);

  if (!open) {
    return null;
  }

  function applySite(nextId: string) {
    const next = sites.find((site) => site.id === nextId);
    setWhitelistId(nextId);
    setPath(next?.allowPath ?? '/');
    setError(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) {
      setError('先选择一个已启用的白名单站点。');
      return;
    }

    const startPath = path.startsWith('/') ? path : `/${path}`;
    const message = onCreate({
      whitelistId: selected.id,
      title: title.trim() || `${selected.name} · 公开页`,
      startUrl: `https://${selected.host}${startPath}`,
      depth,
      intervalSec,
    });
    if (message) {
      setError(message);
      return;
    }

    setTitle('');
    setError(null);
    onClose();
  }

  return (
    <section className="crawl-panel" aria-label="新建采集任务">
      <div className="crawl-panel__header">
        <h2 className="crawl-panel__title">新建任务</h2>
        <button type="button" className="btn btn--ghost" onClick={onClose}>
          取消
        </button>
      </div>
      <p className="muted-copy">
        任务只能从白名单站点发起。采集到的页面进入机会库「待整理」，不会直接出现在小程序。
      </p>

      {enabledSites.length === 0 ? (
        <p className="crawl-banner crawl-banner--warn">
          当前没有启用中的白名单站点。先到白名单启用或加入主机。
        </p>
      ) : (
        <form className="crawl-composer" onSubmit={handleSubmit}>
          <label className="field">
            <span className="field__label">白名单站点</span>
            <select
              className="field__control"
              value={effectiveId}
              onChange={(event) => applySite(event.target.value)}
            >
              {enabledSites.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name} · {site.host}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span className="field__label">任务名称</span>
            <input
              className="field__control"
              value={title}
              placeholder={selected ? `${selected.name} · 公开页` : '任务名称'}
              onChange={(event) => setTitle(event.target.value)}
            />
          </label>
          <label className="field">
            <span className="field__label">起始路径</span>
            <input
              className="field__control"
              value={path}
              onChange={(event) => setPath(event.target.value)}
            />
          </label>
          <label className="field">
            <span className="field__label">深度</span>
            <select
              className="field__control"
              value={depth}
              onChange={(event) => setDepth(Number(event.target.value))}
            >
              <option value={1}>1 层 · 只抓栏目页</option>
              <option value={2}>2 层 · 栏目 + 详情</option>
            </select>
          </label>
          <label className="field">
            <span className="field__label">间隔</span>
            <select
              className="field__control"
              value={intervalSec}
              onChange={(event) => setIntervalSec(Number(event.target.value))}
            >
              <option value={2}>2 秒 / 请求</option>
              <option value={3}>3 秒 / 请求</option>
              <option value={5}>5 秒 / 请求</option>
            </select>
          </label>
          <div className="crawl-composer__submit">
            <button type="submit" className="btn">
              开始采集
            </button>
          </div>
        </form>
      )}
      {error ? (
        <p className="crawl-banner crawl-banner--warn" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}
