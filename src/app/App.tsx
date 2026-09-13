import { AppProviders } from './providers';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

export function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}
