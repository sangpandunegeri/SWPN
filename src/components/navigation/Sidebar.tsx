import React from 'react';
import {
  LayoutDashboard,
  Users,
  QrCode,
  Compass,
  Newspaper,
  ShoppingBag,
  BarChart3,
  Palette,
  ShieldCheck,
  GraduationCap,
  Award,
  Code2,
  UserPlus,
  X,
} from 'lucide-react';
import { NAVIGATION_ITEMS, NavigationItem } from '../../config/navigation.config';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';
import { Badge } from '../ui/Badge';
import { cn } from '../../utils/cn';

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="w-4 h-4 shrink-0" />,
  UserPlus: <UserPlus className="w-4 h-4 shrink-0" />,
  Users: <Users className="w-4 h-4 shrink-0" />,
  QrCode: <QrCode className="w-4 h-4 shrink-0" />,
  GraduationCap: <GraduationCap className="w-4 h-4 shrink-0" />,
  Award: <Award className="w-4 h-4 shrink-0" />,
  Compass: <Compass className="w-4 h-4 shrink-0" />,
  Newspaper: <Newspaper className="w-4 h-4 shrink-0" />,
  ShoppingBag: <ShoppingBag className="w-4 h-4 shrink-0" />,
  BarChart3: <BarChart3 className="w-4 h-4 shrink-0" />,
  ShieldCheck: <ShieldCheck className="w-4 h-4 shrink-0" />,
  Palette: <Palette className="w-4 h-4 shrink-0" />,
  Code2: <Code2 className="w-4 h-4 shrink-0" />,
};

export const Sidebar: React.FC = () => {
  const { currentUser } = useAuthStore();
  const { activeView, setActiveView, isSidebarOpen, setSidebarOpen } = useUIStore();

  // Filter navigation items dynamically based on current user's role
  const authorizedNavItems = NAVIGATION_ITEMS.filter((item) =>
    item.roles.includes(currentUser.role)
  );

  const renderNavGroup = (items: NavigationItem[], title?: string) => {
    if (items.length === 0) return null;
    return (
      <div className="space-y-1 mb-5">
        {title && (
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            {title}
          </p>
        )}
        {items.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={cn(
                "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer text-left",
                isActive
                  ? "bg-[#0066B3] text-white shadow-sm font-semibold"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <div className="flex items-center gap-3">
                <span className={cn(isActive ? "text-white" : "text-slate-500")}>
                  {iconMap[item.iconName]}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <Badge
                  size="sm"
                  variant={isActive ? "neutral" : "orange"}
                  className="text-[10px] py-0 px-1.5"
                >
                  {item.badge}
                </Badge>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  const mainItems = authorizedNavItems.filter((i) => i.category === 'main');
  const ecosystemItems = authorizedNavItems.filter((i) => i.category === 'ecosystem');
  const managementItems = authorizedNavItems.filter((i) => i.category === 'management');
  const systemItems = authorizedNavItems.filter((i) => i.category === 'system');

  return (
    <>
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-200 lg:translate-x-0",
          isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0066B3] to-[#009B4D] flex items-center justify-center text-white font-bold text-sm shadow-sm">
              SP
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 text-sm tracking-tight">SPWN Apps</span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-[#0066B3] text-white">2.0</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">SAKA Pariwisata Network</p>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Active Persona Badge */}
        <div className="p-3 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs">
            <ShieldCheck className="w-4 h-4 text-[#009B4D] shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Active Role</p>
              <p className="font-semibold text-slate-800 truncate text-xs">{currentUser.roleName}</p>
            </div>
          </div>
        </div>

        {/* Scrollable Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          {renderNavGroup(mainItems)}
          {renderNavGroup(ecosystemItems, "Ekosistem Pariwisata")}
          {renderNavGroup(managementItems, "Manajemen & Analitik")}
          {renderNavGroup(systemItems, "Platform Foundation")}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-100 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#009B4D] animate-pulse" />
            <span className="text-[11px] font-semibold text-slate-700">Wonderful Indonesia</span>
          </div>
          <p className="text-[10px] text-slate-400">Clean Hybrid Architecture v2.0</p>
        </div>
      </aside>
    </>
  );
};
