import { useMutation } from '@tanstack/react-query';
import { ingestContent } from '../../api/content';
import { analyzeOpportunitySource } from '../../api/intelligence';

export function useIngestContent() {
  return useMutation({
    mutationFn: ingestContent,
    retry: false,
  });
}

export function useAnalyzeOpportunitySource() {
  return useMutation({
    mutationFn: ({
      sourceId,
      ingestionId,
    }: {
      sourceId: string;
      ingestionId: string;
    }) =>
      analyzeOpportunitySource(sourceId, {
        ingestion_id: ingestionId,
        force: false,
      }),
    retry: false,
  });
}
