import type { DiscoveryDisposition } from '../../api/types';
import type { StatusBadgeTone } from '../../components/common/StatusBadge';

export type DiscoveryFeedbackFilter =
  | 'all'
  | 'saved'
  | 'deprioritized'
  | 'seen';

export const DISCOVERY_FEEDBACK_PAGE_SIZE = 20;

export type DiscoveryFeedbackKind =
  | 'seen'
  | 'deprioritized'
  | 'accepted'
  | 'saved';

export interface DiscoveryFeedbackDisplayState {
  kind: DiscoveryFeedbackKind;
  feedbackLabel: string;
  workflowLabel: string | null;
  listStatusText: string;
  hint: string | null;
  badgeTone: StatusBadgeTone;
}

export function toDiscoveryFeedbackApiFilters(filter: DiscoveryFeedbackFilter): {
  disposition?: DiscoveryDisposition;
  seen?: boolean;
} {
  if (filter === 'saved') {
    return { disposition: 'saved' };
  }

  if (filter === 'deprioritized') {
    return { disposition: 'deprioritized' };
  }

  if (filter === 'seen') {
    return { seen: true };
  }

  return {};
}
