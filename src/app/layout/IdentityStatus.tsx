import { ApiError } from '../../api/errors';
import {
  getIdentityErrorMessage,
  useCurrentIdentity,
} from '../../hooks/useCurrentIdentity';

export function IdentityStatus() {
  const { data, isPending, isError, error } = useCurrentIdentity();

  if (isPending) {
    return (
      <div className="topbar-identity" aria-live="polite">
        <span className="topbar-identity__user">身份加载中</span>
      </div>
    );
  }

  if (isError) {
    const apiError = error instanceof ApiError ? error : null;

    return (
      <div
        className="topbar-identity topbar-identity--error"
        title={apiError?.code}
        aria-live="polite"
      >
        <span className="topbar-identity__user">
          {apiError
            ? getIdentityErrorMessage(apiError)
            : '企业上下文不可用'}
        </span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="topbar-identity" aria-live="polite">
        <span className="topbar-identity__user">身份加载中</span>
      </div>
    );
  }

  return (
    <div className="topbar-identity">
      <span className="topbar-identity__enterprise">
        {data.enterprise.name}
      </span>
      <span className="topbar-identity__user">{data.user.display_name}</span>
    </div>
  );
}
