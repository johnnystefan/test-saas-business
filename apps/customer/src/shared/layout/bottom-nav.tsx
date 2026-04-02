import { NavLink } from 'react-router-dom';
import { Home, CreditCard, Building2, User } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/memberships', label: 'Memberships', icon: CreditCard },
  { to: '/academies', label: 'Academies', icon: Building2 },
  { to: '/profile', label: 'Profile', icon: User },
] as const;

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#111827] border-t border-[#9CA3AF]/20 z-50">
      <ul className="flex justify-around items-center h-16 max-w-md mx-auto px-4">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-2 text-xs font-medium transition-colors ${
                  isActive ? 'text-[#22C55E]' : 'text-[#9CA3AF]'
                }`
              }
            >
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
