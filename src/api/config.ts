const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

if (!configuredBaseUrl) {
  throw new Error(
    '缺少 VITE_API_BASE_URL。请复制 .env.example 为 .env.development，并设置筑脉企服 Backend 地址。',
  );
}

export const API_BASE_URL = configuredBaseUrl.replace(/\/+$/, '');

const configuredDevUserId = import.meta.env.VITE_DEV_USER_ID?.trim();

if (
  import.meta.env.DEV &&
  configuredDevUserId &&
  !UUID_PATTERN.test(configuredDevUserId)
) {
  console.warn(
    `VITE_DEV_USER_ID 不是有效 UUID：${configuredDevUserId}。最终由 Backend 校验开发身份。`,
  );
}

export const DEV_USER_ID: string | undefined = configuredDevUserId || undefined;
