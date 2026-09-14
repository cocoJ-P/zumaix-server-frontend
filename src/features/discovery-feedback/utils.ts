import { ApiError } from '../../api/errors';
import type {
  DiscoveryUserStateListItem,
  LinkedDiscoverySubmission,
  SubmissionStatus,
} from '../../api/types';
import {
  formatSubmissionFailureStage,
  mapSubmissionError,
} from '../submissions/utils';
import type { DiscoveryFeedbackDisplayState } from './types';

const WORKFLOW_STATUS_LABEL: Record<SubmissionStatus, string> = {
  pending: '待处理',
  ingesting: '读取中',
  analyzing: '分析中',
  succeeded: '已解析',
  failed: '解析失败',
};

export function formatLinkedSubmissionStatus(
  status: SubmissionStatus | null | undefined,
): string {
  return status ? WORKFLOW_STATUS_LABEL[status] : '—';
}

export function deriveDiscoveryFeedbackDisplayState(
  item: Pick<
    DiscoveryUserStateListItem,
    'seen_at' | 'disposition' | 'linked_submission'
  >,
): DiscoveryFeedbackDisplayState {
  const linked = item.linked_submission ?? null;

  if (item.disposition === 'deprioritized') {
    return {
      kind: 'deprioritized',
      feedbackLabel: '稍后',
      workflowLabel: null,
      listStatusText: '稍后',
      hint: null,
      badgeTone: 'pending',
    };
  }

  if (item.disposition === 'saved') {
    if (linked) {
      const workflowLabel = formatLinkedSubmissionStatus(linked.status);
      return {
        kind: 'accepted',
        feedbackLabel: '已接受',
        workflowLabel,
        listStatusText: `已接受 · ${workflowLabel}`,
        hint: null,
        badgeTone:
          linked.status === 'failed'
            ? 'danger'
            : linked.status === 'succeeded'
              ? 'success'
              : 'progress',
      };
    }

    return {
      kind: 'saved',
      feedbackLabel: '已保存',
      workflowLabel: null,
      listStatusText: '已保存',
      hint: '尚未进入解析工作流',
      badgeTone: 'progress',
    };
  }

  return {
    kind: 'seen',
    feedbackLabel: '已查看',
    workflowLabel: null,
    listStatusText: '已查看',
    hint: '尚未明确判断',
    badgeTone: 'pending',
  };
}

export function formatFeedbackFailureStage(
  submission: LinkedDiscoverySubmission | null | undefined,
): string | null {
  if (!submission || submission.status !== 'failed') {
    return null;
  }

  const stage = formatSubmissionFailureStage(submission.failure_stage);
  return stage === '—' ? null : stage;
}

export function formatFeedbackFailureMessage(
  submission: LinkedDiscoverySubmission | null | undefined,
): string | null {
  if (!submission || submission.status !== 'failed') {
    return null;
  }

  const mapped = mapSubmissionError(submission.error_code);
  if (mapped !== '处理未完成') {
    return mapped;
  }

  const message = submission.error_message?.trim();
  if (message && !looksLikeTechnicalDump(message)) {
    return message;
  }

  return '解析未完成';
}

export function getDiscoveryFeedbackErrorMessage(error: ApiError): string {
  if (isIdentityScopeError(error)) {
    return '当前身份不可用，暂时无法查看发现反馈。';
  }

  return '暂时无法加载发现反馈';
}

export function isIdentityScopeError(error: ApiError): boolean {
  return (
    error.code === 'DEV_IDENTITY_REQUIRED' ||
    error.code === 'AUTHENTICATION_REQUIRED' ||
    error.code === 'ENTERPRISE_CONTEXT_REQUIRED'
  );
}

function looksLikeTechnicalDump(message: string): boolean {
  return (
    message.includes('\n') ||
    /traceback|exception|stack|error:/i.test(message)
  );
}
