import type { DiscoveryPriority, DiscoveryStatus } from '../../api/types';

export type DiscoveryComposerTab = 'opportunity' | 'source' | 'manual';

export type DiscoveryStatusFilter = Extract<DiscoveryStatus, 'active' | 'withdrawn'>;

export const DISCOVERY_PAGE_SIZE = 20;

export const DEFAULT_DISCOVERY_PRIORITY: DiscoveryPriority = 'normal';
