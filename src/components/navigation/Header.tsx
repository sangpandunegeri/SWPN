import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  UserCheck,
  QrCode,
  Shield,
  Layers,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';
import { ROLES, UserRole } from '../../config/constants';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const Header: React.FC = () => {
  const { currentUser, switchRole } = useAuthStore();
  const { toggleSidebar, setActiveView, setQuickActionModalOpen, searchQuery, setSearchQuery } = useUIStore();
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const availableRoles: { role: UserRole; label: string; badgeVariant: 'blue' | 'green' | 'orange' | 'purple' | 'magenta' | 'neutral' }[] = [
    { role: ROLES.SUPER_ADMIN, label: 'Super Admin', badgeVariant: 'blue' },
    { role: ROLES.ADMIN_PUSAT, label: 'Admin Pusat (Kwarnas)', badgeVariant: 'purple' },
    { role: ROLES.ADMIN_WILAYAH, label: 'Admin Wilayah (Kwarda Jabar)', badgeVariant: 'green' },
    { role: ROLES.TOURISM_MANAGER, label: 'Tourism Manager (Bali)', badgeVariant: 'orange' },
    { role: ROLES.CONTENT_MANAGER, label: 'Content Manager (DIY)', badgeVariant: 'magenta' },
    { role: ROLES.COMMERCE_MANAGER, label: 'Commerce Manager (Jateng)', badgeVariant: 'blue' },
    { role: ROLES.MEMBER, label: 'Member SAKA (Fajar)', badgeVariant: 'green' },
    { role: ROLES.PUBLIC_USER, label: 'Public User (Tamu)', badgeVariant: 'neutral' },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={toggleSidebar}
          className="p-2 -ml-2 text-slate-600 hover:text-slate-900 rounded-lg lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari anggota, destinasi, artikel..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-100 border border-transparent rounded-lg focus:bg-white focus:border-[#0066B3] focus:ring-2 focus:ring-[#0066B3]/20 focus:outline-none transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Right: Quick Verification, Role Switcher Simulator & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Admin Portal Trigger */}
        {(currentUser.role === ROLES.SUPER_ADMIN || currentUser.role === ROLES.ADMIN_PUSAT || currentUser.role === ROLES.ADMIN_WILAYAH) && (
          <Button
            size="sm"
            variant="primary"
            onClick={() => setActiveView('admin-portal')}
            leftIcon={<Shield className="w-3.5 h-3.5 text-white" />}
            className="hidden sm:inline-flex text-xs bg-[#0066B3] hover:bg-[#004C85]"
          >
            Portal Admin
          </Button>
        )}

        {/* Quick KTA Verify Trigger */}
        <Button
          size="sm"
          variant="outline"
          onClick={() => setActiveView('kta-verification')}
          leftIcon={<QrCode className="w-3.5 h-3.5 text-[#009B4D]" />}
          className="hidden sm:inline-flex text-xs"
        >
          Verifikasi KTA
        </Button>

        {/* Role Switcher Simulator (Enterprise RBAC Showcase) */}
        <div className="relative">
          <button
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700 text-xs font-medium cursor-pointer transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-[#0066B3]" />
            <span className="hidden md:inline">Simulasi Role:</span>
            <span className="font-semibold text-slate-900">{currentUser.role}</span>
            <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
          </button>

          {isRoleDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsRoleDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1.5 border-b border-slate-100">
                  <p className="text-[11px] font-bold uppercase text-slate-400">Ganti Persona Role</p>
                  <p className="text-xs text-slate-500">Uji coba akses menu & kapabilitas RBAC</p>
                </div>
                <div className="max-h-64 overflow-y-auto py-1">
                  {availableRoles.map((item) => (
                    <button
                      key={item.role}
                      onClick={() => {
                        switchRole(item.role);
                        setIsRoleDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left text-xs hover:bg-slate-50 flex items-center justify-between cursor-pointer"
                    >
                      <div className="space-y-0.5">
                        <p className="font-medium text-slate-800">{item.label}</p>
                        <p className="text-[10px] text-slate-400">{item.role}</p>
                      </div>
                      {currentUser.role === item.role && (
                        <Badge size="sm" variant={item.badgeVariant}>Aktif</Badge>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Notification Bell */}
        <button
          onClick={() => setQuickActionModalOpen(true)}
          className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F7941D]" />
        </button>

        {/* User Profile Summary */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <Avatar
            src={currentUser.avatarUrl}
            name={currentUser.fullName}
            size="sm"
            status="online"
          />
          <div className="hidden xl:block text-left">
            <p className="text-xs font-semibold text-slate-900 leading-tight truncate max-w-[130px]">
              {currentUser.fullName}
            </p>
            <p className="text-[10px] text-slate-400 leading-tight">{currentUser.province || 'Nasional'}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
