import createClient, { type Middleware } from 'openapi-fetch';
import { API_BASE_URL, DEV_USER_ID } from './config';
import type { paths } from './generated/schema';

export const apiClient = createClient<paths>({
  baseUrl: API_BASE_URL,
});

const DEV_USER_HEADER = 'X-Dev-User-Id';

const developmentIdentityMiddleware: Middleware = {
  onRequest({ request }) {
    if (DEV_USER_ID) {
      request.headers.set(DEV_USER_HEADER, DEV_USER_ID);
    }

    return request;
  },
};

apiClient.use(developmentIdentityMiddleware);
