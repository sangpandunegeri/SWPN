import React from 'react';
import {
  LayoutDashboard,
  Users,
  Compass,
  ShoppingBag,
  Palette,
} from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { useAuthStore } from '../../stores/authStore';
import { ROLES } from '../../config/constants';
import { cn } from '../../utils/cn';

export const BottomNavigation: React.FC = () => {
  const { activeView, setActiveView } = useUIStore();
  const { currentUser } = useAuthStore();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'membership', label: 'Member', icon: <Users className="w-5 h-5" />, requiresAuth: true },
    { id: 'tourism', label: 'Pariwisata', icon: <Compass className="w-5 h-5" /> },
    { id: 'commerce', label: 'Pasar', icon: <ShoppingBag className="w-5 h-5" /> },
    { id: 'design-system', label: 'UI Kit', icon: <Palette className="w-5 h-5" /> },
  ];

  const visibleItems = navItems.filter((item) => {
    if (item.requiresAuth && currentUser.role === ROLES.PUBLIC_USER) {
      return false;
    }
    return true;
  });

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 flex items-center justify-around lg:hidden">
      {visibleItems.map((item) => {
        const isActive = activeView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={cn(
              "flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors cursor-pointer",
              isActive ? "text-[#0066B3] font-semibold" : "text-slate-500 hover:text-slate-900"
            )}
          >
            <span className={cn(isActive ? "text-[#0066B3]" : "text-slate-400")}>
              {item.icon}
            </span>
            <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
