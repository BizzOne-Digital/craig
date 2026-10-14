import { Outlet } from 'react-router-dom';
import AdminSidebar from '../admin/components/AdminSidebar.jsx';

export function AdminLayout() {
  return (
    <div className="min-h-screen w-full max-w-full overflow-x-clip bg-obsidian text-bone lg:flex">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
