export type LeadSignal = 'high_intent' | 'in_progress' | 'follow_up' | 'watching';

export type LeadSignalFilter = 'all' | LeadSignal;

export type BehaviorKind =
  | 'view_discovery'
  | 'save_discovery'
  | 'defer_discovery'
  | 'open_content'
  | 'submit'
  | 'continue_service'
  | 'revisit';

export interface BehaviorEvent {
  id: string;
  atLabel: string;
  kind: BehaviorKind;
  title: string;
}

export interface EnterpriseLead {
  id: string;
  enterpriseId: string;
  signal: LeadSignal;
  summary: string;
  implication: string;
  focusContent: string;
  lastActionLabel: string;
  lastAtLabel: string;
  events: BehaviorEvent[];
}
