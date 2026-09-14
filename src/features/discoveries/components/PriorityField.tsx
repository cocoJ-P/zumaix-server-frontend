import type { DiscoveryPriority } from '../../../api/types';
import { formatDiscoveryPriority } from '../utils';

const PRIORITIES: DiscoveryPriority[] = ['low', 'normal', 'high'];

interface PriorityFieldProps {
  value: DiscoveryPriority;
  disabled?: boolean;
  onChange: (value: DiscoveryPriority) => void;
}

export function PriorityField({
  value,
  disabled,
  onChange,
}: PriorityFieldProps) {
  return (
    <fieldset className="field discovery-priority">
      <legend className="field__label">优先级</legend>
      <div className="discovery-priority__options" role="radiogroup" aria-label="优先级">
        {PRIORITIES.map((priority) => (
          <label
            key={priority}
            className={`discovery-priority__option${
              value === priority ? ' discovery-priority__option--selected' : ''
            }`}
          >
            <input
              type="radio"
              name="discovery-priority"
              value={priority}
              checked={value === priority}
              disabled={disabled}
              onChange={() => onChange(priority)}
            />
            {formatDiscoveryPriority(priority)}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
