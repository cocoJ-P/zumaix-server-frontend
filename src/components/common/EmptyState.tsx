interface EmptyStateProps {
  title?: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="empty-state">
      {title ? <p className="empty-state__title">{title}</p> : null}
      <p className="empty-state__description">{description}</p>
    </div>
  );
}
