import { useState, type FormEvent } from 'react';
import type { WhitelistKind, WhitelistSite } from '../types';
import { formatRobotsPolicy, formatWhitelistKind, isValidHost, normalizeHost } from '../utils';

interface CrawlWhitelistProps {
  sites: WhitelistSite[];
  onToggle: (id: string) => void;
  onRemove: (id: string) => string | null;
  onAdd: (input: {
    host: string;
    name: string;
    kind: WhitelistKind;
    allowPath: string;
  }) => string | null;
}

export function CrawlWhitelist({
  sites,
  onToggle,
  onRemove,
  onAdd,
}: CrawlWhitelistProps) {
  const [host, setHost] = useState('');
  const [name, setName] = useState('');
  const [kind, setKind] = useState<WhitelistKind>('policy');
  const [allowPath, setAllowPath] = useState('/');
  const [error, setError] = useState<string | null>(null);
  const [pendingRemoveId, setPendingRemoveId] = useState<string | null>(null);

  function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = normalizeHost(host);
    if (!isValidHost(normalized)) {
      setError('请输入主机名，例如 kjj.example.gov.cn，不要带路径。');
      return;
    }

    const message = onAdd({
      host: normalized,
      name: name.trim() || normalized,
      kind,
      allowPath: allowPath.trim() || '/',
    });
    if (message) {
      setError(message);
      return;
    }

    setHost('');
    setName('');
    setAllowPath('/');
    setKind('policy');
    setError(null);
  }

  return (
    <div className="crawl-whitelist">
      <section className="crawl-panel">
        <h2 className="crawl-panel__title">加入白名单</h2>
        <p className="muted-copy">
          只采集名单内的公开主机。不登录、不绕过 robots.txt、不抓名单外的跳转域名。
        </p>
        <form className="crawl-whitelist__form" onSubmit={handleAdd}>
          <label className="field">
            <span className="field__label">主机</span>
            <input
              className="field__control"
              value={host}
              placeholder="kjj.example.gov.cn"
              onChange={(event) => {
                setHost(event.target.value);
                setError(null);
              }}
            />
          </label>
          <label className="field">
            <span className="field__label">机构名称</span>
            <input
              className="field__control"
              value={name}
              placeholder="市科技局"
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          <label className="field">
            <span className="field__label">内容类型</span>
            <select
              className="field__control"
              value={kind}
              onChange={(event) => setKind(event.target.value as WhitelistKind)}
            >
              <option value="policy">政策</option>
              <option value="vendor">服务商</option>
              <option value="event">活动</option>
            </select>
          </label>
          <label className="field">
            <span className="field__label">允许路径</span>
            <input
              className="field__control"
              value={allowPath}
              placeholder="/zhengce"
              onChange={(event) => setAllowPath(event.target.value)}
            />
          </label>
          <div className="crawl-whitelist__submit">
            <button type="submit" className="btn">
              加入白名单
            </button>
          </div>
        </form>
        {error ? (
          <p className="crawl-banner crawl-banner--warn" role="alert">
            {error}
          </p>
        ) : null}
      </section>

      <section className="crawl-panel" aria-label="白名单站点">
        <h2 className="crawl-panel__title">已登记站点</h2>
        <ul className="crawl-whitelist__list">
          {sites.map((site) => (
            <li key={site.id} className="crawl-whitelist__item">
              <div>
                <p className="crawl-whitelist__host">{site.host}</p>
                <p className="muted-copy">
                  {site.name}
                  {' · '}
                  {formatWhitelistKind(site.kind)}
                  {' · '}
                  {formatRobotsPolicy(site.robots)}
                  {' · '}
                  {site.allowPath}
                </p>
                <p className="opportunity-footnote">{site.note}</p>
              </div>
              <div className="crawl-whitelist__actions">
                <button
                  type="button"
                  className={site.enabled ? 'btn btn--secondary' : 'btn'}
                  onClick={() => onToggle(site.id)}
                >
                  {site.enabled ? '停用' : '启用'}
                </button>
                {pendingRemoveId === site.id ? (
                  <>
                    <button
                      type="button"
                      className="btn btn--secondary"
                      onClick={() => {
                        const message = onRemove(site.id);
                        if (message) {
                          setError(message);
                          setPendingRemoveId(null);
                          return;
                        }
                        setPendingRemoveId(null);
                        setError(null);
                      }}
                    >
                      确认移除
                    </button>
                    <button
                      type="button"
                      className="btn btn--ghost"
                      onClick={() => setPendingRemoveId(null)}
                    >
                      取消
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => setPendingRemoveId(site.id)}
                  >
                    移除
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
