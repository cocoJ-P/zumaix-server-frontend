export type ParkId = 'digital' | 'robot' | 'exhibition';

export type ParkFilter = 'all' | ParkId;

export type ParkEnterpriseStatus = 'in_park' | 'in_service' | 'pending';

export interface Park {
  id: ParkId;
  name: string;
  focus: string;
  summary: string;
}

export interface ParkEnterprise {
  id: string;
  parkId: ParkId;
  name: string;
  industry: string;
  stage: string;
  peopleLabel: string;
  status: ParkEnterpriseStatus;
  summary: string;
  needs: string;
}
