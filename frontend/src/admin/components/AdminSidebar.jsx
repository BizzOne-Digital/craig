import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn.js';
import { useAuth } from '../../hooks/useAuth.js';
import Button from '../../components/ui/Button.jsx';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', end: true },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/services', label: 'Services' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/testimonials', label: 'Testimonials' },
];

export default function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="border-b border-steel/15 px-5 py-6">
        <p className="font-display text-2xl tracking-[0.12em] text-white">JLF Admin</p>
        <p className="mt-1 text-xs text-steel">Jackson-Lashley Foundation</p>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              cn(
                'block border-l-2 px-4 py-3 text-sm font-medium uppercase tracking-[0.14em] transition-colors',
                isActive
                  ? 'border-signal bg-signal/10 text-white'
                  : 'border-transparent text-steel hover:border-steel/40 hover:bg-carbon hover:text-bone'
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-steel/15 px-5 py-4">
        {admin ? (
          <div className="mb-4">
            <p className="text-sm font-medium text-bone">{admin.name}</p>
            <p className="text-xs text-steel">{admin.email}</p>
          </div>
        ) : null}
        <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
          Sign out
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-steel/15 bg-obsidian px-4 py-3 lg:hidden">
        <p className="font-display text-xl tracking-[0.1em] text-white">JLF Admin</p>
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          className="rounded-none border border-steel/30 px-3 py-2 text-xs uppercase tracking-[0.16em] text-bone"
          aria-expanded={mobileOpen}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? 'Close' : 'Menu'}
        </button>
      </div>

      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-obsidian/80 lg:hidden"
          aria-label="Close navigation menu"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 border-r border-steel/15 bg-carbon transition-transform duration-300 lg:static lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
