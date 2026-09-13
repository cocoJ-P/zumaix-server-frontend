import type { InputMode } from '../types';

interface IntelligenceInputProps {
  mode: InputMode;
  url: string;
  text: string;
  disabled: boolean;
  onModeChange: (mode: InputMode) => void;
  onUrlChange: (value: string) => void;
  onTextChange: (value: string) => void;
  onSubmit: () => void;
}

export function IntelligenceInput({
  mode,
  url,
  text,
  disabled,
  onModeChange,
  onUrlChange,
  onTextChange,
  onSubmit,
}: IntelligenceInputProps) {
  return (
    <form
      className="intelligence-input"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="intelligence-tabs" role="tablist" aria-label="输入方式">
        <button
          type="button"
          role="tab"
          className="intelligence-tab"
          aria-selected={mode === 'url'}
          disabled={disabled}
          onClick={() => onModeChange('url')}
        >
          网页链接
        </button>
        <button
          type="button"
          role="tab"
          className="intelligence-tab"
          aria-selected={mode === 'text'}
          disabled={disabled}
          onClick={() => onModeChange('text')}
        >
          粘贴正文
        </button>
      </div>

      {mode === 'url' ? (
        <div className="field">
          <label className="field__label" htmlFor="intelligence-url">
            网页链接
          </label>
          <input
            id="intelligence-url"
            className="field__control"
            type="url"
            value={url}
            disabled={disabled}
            placeholder="粘贴政策、创赛、金融服务、园区服务等公开网页"
            onChange={(event) => onUrlChange(event.target.value)}
          />
        </div>
      ) : (
        <div className="field">
          <label className="field__label" htmlFor="intelligence-text">
            正文内容
          </label>
          <textarea
            id="intelligence-text"
            className="field__textarea"
            value={text}
            disabled={disabled}
            placeholder="粘贴文章正文……"
            onChange={(event) => onTextChange(event.target.value)}
          />
        </div>
      )}

      <div className="intelligence-actions">
        <button type="submit" className="btn" disabled={disabled}>
          开始分析
        </button>
      </div>
    </form>
  );
}
