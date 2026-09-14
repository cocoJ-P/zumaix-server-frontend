import { useState } from 'react';
import { ApiError } from '../../../api/errors';
import type { CreateDiscoveryInput, DiscoveryPriority } from '../../../api/types';
import { useCreateDiscovery } from '../hooks';
import {
  DEFAULT_DISCOVERY_PRIORITY,
  type DiscoveryComposerTab,
} from '../types';
import { getDiscoveryCreateErrorMessage } from '../utils';
import { OpportunityPicker } from './OpportunityPicker';
import { PriorityField } from './PriorityField';
import { ReasonField } from './ReasonField';
import { SourcePicker } from './SourcePicker';

const TABS: { id: DiscoveryComposerTab; label: string }[] = [
  { id: 'opportunity', label: '机会' },
  { id: 'source', label: '内容源' },
  { id: 'manual', label: '手工创建' },
];

interface DiscoveryComposerProps {
  onCreated: (discoveryId: string) => void;
}

export function DiscoveryComposer({ onCreated }: DiscoveryComposerProps) {
  const createMutation = useCreateDiscovery();
  const [activeTab, setActiveTab] = useState<DiscoveryComposerTab>('opportunity');
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string | null>(
    null,
  );
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [manualTitle, setManualTitle] = useState('');
  const [manualSummary, setManualSummary] = useState('');
  const [reason, setReason] = useState('');
  const [priority, setPriority] = useState<DiscoveryPriority>(
    DEFAULT_DISCOVERY_PRIORITY,
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  const creating = createMutation.isPending;
  const createError =
    createMutation.error instanceof ApiError ? createMutation.error : null;

  function resetCurrentForm() {
    setSelectedOpportunityId(null);
    setSelectedSourceId(null);
    setManualTitle('');
    setManualSummary('');
    setReason('');
    setPriority(DEFAULT_DISCOVERY_PRIORITY);
    setValidationError(null);
  }

  function changeTab(tab: DiscoveryComposerTab) {
    setActiveTab(tab);
    setValidationError(null);
    createMutation.reset();
  }

  function buildInput(): CreateDiscoveryInput | null {
    if (activeTab === 'opportunity') {
      if (!selectedOpportunityId) {
        setValidationError('请选择一个机会');
        return null;
      }

      return {
        reference_type: 'opportunity',
        opportunity_id: selectedOpportunityId,
        reason,
        priority,
      };
    }

    if (activeTab === 'source') {
      if (!selectedSourceId) {
        setValidationError('请选择一个内容源');
        return null;
      }

      return {
        reference_type: 'source',
        source_id: selectedSourceId,
        reason,
        priority,
      };
    }

    if (!manualTitle.trim()) {
      setValidationError('请输入发现标题');
      return null;
    }

    return {
      reference_type: 'manual',
      title: manualTitle.trim(),
      summary: manualSummary,
      reason,
      priority,
    };
  }

  function handleSubmit() {
    if (creating) {
      return;
    }

    const input = buildInput();
    if (!input) {
      return;
    }

    setValidationError(null);
    createMutation.mutate(input, {
      onSuccess: (detail) => {
        resetCurrentForm();
        onCreated(detail.id);
      },
    });
  }

  return (
    <section className="discovery-composer" aria-label="创建发现">
      <div className="discovery-pane__header">
        <h2 className="discovery-pane__title">创建发现</h2>
        <p className="muted-copy">加入当前企业的「为你发现」，不会发送通知。</p>
      </div>

      <div className="intelligence-tabs" role="tablist" aria-label="发现来源">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            className="intelligence-tab"
            aria-selected={activeTab === tab.id}
            disabled={creating}
            onClick={() => changeTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'opportunity' ? (
        <OpportunityPicker
          selectedId={selectedOpportunityId}
          disabled={creating}
          onSelect={(item) => {
            setSelectedOpportunityId(item.id);
            setValidationError(null);
          }}
        />
      ) : null}

      {activeTab === 'source' ? (
        <SourcePicker
          selectedId={selectedSourceId}
          disabled={creating}
          onSelect={(item) => {
            setSelectedSourceId(item.id);
            setValidationError(null);
          }}
        />
      ) : null}

      {activeTab === 'manual' ? (
        <div className="discovery-manual-form">
          <div className="field">
            <label className="field__label" htmlFor="manual-title">
              标题
            </label>
            <input
              id="manual-title"
              className="field__control"
              value={manualTitle}
              disabled={creating}
              placeholder="例如：人工智能企业产业对接活动"
              onChange={(event) => {
                setManualTitle(event.target.value);
                setValidationError(null);
              }}
            />
          </div>
          <div className="field">
            <label className="field__label" htmlFor="manual-summary">
              摘要
            </label>
            <textarea
              id="manual-summary"
              className="field__textarea"
              value={manualSummary}
              disabled={creating}
              rows={3}
              placeholder="例如：面向成长阶段科技企业开放"
              onChange={(event) => setManualSummary(event.target.value)}
            />
          </div>
        </div>
      ) : null}

      <ReasonField value={reason} disabled={creating} onChange={setReason} />
      <PriorityField value={priority} disabled={creating} onChange={setPriority} />

      {validationError ? (
        <p className="discovery-form-error" role="alert">
          {validationError}
        </p>
      ) : null}

      {createError ? (
        <div className="analysis-error" role="alert">
          <p className="analysis-error__message">
            {getDiscoveryCreateErrorMessage(createError)}
          </p>
        </div>
      ) : null}

      <div className="discovery-composer__actions">
        <button
          type="button"
          className="btn"
          disabled={creating}
          onClick={handleSubmit}
        >
          {creating ? '正在创建发现…' : '创建发现'}
        </button>
      </div>
    </section>
  );
}
