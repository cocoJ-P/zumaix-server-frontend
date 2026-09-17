export type OpportunityKind =
  | 'own_service'
  | 'policy'
  | 'vendor_service'
  | 'event';

export type OpportunityOrigin = 'curated' | 'capture';

export type OpportunityShelfStatus = 'ready' | 'draft' | 'needs_review';

export type OpportunityKindFilter = 'all' | OpportunityKind;

export interface OpportunityWarehouseItem {
  id: string;
  title: string;
  kind: OpportunityKind;
  publisher: string;
  summary: string;
  audience: string;
  origin: OpportunityOrigin;
  status: OpportunityShelfStatus;
  sourceLabel: string;
  updatedAtLabel: string;
  captureUrl?: string;
}
