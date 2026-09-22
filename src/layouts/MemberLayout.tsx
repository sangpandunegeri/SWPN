/**
 * MemberLayout
 * -----------------------------------------------------------------
 * Shell layout untuk anggota aktif SAKA Pariwisata (MEMBER).
 * Dilengkapi Header ringkas, navigasi kartu cepat, sidebar pendukung,
 * dan Bottom Navigation Bar responsif untuk pengalaman mobile-first yang optimal.
 */

import React from 'react';
import { Home, CreditCard, User, ShoppingBag, Edit3, LogOut, Shield, Award } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { ROLES } from '../config/constants';

export interface MemberLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

export const MemberLayout: React.FC<MemberLayoutProps> = ({
  children,
  activeTab = 'dashboard',
  onTabChange,
}) => {
  const { currentUser, switchRole } = useAuthStore();

  const memberTabs = [
    { id: 'dashboard', label: 'Beranda', icon: Home },
    { id: 'kta', label: 'KTA Saya', icon: CreditCard },
    { id: 'pencapaian', label: 'Pencapaian', icon: Award },
    { id: 'warta-tulis', label: 'Warta', icon: Edit3 },
    { id: 'pesanan', label: 'Kedai', icon: ShoppingBag },
    { id: 'profil', label: 'Profil', icon: User },
  ];

  const handleTabClick = (tabId: string) => {
    if (onTabChange) onTabChange(tabId);
  };

  return (
    <div id="spwn-member-layout" className="min-h-screen bg-[#F5F7FA] flex flex-col text-slate-800 pb-20 md:pb-6">
      {/* Member Top Bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand and Badge */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0066B3] flex items-center justify-center text-white font-bold text-xs shadow-sm">
            SP
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-slate-900 leading-none">Portal Anggota</h1>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                AKTIF
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 truncate max-w-[200px] sm:max-w-none">
              {currentUser.fullName} • {currentUser.memberId || 'SPWN.MEMBER'}
            </p>
          </div>
        </div>

        {/* Member Profile Avatar & Logout */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => switchRole(ROLES.PUBLIC_USER)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Keluar ke mode publik"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Keluar</span>
          </button>

          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#0066B3]/30 bg-slate-100 shrink-0">
            {currentUser.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.fullName}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-xs text-[#0066B3]">
                {currentUser.fullName.charAt(0)}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6">
        {children}
      </main>

      {/* Mobile-First Bottom Navigation Bar (WCAG Touch Target Friendly: >48px height) */}
      <nav
        id="spwn-member-bottom-nav"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around md:hidden shadow-lg"
        aria-label="Navigasi Anggota"
      >
        {memberTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-2 rounded-xl transition-all ${
                isActive
                  ? 'text-[#0066B3] font-bold scale-105'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[10px] tracking-tight mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
