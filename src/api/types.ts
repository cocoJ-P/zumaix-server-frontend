import type { components } from './generated/schema';

export type HealthResponse = components['schemas']['HealthResponse'];
export type CurrentIdentityResponse = components['schemas']['MeResponse'];
export type IngestRequest = components['schemas']['IngestRequest'];
export type IngestResponse = components['schemas']['IngestResponse'];
export type AnalyzeRequest = components['schemas']['AnalyzeRequest'];
export type IntelligenceAnalyzeResponse =
  components['schemas']['IntelligenceAnalyzeResponse'];
export type ContentIntelligenceResult =
  components['schemas']['ContentIntelligenceResult'];
export type IntelligenceRunResponse =
  components['schemas']['IntelligenceRunResponse'];
export type OpportunityClaim = components['schemas']['OpportunityClaim'];
export type SourceAssessment = components['schemas']['SourceAssessment'];
export type IntelligenceEvidence = components['schemas']['IntelligenceEvidence'];
export type ClaimedRequirement = components['schemas']['ClaimedRequirement'];
export type NormalizedContent = components['schemas']['NormalizedContent'];
export type UserSubmissionListResponse =
  components['schemas']['UserSubmissionListResponse'];
export type UserSubmissionSummary = components['schemas']['UserSubmissionSummary'];
export type UserSubmissionDetail = components['schemas']['UserSubmissionDetail'];
export type SubmissionRecord = components['schemas']['SubmissionRecord'];
export type SubmissionContentSummary =
  components['schemas']['SubmissionContentSummary'];
export type SubmissionIntelligenceSummary =
  components['schemas']['SubmissionIntelligenceSummary'];
export type SubmissionStatus = components['schemas']['SubmissionStatus'];
export type SubmissionFailureStage =
  components['schemas']['SubmissionFailureStage'];
export type SubmissionInputType = components['schemas']['SubmissionInputType'];
export type CreateOpportunityDiscoveryRequest =
  components['schemas']['CreateOpportunityDiscoveryRequest'];
export type CreateSourceDiscoveryRequest =
  components['schemas']['CreateSourceDiscoveryRequest'];
export type CreateManualDiscoveryRequest =
  components['schemas']['CreateManualDiscoveryRequest'];
export type DiscoveryItemListResponse =
  components['schemas']['DiscoveryItemListResponse'];
export type DiscoveryItemSummary = components['schemas']['DiscoveryItemSummary'];
export type DiscoveryItemDetail = components['schemas']['DiscoveryItemDetail'];
export type DiscoveryPriority = components['schemas']['DiscoveryPriority'];
export type DiscoveryStatus = components['schemas']['DiscoveryStatus'];
export type DiscoveryReferenceType =
  components['schemas']['DiscoveryReferenceType'];
export type DiscoveryActor = components['schemas']['DiscoveryActor'];
export type OpportunityListItem = components['schemas']['OpportunityListItem'];
export type OpportunitySourceResponse =
  components['schemas']['OpportunitySourceResponse'];
export type OpportunityType = components['schemas']['OpportunityType'];

export type CreateDiscoveryInput =
  | CreateOpportunityDiscoveryRequest
  | CreateSourceDiscoveryRequest
  | CreateManualDiscoveryRequest;
export type DiscoveryUserStateListResponse =
  components['schemas']['DiscoveryUserStateListResponse'];
export type DiscoveryUserStateListItem =
  components['schemas']['DiscoveryUserStateListItem'];
export type DiscoveryUserStateDiscoveryRef =
  components['schemas']['DiscoveryUserStateDiscoveryRef'];
export type DiscoveryUserStateUserRef =
  components['schemas']['DiscoveryUserStateUserRef'];
export type LinkedDiscoverySubmission =
  components['schemas']['LinkedDiscoverySubmission'];
export type DiscoveryDisposition =
  components['schemas']['DiscoveryDisposition'];
export type SubmissionOriginType =
  components['schemas']['SubmissionOriginType'];
