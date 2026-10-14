import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth.js';
import { ToastProvider } from './components/ui/Toast.jsx';
import AppRoutes from './routes/AppRoutes.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
