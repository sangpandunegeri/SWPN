/**
 * SPWN Apps 2.0 - Admin Dashboard Overview (Module 1)
 * Location: src/features/admin/components/AdminDashboardOverview.tsx
 */

import React, { useMemo } from 'react';
import {
  Users,
  Clock,
  CheckCircle2,
  CreditCard,
  Compass,
  Utensils,
  Map,
  Smile,
  ChevronRight,
  TrendingUp,
  Award,
  AlertCircle,
} from 'lucide-react';
import { useAdminStore } from '../stores/adminStore';
import { KRIDA_MASTER } from '../../../config/constants';

export const AdminDashboardOverview: React.FC = () => {
  const {
    members,
    ktaLogs,
    approvals,
    simulatedScope,
    scopeProvinceId,
    scopeRegencyId,
    setActiveTab,
  } = useAdminStore();

  // Filter members based on regional scope
  const scopedMembers = useMemo(() => {
    return members.filter((m) => {
      if (simulatedScope === 'ADMIN_WILAYAH') {
        if (scopeProvinceId !== 'ALL' && m.provinsi_id !== scopeProvinceId) return false;
        if (scopeRegencyId !== 'ALL' && m.kabupaten_id !== scopeRegencyId) return false;
      }
      return true;
    });
  }, [members, simulatedScope, scopeProvinceId, scopeRegencyId]);

  // Metrics
  const totalCount = scopedMembers.length;
  const verificationCount = scopedMembers.filter(
    (m) => m.status_anggota === 'PENDING'
  ).length;
  const approvedReadyCount = scopedMembers.filter((m) => m.status_anggota === 'REVIEWED_VERIFIED').length;
  const activeKtaCount = scopedMembers.filter((m) => m.status_anggota === 'ACTIVE' || m.kta_status === 'ACTIVE').length;

  // Krida distribution
  const kridaCounts = useMemo(() => {
    return KRIDA_MASTER.map((k) => {
      const count = scopedMembers.filter((m) => m.krida_id === k.id).length;
      const percentage = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
      return { ...k, count, percentage };
    });
  }, [scopedMembers, totalCount]);

  // Province distribution
  const provinceCounts = useMemo(() => {
    const map: Record<string, { name: string; count: number }> = {};
    scopedMembers.forEach((m) => {
      const pName = m.provinsi_nama || 'Provinsi Lainnya';
      if (!map[pName]) {
        map[pName] = { name: pName, count: 0 };
      }
      map[pName].count += 1;
    });
    return Object.values(map).sort((a, b) => b.count - a.count);
  }, [scopedMembers]);

  return (
    <div className="space-y-6">
      {/* 1. Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Anggota */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Anggota</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0066B3] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {totalCount}
            </span>
            <span className="text-xs text-slate-500 font-medium">jiwa</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <span className="text-emerald-600 font-semibold">+12%</span> bulan ini
          </div>
        </div>

        {/* Menunggu Verifikasi */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Menunggu Verifikasi</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-600 tracking-tight">
              {verificationCount}
            </span>
            <span className="text-xs text-slate-500 font-medium">berkas</span>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('members')}
            className="mt-2 text-xs text-amber-700 font-semibold hover:underline flex items-center gap-1"
          >
            Buka Antrean Approval <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Siap Aktivasi KTA */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Siap Aktivasi KTA</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-purple-700 tracking-tight">
              {approvedReadyCount}
            </span>
            <span className="text-xs text-slate-500 font-medium">anggota</span>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('kta')}
            className="mt-2 text-xs text-purple-700 font-semibold hover:underline flex items-center gap-1"
          >
            Terbitkan KTA Otomatis <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* KTA Aktif Terbit */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">KTA Digital Aktif</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#009B4D] flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#009B4D] tracking-tight">
              {activeKtaCount}
            </span>
            <span className="text-xs text-slate-500 font-medium">kartu</span>
          </div>
          <div className="mt-2 text-xs text-emerald-700 font-medium">
            100% QR Scanner Valid
          </div>
        </div>
      </div>

      {/* 2. Main Analytics Row: Distribusi Krida & Sebaran Wilayah */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Distribusi Anggota per Krida */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Distribusi Peminatan 4 Krida</h3>
              <p className="text-xs text-slate-500 mt-0.5">Spesialisasi keahlian pariwisata anggota</p>
            </div>
            <span className="text-xs font-bold text-[#0066B3] bg-blue-50 px-2.5 py-1 rounded-full">
              4 Krida SAKA
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {kridaCounts.map((k) => (
              <div key={k.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-800 flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: k.color }}
                    />
                    {k.name}
                  </span>
                  <span className="text-slate-600">
                    {k.count} jiwa ({k.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${k.percentage}%`,
                      backgroundColor: k.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Standar Syarat Kecakapan Khusus (23 SKK)</span>
            <button
              type="button"
              onClick={() => setActiveTab('members')}
              className="text-[#0066B3] font-semibold hover:underline"
            >
              Lihat di Direktori &rarr;
            </button>
          </div>
        </div>

        {/* Sebaran Wilayah / Geo Summary */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Sebaran Wilayah & Kwarda</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {simulatedScope === 'ADMIN_WILAYAH' ? 'Kabupaten/Kota Terbanyak' : 'Provinsi Teraktif'}
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              BPS Standard
            </span>
          </div>

          <div className="mt-5 space-y-3.5">
            {provinceCounts.slice(0, 5).map((p, idx) => {
              const pct = totalCount > 0 ? Math.round((p.count / totalCount) * 100) : 0;
              return (
                <div key={p.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-[10px] shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-slate-800 truncate">{p.name}</span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden hidden sm:block">
                      <div
                        className="bg-[#009B4D] h-full rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="font-bold text-slate-900 w-12 text-right">
                      {p.count} <span className="text-[10px] font-normal text-slate-500">anggota</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Total 38 Provinsi & 514 Kabupaten/Kota</span>
            <button
              type="button"
              onClick={() => setActiveTab('regions')}
              className="text-[#009B4D] font-semibold hover:underline"
            >
              Buka Master Wilayah &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* 3. Status Antrean Cepat & Log Terbaru */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              Aktivitas Administrasi Real-time
            </span>
            <h4 className="text-sm font-bold text-white mt-0.5">
              Riwayat Penerbitan KTA & Verifikasi Terkini
            </h4>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className="text-xs text-slate-300 hover:text-white font-medium self-start sm:self-auto bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700"
          >
            Audit Log Lengkap &rarr;
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {ktaLogs.slice(0, 3).map((log) => (
            <div
              key={log.id}
              className="bg-slate-800/80 rounded-xl p-3.5 border border-slate-700/80 text-xs space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-emerald-400">{log.nomor_kta}</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-800">
                  {log.action_type}
                </span>
              </div>
              <p className="text-slate-200 font-medium truncate">{log.reason}</p>
              <p className="text-[11px] text-slate-400">
                Oleh: <span className="text-slate-300">{log.generated_by}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
