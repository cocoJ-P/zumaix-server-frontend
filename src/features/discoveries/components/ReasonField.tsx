interface ReasonFieldProps {
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

export function ReasonField({ value, disabled, onChange }: ReasonFieldProps) {
  return (
    <div className="field">
      <label className="field__label" htmlFor="discovery-reason">
        推荐理由
      </label>
      <textarea
        id="discovery-reason"
        className="field__textarea"
        value={value}
        disabled={disabled}
        rows={3}
        placeholder="例如：与你当前的 AI 研发方向和科技型企业阶段高度相关"
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
