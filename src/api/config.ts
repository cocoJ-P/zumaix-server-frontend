const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

if (!configuredBaseUrl) {
  throw new Error(
    '缺少 VITE_API_BASE_URL。请复制 .env.example 为 .env.development，并设置筑脉企服 Backend 地址。',
  );
}

export const API_BASE_URL = configuredBaseUrl.replace(/\/+$/, '');
